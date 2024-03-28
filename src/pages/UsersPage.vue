<template>
    <div data-testid="users-page">
      <h3>Users</h3>



      <button role="button_save_edit_page" @click.prevent="addClient"  type="submit" class="add-page-btn  btn btn-primary mt-2 mb-2 mr-2" :disabled="pre_loader">
                <i v-if="!pre_loader" class="fas fa-plus"></i>

                <span role="pre_loader_add_client" v-if="pre_loader" class="spinner-grow spinner-grow-sm"></span>
                Add Client
      </button>
      

      <div class="container">

        <table class="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">First</th>
              <th scope="col">Last</th>
              <th scope="col">Handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <th scope="row">2</th>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
          </tbody>
        </table>        

      </div>
    </div>
</template>
<script>
import functions from "../helpers/functions.js";
import storage from "../state/storage";
import { getClients } from "../api/apiCalls";

export default {    
  name: "UserPage",

  data() {

    const { configLangs, configDefaultLang, pageTypes, token } = functions.retrieveParamsFromStorage( storage );
    const defaultLang = this.$store.state.config.defaultLang || configDefaultLang;     
    return {
      //from storage
      langs: this.$store.state.config.langs || configLangs,
      lang: defaultLang, //it is changeable
      defaultLang: defaultLang,
      page_types : this.$store.state.config.page_types || pageTypes,
      token: this.$store.state.auth.token || token,

      //some constants
      //msgWrong: '',
      //msgGood: '',
      pre_loader: false,          
      //errFields: [], //optional

      clients: [],
    };
  },  

  methods: {
    addClient(){
      console.log('add client');
    },

    async refreshClients(){
          try {
              const responseC = await getClients( 'name', 'desc', '', this.token);
              this.clients = responseC.data;
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
      const refreshC = await this.refreshClients();
      if(refreshC ){
        this.pre_loader = false;
      }

  }
};
</script>