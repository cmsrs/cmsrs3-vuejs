<template>
  <NavBar/>
  <div class="container">
    <router-view />
  </div>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
</script>
