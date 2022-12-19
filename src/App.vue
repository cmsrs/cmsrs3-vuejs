<template>
  <NavBar v-if="$store.state.isLoggedIn" />
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import NavBar from "./components/NavBar";  

export default {
  name: 'App',
  components: {
    NavBar,
  },
  data() {
    return {
      path: window.location.pathname,
    };
  },
  methods: {
    onClickLink(event) {
      this.path = event.currentTarget.attributes.href.value;
      window.history.pushState({}, "", this.path);
    },
  },
}
</script>