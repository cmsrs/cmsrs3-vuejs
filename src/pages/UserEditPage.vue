<template>
    <div data-testid="users-page-edit">      
      <h3 v-if="mode === 'edit'">Edit client</h3>
      <h3 v-else>Add client</h3>

      <Msg 
        :msgGood="msgGood"                        
        :msgWrong="msgWrong"
      ></Msg>

      <div class="container">

        <div class="row">
          <div class="col">
            <button 
              @click.prevent="back"  
              class="add-page-btn  btn btn-info ml-3 mt-2 mb-2" 
              :disabled="pre_loader"
            >Back</button>
          </div>          
        </div>

        <div class="row pb-4 pt-4">

          <form>
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input type="email" v-model="client.email"  class="form-control" :class="{ 'is-invalid': errFields.includes('email') }"  id="email" aria-describedby="emailHelp"  placeholder="email"  :disabled="mode === 'edit'" >
              <!-- <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> -->
            </div>

            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input type="text" v-model="client.name" class="form-control" :class="{ 'is-invalid': errFields.includes('name') }"  id="name" placeholder="name">
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" v-model="client.password" class="form-control" :class="{ 'is-invalid': errFields.includes('password') }" id="password"  placeholder="password">
            </div>

            <div class="mb-3">
              <label for="password_confirmation" class="form-label">Password confirmation</label>
              <input type="password"  v-model="client.password_confirmation" class="form-control" :class="{ 'is-invalid': errFields.includes('password') }" id="password_confirmation"  placeholder="password confirmation">
            </div>


            <button role="button_save_edit_client" @click.prevent="addEditClient" class="add-page-btn  btn btn-primary mt-2 mb-2 mr-2" :disabled="pre_loader">
              <i v-if="!pre_loader" class="fas fa-plus"></i>

              <span role="pre_loader_add_edit_client" v-if="pre_loader" class="spinner-grow spinner-grow-sm"></span>
                <span v-if="mode === 'edit'">Edit client</span>
                <span v-else>Add client</span>
            </button>  

          </form>

        </div>        



      </div><!--  container -->

    </div>
</template>
<script>
import functions from "../helpers/functions.js";
import storage from "../state/storage";
import { getClient, postClient, putClient } from "../api/apiCalls";
import Msg from "../components/Msg.vue";
import trans from "../helpers/trans.js";
//import { useRouter } from 'vue-router'

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
      token: token,
      msgWrong: '',
      msgGood: '',
      errFields: [], //optional

      pre_loader: false,          
      client: {}
    };
  },  

  methods: {

    back(){
      this.$router.push({ name: 'users' });
    },

    clearMsg(){
      this.msgWrong = '';
      this.msgGood = '';
    },

    getEmptyClient(){
      return {
        id: '',
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      }
    },

    async addEditClient(){
      this.clearMsg();
      this.pre_loader = true;
      try{
        const retClient = this.client.id ? (await putClient(this.client, this.token)) : await postClient(this.client, this.token);
        if(retClient.data.success){
            this.msgGood = this.client.id ? trans.ttt( 'success_client_edit' ) : trans.ttt( 'success_client_add' );
        }else if( retClient.data.success === false ){
            this.msgWrong =  await functions.parseError( retClient.data.error );
            this.errFields =  await functions.getErrorFields( retClient.data.error );
        }else{
            this.msgWrong = 'Something wrong with add or edit client - check response status';                              
        }            

      } catch (error) {
          console.log('_is_error__', error);
      }
      this.pre_loader = false;
    },

    async loadClient(id){      
      try {
          const responseC = await getClient( id, this.token );
          if(responseC.data.success){
            const client = responseC.data.data;
            this.client.id = client.id;
            this.client.name = client.name;
            this.client.email = client.email;
            return true;
          }else{
            this.msgWrong = 'Sth wrong with get client';  
            console.log( 'error get client=', responseC.data);
          }
      } catch (error) {
          this.msgWrong = 'Sth wrong with get client (error)';
          console.log( 'error get client=', error);
      }
      return false;        
    },
 
  },

  async mounted() {

      //console.log('token='+this.token);
      if(!this.token){
        this.$router.push("/");
      }

      if ( (this.mode !== 'edit') &&  (this.mode !== 'add')  ) {
        this.$router.push("/"); //TODO test manually
      }

      this.clearMsg();
      this.client = this.getEmptyClient();

      if (this.mode === 'edit') {
        this.pre_loader = true;
        const loadC = await this.loadClient(this.id);
      
        if( loadC ){
          this.pre_loader = false;
        }        
      }
  }
};
</script>