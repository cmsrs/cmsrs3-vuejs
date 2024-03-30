<template>
  <span>
      <span role="sorting_asc"  :class="{ 'disabled-if-loader': pre_loader }" class="ml-2 col-1"  @click.prevent="onClickAsc" ><i class="fas fa-arrow-down cursor-pointer"  aria-hidden="true"/></span>
      <span role="sorting_desc" :class="{ 'disabled-if-loader': pre_loader }" class="ml-2 col-1"  @click.prevent="onClickDesc" ><i class="fas fa-arrow-up cursor-pointer"  aria-hidden="true"/></span>
  </span>      
</template>
  
  <script>
  export default {
    props: {
      pre_loader: Boolean,
      onClickAsc: Function,
      onClickDesc: Function
    },
  };
  </script>