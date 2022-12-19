<template>
    <div class="shadow-sm bg-light mb-3">
      <nav class="navbar navbar-expand navbar-light container">
        <div class="container-fluid p-0">
          <ul class="navbar-nav ml-auto">
            <router-link
              class="nav-link"
              to="/pages"    
              v-if="$store.state.isLoggedIn"          
              >Pages
            </router-link>
            <router-link
              class="nav-link"
              to="/users"
              v-if="$store.state.isLoggedIn"
              >Users
            </router-link>
          </ul>
          <ul class="navbar-nav mr-auto">
            <li
            :onClick="signOut"
            class="nav-link"
            style="cursor: pointer;"
            >Sign Out
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </template>
<script>
import { resetAuthState } from "../state/store";
import storage from "../state/storage";
export default {
  methods: {
        signOut() {
          storage.clear();
          resetAuthState();
          this.$router.push("/");
        },
    },
}
</script>
