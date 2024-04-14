<template>
  <NavBar v-if="token" />
  <div class="container">
    <router-view />
  </div>
</template>

<script>
import functions from "./helpers/functions.js";
import storage from "./state/storage";
import NavBar from "./components/NavBar.vue";

export default {
  name: 'App',
  components: {
    NavBar,
  },
  data() {
    const { token } = functions.retrieveParamsFromStorage( storage );
    return {
      token: token
      //path: window.location.pathname,
    };
  }
  /*
  methods: {
    onClickLink(event) {
      this.path = event.currentTarget.attributes.href.value;
      window.history.pushState({}, "", this.path);
    },
  },
  */
}
</script>
