<template>
    <h3>Login</h3>  

    <Msg 
        :msgGood="msgGood"                        
        :msgWrong="msgWrong"
    ></Msg>

    <form @submit.prevent="submit" class="container">
        <div class="card">
    
        <div class="mb-3">
        <label for="e-mail" class="form-label">E-mail</label>
        <input
            id="e-mail"
            class="form-control"
            v-model="email"
            type="text"
        />
        </div>

        <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
            id="password"
            class="form-control"
            v-model="password"
            type="password"
        />
        </div>

        <div class="text-center">
            <button type="submit" role="button_login" class="btn btn-primary mt-2 mb-2" :disabled="pre_loader || isDisabled">
                <i v-if="!pre_loader" class="fas fa-plus"></i>
                <span role="pre_loader_login" v-if="pre_loader" class="spinner-grow spinner-grow-sm"></span>              
                Login
            </button>

        </div>

        </div>
    </form><!-- container -->

</template>
<script>
import Input from "../components/Input.vue";
import ButtonWithProgress from "../components/ButtonWithProgress.vue";
import Msg from "../components/Msg.vue";
import { login, config } from "../api/apiCalls.js";
//import { useAuthStore } from "../state/store.js"
//const { setAuth, setConfig } = useAuthStore()


export default {
    name: "LoginPage",
    components: {
        Msg,
        Input,
        ButtonWithProgress
    },
    data() {
        return {
            msgWrong: '',
            msgGood: '',
            pre_loader: false,          

            email: "",
            password: "",
            //errFields: [], //todo ?
        };
    },
    computed: {
        isDisabled() {
            return !(this.email && this.password);
        },
    },
    methods: {
        clearMsg(){
            this.msgWrong = '';
            this.msgGood = '';
            //this.errFields = []; //todo ?
        },

        async submit() {
            this.clearMsg();
            this.pre_loader = true;

            try {
                const post = {
                    email: this.email,
                    password: this.password,
                };
                
                const responseAuth = await login(post);
                if(responseAuth.data.success){
                
                    const token = responseAuth.data.data.token;
                    if(token){
                        const responseConfig = await config(token);
                        if(responseConfig.data.success){
                            //console.log('________jestem_zalogowany_ok_zapis_sessi_todo____________________________');
                            this.$router.push("/pages");
                        }


                        //console.log('bbb')                        
                        //setAuth(response.data.data)
                        //setConfig(responseConfig.data.data)
                        //console.log(responseConfig.data.data);
                        //this.$store.commit("setConfig", responseConfig.data.data);

                        
                    }
                }else{
                    this.msgWrong = responseAuth.data.error;    
                }
                                            
            } catch (error) {
                this.msgWrong = 'Invalid login credentials';
                console.log('_is_error__', error);
            }
            this.pre_loader = false;
        },

    },
    watch: {
        email() {
            this.clearMsg();
        },
        password() {
            this.clearMsg();
        },
    },
    mounted() {
        if(this.token){
            this.$router.push("/pages");
        }
    }
}

</script>