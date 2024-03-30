  <template>
    <div data-testid="users-page">
      <h3>Users</h3>

      <div class="container mt-5">

        <div class="row">
          <div class="col-5">
            <button role="button_save_edit_page" @click.prevent="addClient" class="add-page-btn  btn btn-primary mt-2 mb-2 mr-2" :disabled="pre_loader">
              <i v-if="!pre_loader" class="fas fa-plus"></i>

              <span role="pre_loader_add_client" v-if="pre_loader" class="spinner-grow spinner-grow-sm"></span>
              Add Client
            </button>  
          </div>      
          
          <div  class="col-7 d-flex align-items-baseline">            

                <input type="input" class="form-control col" />
              
                <button role="button_search_client" @click.prevent="addClient" class="add-page-btn  btn btn-primary mt-2 mb-2 mr-2" :disabled="pre_loader">
                  <i v-if="!pre_loader" class="fas fa-search"></i>
                  <span role="pre_loader_search_client" v-if="pre_loader" class="spinner-grow spinner-grow-sm"></span>
                  <span>Search client</span>
                </button>                  

          </div>        
        </div>

        <table class="table">
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

            </tr>
          </thead>
          <tbody>


            <tr v-for="(c, index) in clients.data" :key="index">
              <th scope="row">{{ index+1 }}</th>
              <td>{{ c['name'] }}</td>
              <td>{{ c['email'] }}</td>
              <td>{{ c['created_at'] ?  c['created_at'].split("T")[0] : '' }}</td>
            </tr>

          </tbody>
        </table>        

        <nav aria-label="Page navigation example">
          <ul class="pagination justify-content-end">
            <li class="page-item disabled">
              <a class="page-link" href="#" tabindex="-1" aria-disabled="true">Previous</a>
            </li>
            <li class="page-item"><a class="page-link" href="#">1</a></li>
            <li class="page-item">
              <a class="page-link" href="#">Next</a>
            </li>
          </ul>
        </nav>

      </div><!--  container -->

    </div>
</template>
<script>
import functions from "../helpers/functions.js";
import storage from "../state/storage";
import { getClients } from "../api/apiCalls";
import TableSort from "../components/TableSort";

export default {    
  name: "UserPage",
  components: {
    TableSort
  },

  data() {

    const { token } = functions.retrieveParamsFromStorage( storage );
    return {
      token: this.$store.state.auth.token || token,
      pre_loader: false,          
      clients: [],      

      //search params for:
      //api/clients/$column/$direction?token=$token&search=abc
      column: '',
      direction: '',
      search: ''
    };
  },  

  methods: {
    addClient(){
      console.log('add client');
    },

    async sorting(column, direction){    
      this.pre_loader = true;
      this.column = column;
      this.direction = direction;

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

    async refreshClients(){
      try {
          const responseC = await getClients( this.column, this.direction, this.search, this.token);
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
      this.search = '';
      
      const refreshC = await this.refreshClients(); 
      
      if(refreshC ){
        this.pre_loader = false;
      }

  }
};
</script>