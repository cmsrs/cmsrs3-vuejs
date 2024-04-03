<template>
    <div data-testid="users-page-edit">      
      <h1 v-if="mode === 'edit'">Edit client</h1>
      <h1 v-else>Add client</h1>

      <Msg 
        :msgGood="msgGood"                        
        :msgWrong="msgWrong"
      ></Msg>

      <div class="container">

        <div class="row">
          <div class="col-5">
            <button role="button_save_edit_client" @click.prevent="addEditClient" class="add-page-btn  btn btn-primary mt-2 mb-2 mr-2" :disabled="pre_loader">
              <i v-if="!pre_loader" class="fas fa-plus"></i>

              <span role="pre_loader_add_client" v-if="pre_loader" class="spinner-grow spinner-grow-sm"></span>
              Add Client
            </button>  
          </div>                                  
        </div>




      </div><!--  container -->

    </div>
</template>
<script>
import functions from "../helpers/functions.js";
import storage from "../state/storage";
//import { getClients, deleteClient } from "../api/apiCalls";
import Msg from "../components/Msg";

export default {    
  name: "UserEditPage",
  components: {
    Msg
  },
  props: {
    mode: String, //edit or add
    id: { //optional parameter
      type: String,
      default: ''
    }
  },  


  data() {

    const { token } = functions.retrieveParamsFromStorage( storage );
    return {
      token: this.$store.state.auth.token || token,
      msgWrong: '',
      msgGood: '',

      pre_loader: false,          
      client: {}


    };
  },  

  methods: {

 
  },

  async mounted() {
      if(!this.$store.state.auth.isLoggedIn){
          this.$router.push("/");
      }

      if (this.mode === 'edit') {
        console.log('Edycja użytkownika o ID:', this.id);
      } else {
        console.log('Dodawanie nowego użytkownika');
      }
      
      //const userId = this.$router.params.id;
      //console.log( 'userId='+ userId );

      //this.pre_loader = true;      
      //const refreshC = await this.refreshClients();       
      //if(refreshC ){
      //  this.pre_loader = false;
      //}

  }
};
</script>