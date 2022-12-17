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
import { login } from "../api/apiCalls";

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
            
            const response = await login({
                email: this.email,
                password: this.password,
            });

            if(response.data.success){
                this.$router.push("/pages");

                const data = {        
                    header: `Bearer ${response.data.data.token}`,
                };

                
                this.$store.commit("loginSuccess", data);

            }else{
                console.log('_____test_pass_ok____');
                this.failMessage = 'Invalid login credentials';    
            }        
            
        } catch (error) {
            this.failMessage = 'Invalid login credentials';
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
    }
}
</script>