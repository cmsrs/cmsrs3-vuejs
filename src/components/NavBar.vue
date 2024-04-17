<template>
  <div class="shadow-sm bg-light mb-3">
    <nav class="navbar navbar-expand navbar-light container">
      <div class="container-fluid p-0 row"  v-if="token">
        <ul class="navbar-nav ms-auto col-10" >
          <router-link class="nav-link" to="/pages"
            >Pages
          </router-link>
          <router-link class="nav-link" to="/users"
            >Users
          </router-link>
        </ul>
        <ul class="navbar-nav justify-content-end col-2">
          <li role="link_sign_out" :onClick="signOut" class="nav-link" style="cursor: pointer">
            Sign Out
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import functions from "../helpers/functions.js";
import { logout } from "../api/apiCalls.js";
import { useRouter } from "vue-router";
import { useAuthStore } from "../state/store.js";
const { logout: logoutStore } = useAuthStore();

const router = useRouter()
const token = ref(functions.retrieveParamsFromStorage().token);
//console.log(token.value);
const pre_loader = ref(false);

//onMounted (() => {
//  const { token } = functions.retrieveParamsFromStorage();
//  dataToken.value = token  
//})

const signOut = async () => {
  pre_loader.value = true;

  try {
    //const { token } = functions.retrieveParamsFromStorage();
    const responseLogout = await logout(token.value);
    if(!responseLogout.data.success){
      console.log( 'sth wrong with logout in server site' );
    }
    logoutStore();
    router.push('/');

  } catch (error) {
    console.log("_is_error_logout__", error);
  } finally {
    pre_loader.value = false;
  }
};
</script>
