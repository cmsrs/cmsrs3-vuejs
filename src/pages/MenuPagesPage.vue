<template>
    <div data-testid="pages-page">
      <h3>CMS - menus and pages</h3>

      <div class="container">
        <div class="row">
          <!-- Menu  -->
          <div class="col-5">

            Menu testtt.
          </div>

          <!-- Pages  -->
          <div class="col-7">

              Pages testttt.
              <div class="container">
                <div class="row mt-1">
                  <div  v-for="lang in langs" :key="lang">
                    <span @click="changeLang('title')" :placeholder="`title ${lang}`" >{{lang}}</span>
                  </div>
                </div>
              </div>

              <div v-for="lang in langs" :key="lang" >
                <input v-model="title[lang]" :placeholder="`title ${lang}`">
              </div>

          </div>
        </div>
      </div>

    </div>
  </template>
  <script>
  import storage from "../state/storage";
  export default {

    data() {
        const storedStateConfig = storage.getItem("config"); //when we refresh /pages the config not disaapear
        let configLangs = false;
        let configDefaultLang = false;

        if(storedStateConfig){
          configLangs = storedStateConfig.langs;
          configDefaultLang = storedStateConfig.defaultLang;
        }

        return {
          langs: this.$store.state.config.langs || configLangs,
          defaultLang: this.$store.state.config.defaultLang || configDefaultLang,
          title: [''],
          password: "",
          apiProgress: false,
          failMessage: undefined,
        };
    },
    methods: {
      changeLang( element  ){
        alert('aaaaa' + element);
      }
    },    
    mounted() {
        if(!this.$store.state.auth || !this.$store.state.auth.isLoggedIn ){
            this.$router.push("/");
        }
    }
  };
  </script>
