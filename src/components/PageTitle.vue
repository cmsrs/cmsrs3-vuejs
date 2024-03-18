<template>
      <div class="container">
        <div class="row test-page">                
          <div role="edit_page" class="ml-2 col-1"  :class="{ 'disabled-if-loader': pre_loader }"  @click="inEditPage(p.id)"><i className="far fa-edit cursor-pointer"></i></div>
          <div role="del_page" class="ml-2 col-1"  :class="{ 'disabled-if-loader': pre_loader }" @click="inDelPage(p.id)"><i className="fas fa-trash cursor-pointer"></i></div>
          <div  role="down_page"  :class="{ 'disabled-if-loader': pre_loader }" class="ml-2 col-1"  @click="inPositionPage('down', p.id)"><i className="fas fa-arrow-down cursor-pointer"  aria-hidden="true"/></div>
          <div  role="up_page" :class="{ 'disabled-if-loader': pre_loader }" class="ml-2 col-1"  @click="inPositionPage('up', p.id)"><i className="fas fa-arrow-up cursor-pointer"  aria-hidden="true"/></div>                      
          <span class="col">
            <span v-if="showPageId" >
              {{ p.short_title[lang]+" ("+ p.id +")" }}
            </span>
            <span  v-else>
              {{ p.short_title[lang] }}
            </span>
          </span>            
      </div>
    </div>      

</template>
  
  <script>
  export default {
    props: {
      pre_loader: Boolean,
      p: Object, // Assuming pageTitle is an object with translations
      lang: String,
      allPages: Object,
      execEditPage: Function,
      execDelPage: Function, 
      execPositionPageUp: Function,
      execPositionPageDown: Function,
      showPageId: Boolean
    },
    methods: {
      
      inEditPage(pId){
        //this.$emit('wywolajMetode');
        this.$emit( 'execEditPage', pId);
      },
      async inDelPage(pId){
        this.$emit('execDelPage', pId);
      },

      async inPositionPage(direction, pageId){
        //console.log('child='+ direction+ ' pId=' + pageId); //tu jest ok
        if( 'down' == direction ){
          this.$emit('execPositionPageDown', pageId);
        }
        if( 'up' == direction ){
          this.$emit('execPositionPageUp', pageId);
        }

      }

    },
  };
  </script>