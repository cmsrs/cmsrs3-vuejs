<template>
    <div class="mb-3" data-testid="pages-page">

      <!-- change lang and h1 -->
      <div class="container">
        <div class="row mt-3 mb-3">
          <h3 class="col-10">CMS - menus and pages</h3>
          <div role="change_lang" class="col-2" v-if="langs.length > 1">
            <div v-for="l in langs" :key="l">
              <span 
                :class="{ 'mr-1 cursor-pointer text-primary': lang === l, 'mr-1 cursor-pointer text-secondary': lang !== l }"
                @click="changeLang(l)"             
                >{{l}}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="container">
        <div class="row mt-3 mb-3">
          <div v-if="msgGood" class="alert alert-primary" role="alert_success">
            {{ msgGood }}
          </div>
          <div v-if="msgWrong" class="alert alert-danger" role="alert_danger">
            {{ msgWrong }}
          </div>      
        </div>
      </div>

      <div class="container">
        <div class="row">
          <!-- Menu  -->
          <div class="col-5">

            <button role="button_add_menu"  @click.prevent="addMenu" class="btn btn-primary mt-2 mb-2" >
              <i v-if="!pre_loader" class="fas fa-plus"></i>
              <span role="pre_loader_add_menu" v-if="pre_loader" class="spinner-grow spinner-grow-sm"></span>              
              Add menu
            </button>

            <div class="container">
              <div class="row"  v-if="isAddMenu" >
                <div class="form-group mt-3 ">              
                  <input role="new_menu"  class="form-control"  v-model="new_menu_name[lang]" :placeholder="`Menu name ${lang}`">
                  <div role="save_menu_0" class="ml-2"  @click="saveMenu(0)"><i className="far fa-save cursor-pointer"></i></div>
                  <div role="del_menu_0"  class="ml-2 trash"  @click="delMenu(0)"><i className="fas fa-trash cursor-pointer"  aria-hidden="true"/></div>                  
                </div>
              </div>
            </div>

            <div class="container">
              <div class="row"  v-if="notRelatedPages" >
                <h5 class="mt-4">Pages not related to menu</h5>
                  <div class="row" v-for="(p, index) in notRelatedPages" :key="index">                  
                    {{ p.short_title[defaultLang] }}
                  </div>
              </div>
              <div class="row"  v-if="innerPages" >
                <h5 class="mt-4">Inner boxes</h5>
                  <div class="row" v-for="(p, index) in innerPages" :key="index">                  
                    {{ p.short_title[defaultLang]+" ("+ p.id +")" }}
                  </div>
              </div>
            </div>

          </div>

          <!-- Pages  -->
          <div class="col-7">

              <!-- !to moze byc takze edit page -->
              <button role="button_save_edit_page" @click.prevent="saveEditPage"  type="submit" className="add-page-btn  btn btn-primary mt-2 mb-2" :disabled="pre_loader">
                <i v-if="!pre_loader" class="fas fa-plus"></i>
                <span role="pre_loader_save_edit_page" v-if="pre_loader" class="spinner-grow spinner-grow-sm"></span>
                Add page
              </button>
              <button class="add-page-btn  btn btn-info ml-3 mt-2 mb-2"  :disabled="pre_loader">Clear data</button>
        
              <form>
                <div class="form-group mt-3 ">              
                  <input class="form-control" v-model="title[lang]" :placeholder="`title ${lang}`">
                </div>

                <div class="form-group mt-3 ">              
                  <input  class="form-control"  v-model="short_title[lang]" :placeholder="`short title ${lang}`">
                </div>              

                <div class="form-group mt-3 ">                            
                  <textarea  class="form-control"  rows="4" cols="50" v-model="description[lang]" :placeholder="`description ${lang}`"></textarea>
                </div>


                <div className="form-check row mt-2">
                  <input
                      className="col-1"
                      name="published"
                      type="checkbox"
                      v-model="published"
                      />
                  <label>Published</label>
                </div>

                <div className="form-check row">
                    <input
                        className="col-1"
                        name="commented"
                        type="checkbox"
                        />
                    <label>Commented</label>
                </div>

                <div className="form-check row">
                    <input
                        className="col-1"
                        name="after_login"
                        type="checkbox"
                        />
                    <label>Available after log in</label>
                </div>

                <div class="form-group mt-3">
                  <label for="pageType">Page type:</label>
                  <select class="rs-select form-control" id="pageType" v-model="page_type">
                    <option v-for="pageType in page_types" :key="pageType" :value="pageType">
                      {{ pageType }}
                    </option>
                  </select>
                </div>    

                <div class="form-group mt-3" v-if="page_type !== 'main_page'">
                  <br>
                  tu bedzie wyswierlac sie dla innych stron niz main_page: <br>
                  1. menus<br>
                  2. parent_page                  
                </div>

                <div class="form-group mt-3" v-if="(page_type === 'cms') || (page_type === 'inner') || (page_type === 'privacy_policy' )">
                  <br>
                  tu bedzie contentCKE: CKEditor (dla: 'cms', 'inner', 'privacy_policy' )
                </div>
                <div class="form-group mt-3" v-else>
                  <textarea  class="form-control"  rows="20" cols="50" v-model="content[lang]" :placeholder="`content ${lang}`" style="fontSize:'10pt'"></textarea>
                </div>      
                
                <div className="form-group mt-3">
                  <input type="file" name="images"  multiple/>
                </div>              

              </form>

          </div>
        </div>
      </div><!-- container -->

    </div>
  </template>
  <script>
  import storage from "../state/storage";
  import { postPage, getPages } from "../api/apiCalls";

  export default {

    data() {

        const storedStateConfig = storage.getItem("config"); //when we refresh /pages the config not disaapear
        let configLangs = [];
        let configDefaultLang = '';
        let pageTypes = [];

        if(storedStateConfig){
          configLangs = storedStateConfig.langs;
          configDefaultLang = storedStateConfig.defaultLang;
          pageTypes = storedStateConfig.page_types;
        }

        const storedState = storage.getItem("auth");
        let token = '';
        if(storedState){
          token = storedState.token;
        }

        const defaultLang = this.$store.state.config.defaultLang || configDefaultLang;

        return {
          notRelatedPages: false,
          innerPages: false,
          langs: this.$store.state.config.langs || configLangs,
          lang: defaultLang, //it is changeable
          defaultLang: defaultLang,
          page_types : this.$store.state.config.page_types || pageTypes,
          token: this.$store.state.auth.token || token,
          page_type: 'cms',                    
          title: {},
          short_title: {},
          description: {},
          content: {},
          pre_loader: false,
          published: false,
          isAddMenu: false,
          new_menu_name: {},
          msgWrong: '',
          msgGood: ''
        };
    },
    methods: {
      async saveEditPage() {
        this.pre_loader = true;
        try {

            const post = {
                title: this.title,
                short_title: this.short_title,
                description: this.description,
                type: this.page_type, //!
                content: this.content,
                published: this.published
            };

            //console.log('post', post);
            await postPage(post, this.token);

            const response = await getPages(this.token);
            this.notRelatedPages = this.getNotRelatedPages( response.data.data);
            this.innerPages = this.getInnerPages( response.data.data);
            
        } catch (error) {
            //this.failMessage = 'Invalid save page';
            console.log('_is_error__', error);
        }
        this.pre_loader = false;
      },
      changeLang(lang){
        this.lang = lang;
      },
      getNotRelatedPages( pages ) {
        let out = [];
        for(let page of pages){
          if( !page.menu_id && ('inner' !== page.type ) ){
            out.push(page);
          }
        }
        return out;
      },
      getInnerPages( pages ) {
        let out = [];
        for(let page of pages){
          if( 'inner' === page.type ){
            out.push(page);
          }
        }
        return out;
      },
      addMenu(){
        this.isAddMenu = true;
      },
      saveMenu(id){
        if(0 === id ){
          for(let lang of this.langs){
            if ( !this.new_menu_name[lang] ){
              this.msgWrong = 'Add menu name for '+lang+' lang';
              break;
            }
          }
          if(!this.msgWrong){
            console.log('no error todo');
          }
        }
      },
      delMenu(id){
        if(0 === id ){        
          this.isAddMenu = false;
        }
      }      
    },    
    async mounted() {
        if(!this.$store.state.auth || !this.$store.state.auth.isLoggedIn ){
            this.$router.push("/");
        }
        
        try {
            const response = await getPages(this.token);
            this.notRelatedPages = this.getNotRelatedPages( response.data.data);
            this.innerPages = this.getInnerPages( response.data.data);
        } catch (error) {
            console.log(error);
            //this.failResponse = error.response.data.message;
        }
        //this.pendingApiCall = false;        
    }
  };
  </script>