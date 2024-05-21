<template>
  <BlockingModal v-if="modal.visible" />
  <NavBar />
  <div class="container">
    <router-view />
  </div>
</template>

<script setup>
import BlockingModal from "./components/BlockingModal.vue";
import NavBar from "./components/NavBar.vue";
import { useAuthStore } from "./state/store.js";
const { modal } = useAuthStore();
</script>

<style>
@import "../node_modules/bootstrap/dist/css/bootstrap.css";
@import "./assets/styles.css";
</style>
