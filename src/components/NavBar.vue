<template>
  <div class="shadow-sm bg-light mb-3" v-if="auth.token">
    <nav class="navbar navbar-expand navbar-light container">
      <div class="container-fluid p-0 row">
        <ul class="navbar-nav ms-auto col-10">
          <router-link
            class="nav-link"
            to="/pages"
            :class="{ 'text-primary': $route.path.startsWith('/pages') }"
            >Pages</router-link
          >
          <router-link
            class="nav-link"
            to="/users"
            :class="{ 'text-primary': $route.path.startsWith('/user') }"
            >Users</router-link
          >
          <router-link
            class="nav-link"
            to="/products"
            :class="{ 'text-primary': $route.path.startsWith('/product') }"
            >Products</router-link
          >
          <router-link
            class="nav-link"
            to="/contacts"
            :class="{ 'text-primary': $route.path.startsWith('/contact') }"
            >Contacts</router-link
          >
        </ul>
        <ul class="navbar-nav justify-content-end col-2">
          <li
            role="link_sign_out"
            :onClick="signOut"
            class="nav-link"
            style="cursor: pointer"
          >
            Sign Out
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { logout } from "../api/apiCalls.js";
import { useRouter } from "vue-router";
import { useAuthStore } from "../state/store.js";
const { auth, logout: logoutStore } = useAuthStore();

const router = useRouter();
const pre_loader = ref(false);

const signOut = async () => {
  pre_loader.value = true;

  try {
    const responseLogout = await logout(auth.token);
    if (!responseLogout.data.success) {
      console.log("sth wrong with logout in server site");
    }
    logoutStore();
    router.push("/");
  } catch (error) {
    console.log("_is_error_logout__", error);
  } finally {
    pre_loader.value = false;
  }
};
</script>
