<template>
  <NavBar />
  <div class="container">
    <router-view />
  </div>
</template>

<script setup>
import NavBar from "./components/NavBar.vue";
</script>

<style>
@import "../node_modules/bootstrap/dist/css/bootstrap.css";
@import "./assets/styles.css";
</style>
