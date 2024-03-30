<template>
  <span>
      <span role="sorting_asc"  :class="{ 'disabled-if-loader': pre_loader }" class="ml-2 col-1"  @click.prevent="inSortAsc(column)" ><i class="fas fa-arrow-down cursor-pointer"  aria-hidden="true"></i></span>
      <span role="sorting_desc" :class="{ 'disabled-if-loader': pre_loader }" class="ml-2 col-1"  @click.prevent="inSortDesc(column)" ><i class="fas fa-arrow-up cursor-pointer"  aria-hidden="true"></i></span>
  </span>      
</template>
  
  <script>
  export default {
    props: {
      pre_loader: Boolean,
      onClickAsc: Function,
      onClickDesc: Function,
      sortColumn: String
    },
    methods: {
      
      inSortAsc(column){
        this.$emit( 'onClickAsc', column);
      },
      inSortDesc(column){
        this.$emit( 'onClickDesc', column);
      },

    }
  };
  </script>