<template>
    <div data-testid="users-page">
      <h3>Users</h3>

      <Msg 
        :msgGood="msgGood"                        
        :msgWrong="msgWrong"
      ></Msg>

      <div class="container">

        <div class="row">
          <div class="col-5">
            <button role="button_add_client" @click.prevent="addClient" class="add-page-btn  btn btn-primary mt-2 mb-2 mr-2" :disabled="pre_loader">
              <i v-if="!pre_loader" class="fas fa-plus"></i>

              <span role="pre_loader_add_client" v-if="pre_loader" class="spinner-grow spinner-grow-sm"></span>
              Add Client
            </button>  
          </div>      
          
          <div  class="col-7 d-flex align-items-baseline">            

                <input type="input" class="form-control col" name="search"  v-model="searchValue" />
              
                <button role="button_search_client" @click.prevent="searchClients" class="add-page-btn  btn btn-primary mt-2 mb-2 mr-2" :disabled="pre_loader">
                  <i v-if="!pre_loader" class="fas fa-search"></i>
                  <span role="pre_loader_search_client" v-if="pre_loader" class="spinner-grow spinner-grow-sm"></span>
                  <span>Search client</span>
                </button>                  

          </div>        
        </div>

        <table class="table mt-2 mb-4">
          <thead>
            <tr>
              <th scope="col">#</th>

              <th scope="col">Name
                <TableSort
                  :sortColumn="'name'"
                  @onClickAsc="sortingAsc('name')"
                  @onClickDesc="sortingDesc('name')"
                  :pre_loader="pre_loader"      
                  :column = "column"
                  :direction = "direction"                                  
                ></TableSort>
              </th>

              <th scope="col">Email
                <TableSort
                  :sortColumn="'email'"
                  @onClickAsc="sortingAsc('email')"
                  @onClickDesc="sortingDesc('email')"
                  :pre_loader="pre_loader"                        
                  :column = "column"
                  :direction = "direction"                                  
                ></TableSort>
              </th>

              <th scope="col">Created
                <TableSort
                  :sortColumn="'created_at'"
                  @onClickAsc="sortingAsc('created_at')"
                  @onClickDesc="sortingDesc('created_at')"
                  :pre_loader="pre_loader"                        
                  :column = "column"
                  :direction = "direction"                                  
                ></TableSort>
              </th>
              <th scope="col">Action</th>
            </tr>
            
          </thead>
          <tbody>

            <tr v-for="(c, index) in clients.data" :key="index">
              <th scope="row">{{ index+1 }}</th>
              <td>{{ c['name'] }}</td>
              <td>{{ c['email'] }}</td>
              <td>{{ c['created_at'] ?  c['created_at'].split("T")[0] : '' }}</td>
              <td>
                <span role="edit_client" class="me-1" :class="{ 'disabled-if-loader': pre_loader }"  @click="editClient(c['id'])"><i class="far fa-edit cursor-pointer"></i></span>
                <span role="del_client" class="ms-1"  :class="{ 'disabled-if-loader': pre_loader }" @click="delClient(c['id'])"><i class="fas fa-trash cursor-pointer"></i></span>                
              </td>
            </tr>

          </tbody>
        </table>  

        <nav aria-label="Page navigation example">
          <ul class="pagination justify-content-end">            
            <li v-for="(link, index) in clients.links" :key="index" class="page-item"  :class="{ 'disabled': (!link['url'] || pre_loader ), 'active': link['active'] }" >
              <a role="pagination_links" class="page-link"  @click="link['url'] && changePageByUrl(link['url'])"  v-html="link.label"></a>
            </li>
          </ul>
        </nav>

      </div><!--  container -->

    </div>
</template>
<script>
import functions from "../helpers/functions.js";
import storage from "../state/storage";
import { getClients, deleteClient } from "../api/apiCalls";
import Msg from "../components/Msg";
import TableSort from "../components/TableSort";

export default {    
  name: "UserPage",
  components: {
    Msg,
    TableSort
  },

  data() {

    const { token } = functions.retrieveParamsFromStorage( storage );
    return {
      token: this.$store.state.auth.token || token,
      msgWrong: '',
      msgGood: '',

      pre_loader: false,          
      clients: [],      

      //search params for:
      //api/clients/$column/$direction?token=$token&search=abc
      column: '',
      direction: '',
      page: '',
      search: '', //after click button
      searchValue: '', // current value

    };
  },  

  methods: {

    addClient(){
      this.$router.push({ name: 'user', params: { mode: 'add' } });
    },
    editClient(id){
      this.$router.push({ name: 'user', params: { mode: 'edit', id: id } });
    },

    async searchClients()
    {
      this.search = this.searchValue;
      this.pre_loader = true;      

      const refreshC = await this.refreshClients();
      
      if(refreshC ){
        this.pre_loader = false;
      }
    },

    async delClient(id){
      this.clearMsg();  
      if (window.confirm('Are you sure you wish to delete this item?')){
        this.pre_loader = true;      

        try{
          const response = await deleteClient(id, this.token);
          if(response.data.success){
            const ret = await this.refreshClients();
            if(ret){
              this.msgGood = 'Client has been deleted';
              this.pre_loader = false;
            }
          }
        } catch (error) {
          console.log('_is_error__', error);
          this.msgWrong = 'Delete client problem = ' + error;
        }
      }
    },
    async changePageByUrl(url){
      this.pre_loader = true;      
      this.page = functions.retrieveParamsFromUrl( url, 'page');
      
      const refreshC = await this.refreshClients();
      
      if(refreshC ){
        this.pre_loader = false;
      }
    },

    async sortingAsc(column){
      this.sorting(column, 'asc');
    },

    async sortingDesc(column){
      this.sorting(column, 'desc');
    },

    async sorting(column, direction){    
      this.pre_loader = true;
      this.column = column;
      this.direction = direction;
      this.page = '1';

      const refreshC = await this.refreshClients();
      
      if(refreshC ){
        this.pre_loader = false;
      }
    },

    clearMsg(){
      this.msgWrong = '';
      this.msgGood = '';
    },

    async refreshClients(){
      this.clearMsg();
      try {
          const responseC = await getClients( this.column, this.direction, this.token, this.page, this.search );
          this.clients = responseC.data.data;
          return true;
      } catch (error) {
          console.log( 'error get clients=', error);
      }
      return false;        
    },    
  },

  async mounted() {
      if(!this.$store.state.auth.isLoggedIn){
          this.$router.push("/");
      }

      this.pre_loader = true;

      //set up sorting on the start
      this.column = 'created_at';
      this.direction = 'desc';
      this.page = '1';      
      this.search = '';
      
      const refreshC = await this.refreshClients(); 
      
      if(refreshC ){
        this.pre_loader = false;
      }

  }
};
</script>