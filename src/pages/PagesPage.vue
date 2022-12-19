<template>
    <div data-testid="pages-page">
      <h3>Pages</h3>
      <PageList />
    </div>
  </template>
  <script>
  import PageList from "../components/PageList";
  export default {
    components: {
      PageList,
    },
  };
  </script>