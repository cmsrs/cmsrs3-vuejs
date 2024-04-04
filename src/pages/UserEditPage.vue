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
          <div class="col-5">
            <button 
              @click.prevent="back"  
              class="add-page-btn  btn btn-info ml-3 mt-2 mb-2" 
              :disabled="pre_loader"
            >Back</button>
          </div>          

          <div class="col-5">
            <button role="button_save_edit_client" @click.prevent="addEditClient" class="add-page-btn  btn btn-primary mt-2 mb-2 mr-2" :disabled="pre_loader">
              <i v-if="!pre_loader" class="fas fa-plus"></i>

              <span role="pre_loader_add_edit_client" v-if="pre_loader" class="spinner-grow spinner-grow-sm"></span>
                <span v-if="mode === 'edit'">Edit</span>
                <span v-else>Add</span>
            </button>  
          </div>                                  
        </div>

        <div class="row">

          <form>
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input type="email" v-model="client.email"  class="form-control" id="email" aria-describedby="emailHelp"  placeholder="email"  :disabled="mode === 'edit'" >
              <!-- <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> -->
            </div>

            <div class="mb-3">
              <label for="name" class="form-label">Name</label>
              <input type="text" v-model="client.name" class="form-control" id="name"   placeholder="name">
            </div>

            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <input type="password" v-model="client.password" class="form-control" id="password"  placeholder="password">
            </div>

            <div class="mb-3">
              <label for="password_confirmation" class="form-label">Password confirmation</label>
              <input type="password"  v-model="client.password_confirmation" class="form-control" id="password_confirmation"  placeholder="password confirmation">
            </div>


            <!--

            <button type="submit" class="btn btn-primary" :disabled="pre_loader">
              <span v-if="mode === 'edit'">Edit</span>
              <span v-else>Add</span>
            </button>

            -->
          </form>

        </div>        



      </div><!--  container -->

    </div>
</template>
<script>
import functions from "../helpers/functions.js";
import storage from "../state/storage";
import { getClient, postClient, putClient } from "../api/apiCalls";
import Msg from "../components/Msg";
import trans from "../helpers/trans.js";

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
      console.log("addEditClient");
      this.pre_loader = true;
      try{
        const retClient = this.client.id ? (await putClient(this.client, this.token)) : await postClient(this.client, this.token);
        if(retClient.data.success){
            this.msgGood = this.client.id ? trans.ttt( 'success_client_edit' ) : trans.ttt( 'success_client_add' );
                /*
                if( !this.currentPageId  ){

                  //console.log( this.currentPageId);
                  //console.log(retPage.data);
                  this.currentPageId = retPage.data.data.pageId;
                  this.msgGood = trans.ttt( 'success_page_add' );
                }else{
                  this.msgGood = trans.ttt( 'success_page_edit' );
                }
                */
        }else if( retPage.data.success === false ){
            console.log('TODO');
            //this.msgWrong =  await functions.parseError( retPage.data.error );
            //this.errFields =  await functions.getErrorFields( retPage.data.error );
        }else{
            this.msgWrong = 'Something wrong';                              
        }            

            //const ret = await this.refreshPages();
            //if(ret){
            //  this.pre_loader = false;
            //}
            
      } catch (error) {
          //this.failMessage = 'Invalid save page';
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
      if(!this.$store.state.auth.isLoggedIn){
          this.$router.push("/");
      }
      if ( (this.mode !== 'edit') &&  (this.mode !== 'add')  ) {
          this.$router.push("/");
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

      //console.log(this.client);
  }
};
</script>