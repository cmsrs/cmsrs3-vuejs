<template>
    <div data-testid="pages-page">
      <h3>Pages</h3>

      <div class="container">
        <div class="row">
          <div class="col-5">
            pages__
          </div>

          <div class="col-7">
            content__
          </div>
        </div>
      </div>

      <PageList />
    </div>
  </template>
  <script>
  import PageList from "../components/PageList";
  export default {
    components: {
      PageList,
    },
    mounted() {
        if(!this.$store.state.isLoggedIn){
            this.$router.push("/");
        }
    }
  };
  </script>