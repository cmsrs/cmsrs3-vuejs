<template>
  <div class="shadow-sm bg-light mb-3">
    <nav class="navbar navbar-expand navbar-light container">
      <div class="container-fluid p-0">
        <ul class="navbar-nav ml-auto">
          <router-link class="nav-link" to="/pages" v-if="token"
            >Pages
          </router-link>
          <router-link class="nav-link" to="/users" v-if="token"
            >Users
          </router-link>
        </ul>
        <ul class="navbar-nav mr-auto">
          <li :onClick="signOut" class="nav-link" style="cursor: pointer">
            Sign Out
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
<script>
import functions from "../helpers/functions.js";
//import { resetAuthState } from "../state/store";
//import storage from "../state/storage";
export default {
  data() {
    const { token } = functions.retrieveParamsFromStorage();
    return {
      token: token,
      //pre_loader: false
    };
  },

  methods: {
    signOut() {
      console.log("________todo_signout___");
      //storage.clear();
      //resetAuthState();
      //this.$router.push("/");
    },
  },
};
</script>
