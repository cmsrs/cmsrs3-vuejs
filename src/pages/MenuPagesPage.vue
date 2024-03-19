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

      <div class="container msg-info mt-3 mb-3">
        <div class="row mt-3 mb-3">
          <div v-if="msgGood" class="alert alert-primary" role="alert_success">
            {{ msgGood }}
          </div>
          <div v-if="msgWrong" class="alert alert-danger" role="alert_danger">          
            <ul>
              <li v-for="(value, key) in msgWrong" :key="key">
                {{ key }}: {{ value[0] }}
              </li>
            </ul>            
          </div>      
        </div>
      </div>

      <div class="container">
        <div class="row">
          <!-- Menu  -->
          <div class="col-5">

            <button role="button_add_menu"  @click.prevent="addMenu" class="btn btn-primary mt-2 mb-2" :disabled="pre_loader">
              <i v-if="!pre_loader" class="fas fa-plus"></i>
              <span role="pre_loader_add_menu" v-if="pre_loader" class="spinner-grow spinner-grow-sm"></span>              
              Add menu
            </button>

            <div class="container" style="margin-left: 0px; padding-left: 0px;">
              <div class="row" v-for="(m, index) in menus" :key="m.id">

                  <div class="container mt-3">
                    <div class="row">    
                        <div class="form-group col-6">
                          <input role="menu"  class="form-control"   v-model="menus[index]['name'][lang]" >
                        </div>            
                        
                        <div role="save_menu" class="ml-2 col-1"  :class="{ 'disabled-if-loader': pre_loader }"  @click="saveMenu(index)"><i class="far fa-save cursor-pointer"></i></div>
                        <div role="del_menu"  class="ml-2 trash col-1"  :class="{ 'disabled-if-loader': pre_loader }"  @click="delMenu(index)"><i class="fas fa-trash cursor-pointer"  aria-hidden="true"/></div>

                        <div v-if="menus.length > 1" role="down_menu"  :class="{ 'disabled-if-loader': pre_loader }" class="ml-2 col-1"  @click="positionMenu('down', m.id)"><i class="fas fa-arrow-down cursor-pointer"  aria-hidden="true"/></div>
                        <div v-if="menus.length > 1" role="up_menu" :class="{ 'disabled-if-loader': pre_loader }" class="ml-2 col-1"  @click="positionMenu('up', m.id)"><i class="fas fa-arrow-up cursor-pointer"  aria-hidden="true"/></div>
                    </div>
                  </div>


                  <div class="container"  role="menu_pages" :data-menu-id="m.id"  v-if="getPagesBelongsToMenu( m.id )" >
                    <div class="row test-parent-page" v-for="p in getPagesBelongsToMenu( m.id )" :key="p.id">

                      <PageTitle
                        @execEditPage="editPage(p.id)"
                        @execDelPage="delPage(p.id)"
                        @execPositionPageUp="positionPageUp(p.id)"
                        @execPositionPageDown="positionPageDown(p.id)"
                        :pre_loader="pre_loader"                        
                        :p="p"
                        :lang="lang"
                        :allPages="allPages"
                      ></PageTitle>                      

                      <div class="container m-2"  role="page_pages" :data-page-id="p.id"  v-if="getPagesBelongsToPage( p.id )" >
                        <div class="row" v-for="pp in getPagesBelongsToPage( p.id )" :key="pp.id">

                          <PageTitle
                            @execEditPage="editPage(pp.id)"
                            @execDelPage="delPage(pp.id)"
                            @execPositionPageUp="positionPageUp(pp.id)"
                            @execPositionPageDown="positionPageDown(pp.id)"
                            :pre_loader="pre_loader"                        
                            :p="pp"
                            :lang="lang"
                            :allPages="allPages"
                          ></PageTitle>

                        </div>

                      </div>
                    </div>
                  </div>
              </div>
            </div>

            <div class="container" style="margin-left: 0px; padding-left: 0px;">
              <div class="row  mt-3"  v-if="isAddMenu" >

                  <div class="form-group col-6">
                    <input role="new_menu"  class="form-control"  :class="{ 'is-invalid': menus_error_new }"  v-model="new_menu_name[lang]" :placeholder="`Menu name ${lang}`">
                  </div>
                  
                  <div role="save_menu_0" class="ml-2 col-1"  @click="saveMenu('new')"><i class="far fa-save cursor-pointer"></i></div>
                  <div role="del_menu_0"  class="ml-2 trash  col-1"  @click="delMenu('new')"><i class="fas fa-trash cursor-pointer"  aria-hidden="true"/></div>

              </div>
            </div>

            <div class="container"  style="margin-left: 0px; padding-left: 0px;">
              <div class="row"  v-if="notRelatedPages" >
                <h5 class="mt-4">Pages not related to menu</h5>
                  <div class="row" v-for="(p, index) in notRelatedPages" :key="index">

                    <PageTitle
                      @execEditPage="editPage(p.id)"
                      @execDelPage="delPage(p.id)"
                      @execPositionPageUp="positionPageUp(p.id)"
                      @execPositionPageDown="positionPageDown(p.id)"
                      :pre_loader="pre_loader"                        
                      :p="p"
                      :lang="lang"
                      :allPages="allPages"
                    ></PageTitle>                      

                  </div>
              </div>
              <div class="row"  v-if="innerPages" >
                <h5 class="mt-4">Inner boxes</h5>
                  <div class="row" v-for="(p, index) in innerPages" :key="index">                  

                    <PageTitle
                      @execEditPage="editPage(p.id)"
                      @execDelPage="delPage(p.id)"
                      @execPositionPageUp="positionPageUp(p.id)"
                      @execPositionPageDown="positionPageDown(p.id)"
                      :pre_loader="pre_loader"                        
                      :p="p"
                      :lang="lang"
                      :allPages="allPages"
                      :showPageId=true
                    ></PageTitle>                      

                  </div>
              </div>
            </div>

          </div>

          <!-- Pages  -->
          <div class="col-7">

              <!-- !to moze byc takze edit page -->
              <button role="button_save_edit_page" @click.prevent="saveEditPage"  type="submit" class="add-page-btn  btn btn-primary mt-2 mb-2 mr-2" :disabled="pre_loader">
                <i v-if="!pre_loader" class="fas fa-plus"></i>
                <span role="pre_loader_save_edit_page" v-if="pre_loader" class="spinner-grow spinner-grow-sm"></span>
                Add/Edit page
              </button>
              <button role="button_clear_page_data" @click.prevent="clearDataPage"  class="add-page-btn  btn btn-info ml-3 mt-2 mb-2"  :disabled="pre_loader">Clear data</button>
        
              <form>
                <div class="form-group mt-3 ">              
                  <input class="form-control" :class="{ 'is-invalid': errFields.includes('title') }"  v-model="title[lang]" :placeholder="`title ${lang}`">
                </div>

                <div class="form-group mt-3 ">              
                  <input  class="form-control"  :class="{ 'is-invalid': errFields.includes('short_title') }"  v-model="short_title[lang]" :placeholder="`short title ${lang}`">
                </div>              

                <div class="form-group mt-3 ">                            
                  <textarea  class="form-control"  rows="4" cols="50" v-model="description[lang]" :placeholder="`description ${lang}`"></textarea>
                </div>


                <div class="form-check mt-2 row" >
                  <label>
                    <input
                      class="col-1"
                      name="published"
                      type="checkbox"
                      v-model="published"
                      />
                      Published
                  </label>
                </div>

                <div class="form-check  mt-2 row">
                    <label>                  
                      <input
                        class="col-1"
                        name="commented"
                        type="checkbox"
                        />
                      Commented
                    </label>
                </div>

                <div class="form-check  mt-2 row">
                    <label>
                      <input
                        class="col-1"
                        name="after_login"
                        type="checkbox"
                        />
                      Available after log in
                    </label>
                </div>

                <div class="form-group mt-3">
                  <label for="pageType"  class="text-secondary">Page type:</label>
                  <select class="rs-select form-control" id="pageType" v-model="page_type">
                    <option v-for="pageType in page_types" :key="pageType" :value="pageType">
                      {{ pageType }}
                    </option>
                  </select>
                </div>    

                <div class="mt-3" v-if="page_type !== 'main_page'">
                  <!--
                  tu bedzie wyswierlac sie dla innych stron niz main_page:
                  1. menus
                  2. parent_page                  
                  -->

                  <div class="form-group mt-3">
                    <label for="menu_items" class="text-secondary">Menu:</label>
                    <select role="menu_items"  class="rs-select form-control" v-model="menu_id" @change="handleMenuChange">
                      <option  value="" ></option> <!-- Pusta wartość -->                      
                      <option v-for="menu in menus" :key="menu.id" :value="menu.id">
                        {{ menu.name[lang] }}
                      </option>
                    </select>
                  </div>    


                  <div class="form-group mt-3">
                    <label for="page"  class="text-secondary">Parent page:</label>
                    <select role="page_items"  class="rs-select form-control" v-model="page_id">
                      <option   value="" ></option> <!-- Pusta wartość -->
                      <option v-for="page in rootPagesBelongToMenu" :key="page.id" :value="page.id">
                        {{ page.short_title[lang] }}
                      </option>
                    </select>
                  </div>    


                </div>

                <div class="mt-4">
                  <div class="form-group" v-if="(page_type === 'cms') || (page_type === 'inner') || (page_type === 'privacy_policy' )">
                    <br>
                    <ckeditor :editor="editor" v-model="content[lang]" :config="editorConfig"></ckeditor>
                    <!--
                    tu bedzie contentCKE: CKEditor (dla: 'cms', 'inner', 'privacy_policy' )
                    -->
                  </div>
                  <div class="form-group" v-else>
                    <textarea  class="form-control"  rows="20" cols="50" v-model="content[lang]" :placeholder="`content ${lang}`" style="font-size:'10pt'"></textarea>
                  </div>      
                </div>
                

                <label  class="custom-file-upload mt-3" :style="{ opacity: pre_loader ? '0.6' : '1' }">
                    <input class="upload-img" type="file" name="images" @change="handleUploadFile"   multiple :disabled="pre_loader">
                    <span role="pre_loader_add_menu" v-if="pre_loader" class="spinner-grow spinner-grow-sm"></span>
                    <i v-if="!pre_loader" class="fas fa-plus"></i>Upload Images
                </label>
                  


              </form>

          </div>
        </div>
      </div><!-- container -->

    </div>
  </template>
  <script>
  import functions from "../helpers/functions.js";
  import trans from "../helpers/trans.js";
  import storage from "../state/storage";
  import PageTitle from "../components/PageTitle";
  import { postPage, putPage, getPages, postMenu, getMenus, putMenu, deleteMenu, setMenuPosition, deletePage, setPagePosition, uploadImage } from "../api/apiCalls";
  import CKEditor from '@ckeditor/ckeditor5-vue';
  import ClassicEditor from '@ckeditor/ckeditor5-build-classic';


  export default {
    name: "MenuPages",
    components: {
      PageTitle,
      ckeditor: CKEditor.component
    },

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
          msgWrong: '',
          msgGood: '',
          allPages: [],
          notRelatedPages: false,
          innerPages: false,
          pagesBelongsToMenus: [],
          pagesBelongsToPages: [],
          langs: this.$store.state.config.langs || configLangs,
          lang: defaultLang, //it is changeable
          defaultLang: defaultLang,
          page_types : this.$store.state.config.page_types || pageTypes,
          token: this.$store.state.auth.token || token,

          //page fields
          title: {},
          short_title: {},
          description: {},
          content: {},
          page_type: 'cms',                    
          published: false,
          commented: false,           
          after_login: false, 
          menu_id: '', 
          page_id:'', 
          images: [],            

          rootPagesBelongToMenu: [],
          isAddMenu: false,
          pre_loader: false,          
          new_menu_name: {},
          menus: [],
          menus_error_new: false,
          errFields: [],
          currentPageId: false,

          editor: ClassicEditor,
          editorConfig: {
            // The configuration of the editor.
          }          
        };
    },
    methods: {

      async saveEditPage() {
        if (!this.startLoading()) {
            return false;
        }

        try {
            const post = {
                title: this.title,
                short_title: this.short_title,
                description: this.description,
                type: this.page_type, //!
                content: this.content,
                published: this.published,

                commented: this.commented,
                after_login:  this.after_login,
                menu_id: this.menu_id,
                page_id: this.page_id,
                images: this.images

            };

            const retPage = this.currentPageId ? await putPage(post, this.currentPageId, this.token) : await postPage(post, this.token);

            if(retPage.data.success){
                this.msgGood = this.currentPageId ? trans.ttt( 'success_page_edit' ) : trans.ttt( 'success_page_add' );
            }else if( retPage.data.success === false ){
                this.msgWrong =  await functions.parseError( retPage.data.error );
                this.errFields =  await functions.getErrorFields( retPage.data.error );
            }else{
                this.msgWrong = 'Something wrong';                              
            }            

            const ret = await this.refreshPages();
            if(ret){
              this.pre_loader = false;
            }
            
        } catch (error) {
            //this.failMessage = 'Invalid save page';
            console.log('_is_error__', error);
        }
        this.pre_loader = false;
      },

      clearDataPage(){
        if (!this.startLoading()) {
            return false;
        }

        this.title = {};
        this.short_title = {};
        this.description = {};
        this.content = {};
        this.page_type = 'cms';
        this.published = false;

        this.commented = false;           
        this.after_login = false;
        this.menu_id = '';
        this.page_id = '';
        this.images = [];            

        this.currentPageId = false; //!

        this.pre_loader = false;
      },

      delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      },

      async handleUploadFile(event){
        if(this.pre_loader){
          return false;
        }

        const files = event.target.files || event.dataTransfer.files;
        if (!files.length){
          return false;          
        } 

        if (!this.currentPageId){
          return false;          
        } 

        if (!this.startLoading()) {
          return false;
        }

        const images = await this.getImages(files);    

        for (let i = 0; i < images.length; i++) {

            let ret = uploadImage( images[i], 'page', this.currentPageId, this.token );
            await this.delay(5000);

            if(ret){
                this.msgGood = 'Images has been uploaded ' + (i + 1) + "/" + images.length;
            }
        }        
        this.pre_loader = false;        
      },

      async getImages(files) {
          const promises = [];
          for (let i = 0; i < files.length; i++) {
              promises.push(new Promise((resolve, reject) => {
                  let name = files[i].name;
                  let reader = new FileReader();

                  reader.readAsDataURL(files[i]);
                  reader.onload = (e) => {
                      resolve({ data: e.target.result, name: name });
                  }
                  reader.onerror = (error) => {
                      reject(error);
                  };
              }));
          }
          return Promise.all(promises);
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
      getPagesBelongsToMenus( pages ){
        let out = [];
        for(let page of pages){
          if( page.menu_id &&  !page.page_id ){
            if ( 'undefined' === typeof(out[page.menu_id]) ){
              out[page.menu_id] = [];
            }
            out[page.menu_id].push( page );
            
          }
        }
        return out;
      },
      getPagesBelongsToMenu( menuId ) {
        if ( 'undefined' === typeof(this.pagesBelongsToMenus[menuId]) ){
          return false;
        }
        return this.pagesBelongsToMenus[menuId];
      },
      getPagesBelongsToPages( pages ){
        let out = [];
        for(let page of pages){
          if( page.page_id ){
            if ( 'undefined' === typeof(out[page.page_id]) ){
              out[page.page_id] = [];
            }
            out[page.page_id].push( page );
            
          }
        }
        return out;
      },
      getPagesBelongsToPage( parentPageId ){
        if ( 'undefined' === typeof(this.pagesBelongsToPages[parentPageId]) ){
          return false;
        }
        return this.pagesBelongsToPages[parentPageId];
      },

      addMenu(){
        this.clearMsg();
        this.isAddMenu = true;
        this.menus_error_new = false;
        this.new_menu_name = {};
      },
      async saveMenu(index){
        this.clearMsg();
        if('new' === index ){
          this.menus_error_new = false;
          for(let lang of this.langs){
            if ( !this.new_menu_name[lang] ){
              this.msgWrong = 'Add menu name'; // for '+lang+' lang';
              this.menus_error_new = true;
              break;
            }
          }
          if(!this.msgWrong){
            if (!this.startLoading()) {
              return false;
            }

            try {
              const post = {
                name: this.new_menu_name
              };
              const addMenu = await postMenu(post, this.token);
              if( addMenu.data.success ){
                const ret = await this.refreshMenus();
                if(ret){
                  this.isAddMenu = false;
                  this.msgGood = 'Menu has been added';
                }
              }            
            } catch (error) {
              console.log('_is_error__', error);
              this.msgWrong = 'Add menu problem = ' + error;
            }
            this.pre_loader = false;
          }
        }else{
          if( !this.menus[index]['name'] ){
            console.log('sth wrong i cant find menu with index='+ index);
            return false;
          }
          const menuByLangs = this.menus[index]['name'];
          //console.log('po zmianie i tu jest blad w testach i w przegladarce jak sie reczenie testuje', menuByLangs); //not change, why
          for(let lang of this.langs){
            if ( !menuByLangs[lang] ){
              this.msgWrong = 'Add menu name'; // for '+lang+' lang';
              break;
            }
          }

          if(!this.msgWrong){
            if (!this.startLoading()) {
              return false;
            }

            try {
              const post = {
                id: this.menus[index]['id'],
                name: menuByLangs
              };
              const updateMenu = await putMenu(post, this.token);
              if(updateMenu.data.success){
                //await this.refreshMenus();
                this.msgGood = 'Menu has been changed';                
              }
            } catch (error) {
              console.log('_is_error__', error);
              this.msgWrong = 'Add menu problem = ' + error;
            }
            this.pre_loader = false;
          }
        }
      },
      async delMenu(index){
        this.clearMsg();
        if('new' === index ){        
          this.isAddMenu = false;
        }else{
          if (window.confirm('Are you sure you wish to delete this item?')){
            if (!this.startLoading()) {
                return false;
            }

            try {
                const menuId = this.menus[index]['id'];
                const objDeleteMenu = await deleteMenu(menuId, this.token);
                if(objDeleteMenu.data.success){
                  const ret = await this.refreshMenus();
                  if(ret){
                    this.msgGood = 'Menu has been deleted';
                    this.pre_loader = false;
                  }
                }
            } catch (error) {
              console.log('_is_error__', error);
              this.msgWrong = 'Delete menu problem = ' + error;
            }
          }
        }
      },
      clearMsg(){
        this.msgWrong = '';
        this.msgGood = '';
        this.errFields = [];
      },
      async startLoading() {        
        this.clearMsg();
        if (this.pre_loader) {
            return false;
        }
        this.pre_loader = true;
        return true;
      },
      async positionMenu(direction, menuId){
        if (!this.startLoading()) {
            return false;
        }
        try {
            const pos = await setMenuPosition( direction, menuId, this.token);
          
            if(pos.data.success){
              const ret = await this.refreshMenus();
              if(ret){
                this.msgGood = 'Position menu has been changed';
                this.pre_loader = false;
              }            
            }
        } catch (error) {
          console.log('_is_error__', error);
          this.msgWrong = 'Position menu problem = ' + error;
        }        
      },

      /**
       * only root pages withot children (copy from react)
       * get root pages belongs to given menu, and get pages without children
       */
      getRootPages( menuId ){
        menuId = parseInt( menuId );        
        const pageId = this.currentPageId ? parseInt( this.currentPageId ) : false;

        let parentIds = [] //get children
        for(let p of this.allPages){
          if( (p.menu_id === menuId) &&  p.page_id ){
            parentIds.push(p.page_id);
          }
        }

        let pages = [];
        
        //only one level of depth
        if(parentIds.includes(pageId)){
          return pages;
        }

        for(let p of this.allPages){
          //edit
          if( (p.menu_id === menuId) && !p.page_id && pageId && (p.id !== pageId ) ){
            pages.push(p);
          }
          //new
          if( (p.menu_id === menuId) && !p.page_id && !pageId ){
            pages.push(p);
          }
        }

        return pages;
      },

      handleMenuChange() {
        this.rootPagesBelongToMenu = this.menu_id ? this.getRootPages( this.menu_id ) : [];
      },

      editPage(pageId){
        this.clearMsg();
        const p = this.allPages.find( (page) =>  page.id === pageId );

        this.currentPageId = p.id;

        this.rootPagesBelongToMenu = p.menu_id ?  this.getRootPages( p.menu_id ) : [];
        this.title = p.title;
        this.short_title = p.short_title;
        this.description = p.description;
        this.page_type = p.type; //!
        this.content = p.content[this.lang] ? p.content : functions.createEmptyObj( this.langs );
        this.published =  p.published;

        this.commented = p.commented;
        this.after_login = p.after_login;
        this.menu_id = p.menu_id;
        this.page_id = p.page_id;
        this.images = p.images;
        
      },
      async delPage(pageId){
        this.clearMsg();
        if (window.confirm('Are you sure you wish to delete this item?')){
            if (!this.startLoading()) {
                return false;
            }

            try {
                const objDeletePage = await deletePage(pageId, this.token);
                if(objDeletePage.data.success){
                  const ret = await this.refreshPages();
                  if(ret){
                    this.msgGood = 'Page has been deleted';
                    this.pre_loader = false;
                  }
                }
            } catch (error) {
              console.log('_is_error__', error);
              this.msgWrong = 'Delete menu problem = ' + error;
            }
          }
        },

        async positionPageUp( pageId){
          this.positionPage('up', pageId);
        },
        async positionPageDown( pageId){
          this.positionPage('down', pageId);
        },

        async positionPage(direction, pageId){
          if (!this.startLoading()) {
              return false;
          }
          
          try {
              const pos = await setPagePosition( direction, pageId, this.token);
              if(pos.data.success){
                const ret = await this.refreshPages();
                if(ret){
                  this.msgGood = 'Position page has been changed';
                  this.pre_loader = false;
                }            
              }
          } catch (error) {
            console.log('_is_error__', error);
            this.msgWrong = 'Position page problem = ' + error;
          }                  
        },

        async refreshMenus(){
          try {
              const responseM = await getMenus(this.token);            
              this.menus = responseM.data.data;
              return true;
          } catch (error) {
              console.log( 'error get menu=', error);
          }
          return false;
        },

        async refreshPages(){
          try {
              const responseP = await getPages(this.token);
              this.allPages = responseP.data.data;
              this.pagesBelongsToMenus = this.getPagesBelongsToMenus(responseP.data.data);
              this.pagesBelongsToPages = this.getPagesBelongsToPages(responseP.data.data);

              this.notRelatedPages = this.getNotRelatedPages( responseP.data.data);
              this.innerPages = this.getInnerPages( responseP.data.data);
              return true;
          } catch (error) {
              console.log( 'error get pages=', error);
          }
          return false;        
        },
      },    

      async mounted() {
          if(!this.$store.state.auth || !this.$store.state.auth.isLoggedIn || !this.token){
              this.$router.push("/");
          }

          this.pre_loader = true;
          const refreshM = await this.refreshMenus();
          const refreshP = await this.refreshPages();

          if(refreshM && refreshP ){
            this.pre_loader = false;
          }
      },

      watch: {
        new_menu_name: {
          handler: function () {
            this.clearMsg();
          },
          deep: true
        },
        menus: {
          handler: function () {
            this.clearMsg();
          },
          deep: true
        }

      }

  };
  </script>