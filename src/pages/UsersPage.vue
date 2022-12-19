<template>
    <div data-testid="users-page">
      <h3>Users</h3>
    </div>
  </template>
  <script>
  export default {    
    mounted() {
        if(!this.$store.state.isLoggedIn){
            this.$router.push("/");
        }
    }
  };
  </script>