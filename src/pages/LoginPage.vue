<template>
    <h1>Login</h1>  
    <Input id="e-mail" label="E-mail" v-model="email" />
    <Input
    id="password"
    label="Password"
    v-model="password"
    type="password"
    />
    <div class="alert alert-danger text-center" v-if="failMessage">
            {{ failMessage }}
    </div>
    <div class="text-center">
    <ButtonWithProgress
        :apiProgress="apiProgress"
        :disabled="isDisabled"
        :onClick="submit"
    >
        Login
    </ButtonWithProgress>
    </div>

</template>
<script>
import Input from "../components/Input";
import ButtonWithProgress from "../components/ButtonWithProgress";
import { login, config } from "../api/apiCalls";

export default {
    name: "LoginPage",
    components: {
        Input,
        ButtonWithProgress
    },
    data() {
        return {
        email: "",
        password: "",
        apiProgress: false,
        failMessage: undefined,
        };
    },
    computed: {
        isDisabled() {
            return !(this.email && this.password);
        },
    },
    methods: {
        async submit() {
        this.apiProgress = true;
        try {

            const post = {
                email: this.email,
                password: this.password,
            };
            
            const response = await login(post);

            //console.log('response__', response.data);
            //if(!response.data.success) ... //The response headers from server are different, so it doesn't make sense

            const token = response.data.data.token;

            const data = {    
                ...post,  
                token
            };            
                
            this.$store.commit("loginSuccess", data);

            if(token){
                const responseConfig = await config(token);
                this.$store.commit("setConfig", responseConfig.data.data);
            }
            
            this.$router.push("/pages");
            
        } catch (error) {
            this.failMessage = 'Invalid login credentials';
            //console.log('_is_error__', error);
        }
        this.apiProgress = false;
        },
    },
    watch: {
        email() {
            this.failMessage = undefined;
        },
        password() {
            this.failMessage = undefined;
        },
    },
    mounted() {
        if(this.$store.state.auth.isLoggedIn){
            this.$router.push("/pages");
        }
    }
}
</script>