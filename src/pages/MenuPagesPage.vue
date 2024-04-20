<template>
  <div class="mb-3" data-testid="pages-page">
    <!-- change lang and h1 -->
    <div class="container">
      <div class="row mt-3 mb-3">
        <h3 class="col-10" role="head_menu_pages">CMS - menus and pages</h3>
        <div role="change_lang" class="col-2" v-if="langs.length > 1">
          <div v-for="l in langs" :key="l">
            <span
              :class="{
                'mr-1 cursor-pointer text-primary': lang === l,
                'mr-1 cursor-pointer text-secondary': lang !== l,
              }"
              @click="changeLang(l)"
              >{{ l }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <Msg :msgGood="msgGood" :msgWrong="msgWrong"></Msg>

    <div class="container">
      <div class="row">
        <!-- Menu  -->
        <div class="col-5">
          <button
            role="button_add_menu"
            @click.prevent="addMenu"
            class="btn btn-primary mt-2 mb-2"
            :disabled="pre_loader"
          >
            <i v-if="!pre_loader" class="fas fa-plus"></i>
            <span
              role="pre_loader_add_menu"
              v-if="pre_loader"
              class="spinner-grow spinner-grow-sm"
            ></span>
            Add menu
          </button>

          <div class="container" style="margin-left: 0px; padding-left: 0px">
            <div class="row" v-for="(m, index) in menus" :key="m.id">
              <div class="container mt-3">
                <div class="row">
                  <div class="form-group col-6">
                    <input
                      role="menu"
                      class="form-control"
                      v-model="menus[index]['name'][lang]"
                    />
                  </div>

                  <div
                    role="save_menu"
                    class="ml-2 col-1"
                    :class="{ 'disabled-if-loader': pre_loader }"
                    @click="saveMenu(index)"
                  >
                    <i class="far fa-save cursor-pointer"></i>
                  </div>
                  <div
                    role="del_menu"
                    class="ml-2 trash col-1"
                    :class="{ 'disabled-if-loader': pre_loader }"
                    @click="delMenu(index)"
                  >
                    <i class="fas fa-trash cursor-pointer" aria-hidden="true" />
                  </div>

                  <div
                    v-if="menus.length > 1"
                    role="down_menu"
                    :class="{ 'disabled-if-loader': pre_loader }"
                    class="ml-2 col-1"
                    @click="positionMenu('down', m.id)"
                  >
                    <i
                      class="fas fa-arrow-down cursor-pointer"
                      aria-hidden="true"
                    ></i>
                  </div>
                  <div
                    v-if="menus.length > 1"
                    role="up_menu"
                    :class="{ 'disabled-if-loader': pre_loader }"
                    class="ml-2 col-1"
                    @click="positionMenu('up', m.id)"
                  >
                    <i
                      class="fas fa-arrow-up cursor-pointer"
                      aria-hidden="true"
                    ></i>
                  </div>
                </div>
              </div>

              <div
                class="container"
                role="menu_pages"
                :data-menu-id="m.id"
                v-if="getPagesBelongsToMenu(m.id)"
              >
                <div
                  class="row test-parent-page"
                  v-for="p in getPagesBelongsToMenu(m.id)"
                  :key="p.id"
                >
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

                  <div
                    class="container m-2"
                    role="page_pages"
                    :data-page-id="p.id"
                    v-if="getPagesBelongsToPage(p.id)"
                  >
                    <div
                      class="row"
                      v-for="pp in getPagesBelongsToPage(p.id)"
                      :key="pp.id"
                    >
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

          <div class="container" style="margin-left: 0px; padding-left: 0px">
            <div class="row mt-3" v-if="isAddMenu">
              <div class="form-group col-6">
                <input
                  role="new_menu"
                  class="form-control"
                  :class="{ 'is-invalid': menus_error_new }"
                  v-model="new_menu_name[lang]"
                  :placeholder="`Menu name ${lang}`"
                />
              </div>

              <div
                role="save_menu_0"
                class="ml-2 col-1"
                @click="saveMenu('new')"
              >
                <i class="far fa-save cursor-pointer"></i>
              </div>
              <div
                role="del_menu_0"
                class="ml-2 trash col-1"
                @click="delMenu('new')"
              >
                <i class="fas fa-trash cursor-pointer" aria-hidden="true" />
              </div>
            </div>
          </div>

          <div class="container" style="margin-left: 0px; padding-left: 0px">
            <div class="row" v-if="notRelatedPages">
              <h5 class="mt-4">Pages not related to menu</h5>
              <div
                class="row"
                v-for="(p, index) in notRelatedPages"
                :key="index"
              >
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
            <div class="row" v-if="innerPages">
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
                  :showPageId="true"
                ></PageTitle>
              </div>
            </div>
          </div>
        </div>

        <!-- Pages  -->
        <div class="col-7">
          <!-- !it can be edit page too -->
          <button
            role="button_save_edit_page"
            @click.prevent="saveEditPage"
            type="submit"
            class="add-page-btn btn btn-primary mt-2 mb-2 mr-2"
            :disabled="pre_loader"
          >
            <i v-if="!pre_loader" class="fas fa-plus"></i>
            <span
              role="pre_loader_save_edit_page"
              v-if="pre_loader"
              class="spinner-grow spinner-grow-sm"
            ></span>
            <span v-if="!currentPageId">Add page</span>
            <span v-if="currentPageId">Edit page</span>
          </button>
          <button
            role="button_clear_page_data"
            @click.prevent="clearDataPage"
            class="add-page-btn btn btn-info ml-3 mt-2 mb-2"
            :disabled="pre_loader"
          >
            Clear data
          </button>

          <form>
            <div class="form-group mt-3">
              <input
                class="form-control"
                :class="{ 'is-invalid': errFields.includes('title') }"
                v-model="title[lang]"
                :placeholder="`title ${lang}`"
              />
            </div>

            <div class="form-group mt-3">
              <input
                class="form-control"
                :class="{ 'is-invalid': errFields.includes('short_title') }"
                v-model="short_title[lang]"
                :placeholder="`short title ${lang}`"
              />
            </div>

            <div class="form-group mt-3">
              <textarea
                class="form-control"
                rows="4"
                cols="50"
                v-model="description[lang]"
                :placeholder="`description ${lang}`"
              ></textarea>
            </div>

            <div class="form-check mt-2 row">
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

            <div class="form-check mt-2 row">
              <label>
                <input class="col-1" name="commented" type="checkbox" />
                Commented
              </label>
            </div>

            <div class="form-check mt-2 row">
              <label>
                <input class="col-1" name="after_login" type="checkbox" />
                Available after log in
              </label>
            </div>

            <div class="form-group mt-3">
              <label for="pageType" class="text-secondary">Page type:</label>
              <select
                class="rs-select form-control"
                id="pageType"
                v-model="page_type"
              >
                <option
                  v-for="pageType in page_types"
                  :key="pageType"
                  :value="pageType"
                >
                  {{ pageType }}
                </option>
              </select>
            </div>

            <div class="mt-3" v-if="page_type !== 'main_page'">
              <!--
                  it is show 
                  1. menus
                  2. parent_page                  
                  for page_type different then main_page
                  -->

              <div class="form-group mt-3">
                <label for="menu_items" class="text-secondary">Menu:</label>
                <select
                  role="menu_items"
                  class="rs-select form-control"
                  v-model="menu_id"
                  @change="handleMenuChange"
                >
                  <option value=""></option>
                  <option v-for="menu in menus" :key="menu.id" :value="menu.id">
                    {{ menu.name[lang] }}
                  </option>
                </select>
              </div>

              <div class="form-group mt-3">
                <label for="page" class="text-secondary">Parent page:</label>
                <select
                  role="page_items"
                  class="rs-select form-control"
                  v-model="page_id"
                >
                  <option value=""></option>
                  <option
                    v-for="page in rootPagesBelongToMenu"
                    :key="page.id"
                    :value="page.id"
                  >
                    {{ page.short_title[lang] }}
                  </option>
                </select>
              </div>
            </div>

            <div class="mt-4">
              <div
                class="form-group"
                v-if="
                  page_type === 'cms' ||
                  page_type === 'inner' ||
                  page_type === 'privacy_policy'
                "
              >
                <br />
                <ckeditor
                  :editor="editor"
                  v-model="content[lang]"
                  :config="editorConfig"
                ></ckeditor>
                <!--
                    we show contentCKE: CKEditor (for: 'cms', 'inner', 'privacy_policy' )
                    -->
              </div>
              <div class="form-group" v-else>
                <textarea
                  class="form-control textarea-rs"
                  rows="20"
                  cols="50"
                  v-model="content[lang]"
                  :placeholder="`content ${lang}`"
                ></textarea>
              </div>
            </div>

            <label
              class="custom-file-upload mt-3 mb-3"
              :style="{ opacity: pre_loader || !currentPageId ? '0.6' : '1' }"
            >
              <input
                class="upload-img"
                type="file"
                name="images"
                @change="handleUploadFile"
                multiple
                :disabled="pre_loader || !currentPageId"
              />
              <span
                role="pre_loader_upload_images"
                v-if="pre_loader"
                class="spinner-grow spinner-grow-sm"
              ></span>
              <i v-if="!pre_loader" class="fas fa-plus"></i>Upload Images
            </label>

            <div
              class="row mt-2"
              v-for="(image, index) in images"
              :key="image.id"
            >
              <img
                class="col-2"
                :src="SERVER_URL + image['fs']['small']"
                :alt="image['alt'][lang]"
              />

              <div class="form-group col-6">
                <input
                  role="menu"
                  class="form-control"
                  v-model="images[index]['alt'][lang]"
                />
              </div>

              <div
                role="del_image"
                class="ml-2 trash col-1"
                :class="{ 'disabled-if-loader': pre_loader }"
                @click="delImage(image.id)"
              >
                <i class="fas fa-trash cursor-pointer" aria-hidden="true"></i>
              </div>
              <div
                role="down_image"
                :class="{ 'disabled-if-loader': pre_loader }"
                class="ml-2 col-1"
                @click="positionImage('down', image.id)"
              >
                <i
                  class="fas fa-arrow-down cursor-pointer"
                  aria-hidden="true"
                ></i>
              </div>
              <div
                role="up_image"
                :class="{ 'disabled-if-loader': pre_loader }"
                class="ml-2 col-1"
                @click="positionImage('up', image.id)"
              >
                <i
                  class="fas fa-arrow-up cursor-pointer"
                  aria-hidden="true"
                ></i>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <!-- container -->
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted,  defineComponent  } from 'vue';
import { useRouter } from 'vue-router';
import { SERVER_URL } from "../config.js";
import functions from "../helpers/functions.js";
import trans from "../helpers/trans.js";
import {
  postPage,
  putPage,
  getPages,
  postMenu,
  getMenus,
  putMenu,
  deleteMenu,
  setMenuPosition,
  deletePage,
  setPagePosition,
  uploadImage,
  getImages as ApiGetImages,
  deleteImage,
  setImagePosition,
} from "../api/apiCalls";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import PageTitle from "../components/PageTitle.vue";
import Msg from "../components/Msg.vue";


// Data
const { configLangs, configDefaultLang, pageTypes, token } = functions.retrieveParamsFromStorage();
const langs = ref(configLangs);
const lang = ref(configDefaultLang);
const defaultLang = ref(configDefaultLang);
const page_types = ref(pageTypes);
//const token = ref(token);

const msgWrong = ref("");
const msgGood = ref("");
const pre_loader = ref(false);
const errFields = ref([]);

const allPages = ref([]);
const notRelatedPages = ref(false);
const innerPages = ref(false);
const pagesBelongsToMenus = ref([]);
const pagesBelongsToPages = ref([]);

const title = ref({});
const short_title = ref({});
const description = ref({});
const content = ref({});
const page_type = ref("cms");
const published = ref(false);
const commented = ref(false);
const after_login = ref(false);
const menu_id = ref("");
const page_id = ref("");
const images = ref([]);

const rootPagesBelongToMenu = ref([]);
const isAddMenu = ref(false);
const new_menu_name = ref({});
const menus = ref([]);
const menus_error_new = ref(false);
const currentPageId = ref(false);

const editor = ref(ClassicEditor);
const editorConfig = ref({
});



editor.value = ClassicEditor
const ckeditor = CKEditor.component

/*
//import CKEditor from "@ckeditor/ckeditor5-vue";
//import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
const editor = ref(ClassicEditor);
const editorConfig = ref({
});

const  ckeditor =  CKEditor.component;
*/

/*
export default defineComponent({
  setup() {
    // Deklaracja ref dla ClassicEditor i konfiguracji
    const editor = ref(ClassicEditor);
    const editorConfig = ref({
      // Konfiguracja edytora
    });

    // Deklaracja aliasu ckeditor dla CKEditor.component
    const ckeditor = CKEditor.component;

    return { editor, editorConfig, ckeditor };
  },
})
*/


/*
setup() {
    // Ref dla ClassicEditor
    const editor = ref(ClassicEditor);

    // Zwracanie potrzebnych danych lub funkcji
    return {
      editor,
    };
}
*/


// Computed
//const SERVER_URL = computed(() => SERVER_URL);

// Methods
const saveEditPage = async () => {
  if (!startLoading()) {
    return false;
  }

  try {
    const post = {
      title: title.value,
      short_title: short_title.value,
      description: description.value,
      type: page_type.value,
      content: content.value,
      published: published.value,
      commented: commented.value,
      after_login: after_login.value,
      menu_id: menu_id.value,
      page_id: page_id.value,
      images: images.value,
    };

    const retPage = currentPageId.value
      ? await putPage(post, currentPageId.value, token)
      : await postPage(post, token);

    if (retPage.data.success) {
      if (!currentPageId.value) {
        currentPageId.value = retPage.data.data.pageId;
        msgGood.value = trans.ttt("success_page_add");
      } else {
        msgGood.value = trans.ttt("success_page_edit");
      }
    } else if (retPage.data.success === false) {
      msgWrong.value = await functions.parseError(retPage.data.error);
      errFields.value = await functions.getErrorFields(retPage.data.error);
    } else {
      msgWrong.value = "Something wrong";
    }

    const ret = await refreshPages();
    if (ret) {
      pre_loader.value = false;
    }
  } catch (error) {
    console.log("_is_error__", error);
  }
  pre_loader.value = false;
};

const clearDataPage = () => {
  if (!startLoading()) {
    return false;
  }

  title.value = {};
  short_title.value = {};
  description.value = {};
  content.value = {};
  page_type.value = "cms";
  published.value = false;
  commented.value = false;
  after_login.value = false;
  menu_id.value = "";
  page_id.value = "";
  images.value = [];

  currentPageId.value = false;

  pre_loader.value = false;
};

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function handleUploadFile(event) {
  if (pre_loader.value) {
    return false;
  }

  const files = event.target.files || event.dataTransfer.files;
  if (!files.length) {
    return false;
  }

  if (!currentPageId.value) {
    return false;
  }

  if (!startLoading()) {
    return false;
  }

  const images = await getImages(files);

  for (let i = 0; i < images.length; i++) {
    let ret = uploadImage(
      images[i],
      "page",
      currentPageId.value,
      token
    );
    await delay(6000);

    if (ret) {
      msgGood.value =
        "Images has been uploaded " + (i + 1) + "/" + images.length;
    }
  }

  const dbImages = await ApiGetImages("page", currentPageId.value, token);
  if (dbImages.data.success) {
    // Assuming msgGood is a ref object
    msgGood.value = "Images has been uploaded";
    pre_loader.value = false;
  }
}

async function getImages(files) {
  const promises = [];
  for (let i = 0; i < files.length; i++) {
    promises.push(
      new Promise((resolve, reject) => {
        let name = files[i].name;
        let reader = new FileReader();

        reader.readAsDataURL(files[i]);
        reader.onload = (e) => {
          resolve({ data: e.target.result, name: name });
        };
        reader.onerror = (error) => {
          reject(error);
        };
      }),
    );
  }
  return Promise.all(promises);
}

function changeLang(inLang) {
  lang.value = inLang;
}

function getNotRelatedPages(pages) {
  let out = [];
  for (let page of pages) {
    if (!page.menu_id && "inner" !== page.type) {
      out.push(page);
    }
  }
  return out;
}

function getInnerPages(pages) {
  let out = [];
  for (let page of pages) {
    if ("inner" === page.type) {
      out.push(page);
    }
  }
  return out;
}
function     getPagesBelongsToMenus(pages) {
  let out = [];
  for (let page of pages) {
    if (page.menu_id && !page.page_id) {
      if ("undefined" === typeof out[page.menu_id]) {
        out[page.menu_id] = [];
      }
      out[page.menu_id].push(page);
    }
  }
  return out;
}
function     getPagesBelongsToMenu(menuId) {
  if ("undefined" === typeof pagesBelongsToMenus.value[menuId]) {
    return false;
  }
  return pagesBelongsToMenus.value[menuId];
}
function     getPagesBelongsToPages(pages) {
  let out = [];
  for (let page of pages) {
    if (page.page_id) {
      if ("undefined" === typeof out[page.page_id]) {
        out[page.page_id] = [];
      }
      out[page.page_id].push(page);
    }
  }
  return out;
}
function  getPagesBelongsToPage(parentPageId) {
  if ("undefined" === typeof pagesBelongsToPages.value[parentPageId]) {
    return false;
  }
  return pagesBelongsToPages.value[parentPageId];
}


function addMenu() {
      clearMsg();
      isAddMenu.value = true;
      menus_error_new.value = false;
      new_menu_name.value = {};
    }


async function saveMenu(index) {
  clearMsg();
  if ("new" === index) {

    menus_error_new.value = false;
    for (let lang of langs.value) {
      if (!new_menu_name.value[lang]) {
        msgWrong.value = "Add menu name"; // for lang = "+lang;
        menus_error_new.value = true;
        break;
      }
    }

    if (!msgWrong.value) {
      if (!startLoading()) {
        return false;
      }

      try {
        const post = {
          name: new_menu_name.value,
        };
        const addMenu = await postMenu(post, token);
        if (addMenu.data.success) {
          const ret = await refreshMenus();
          if (ret) {
            isAddMenu.value = false;
            msgGood.value = "Menu has been added";
          }
        }
      } catch (error) {
        console.log("_is_error__", error);
        msgWrong.value = "Add menu problem = " + error;
      }
      pre_loader.value = false;
    }
  } else {
    if (!menus.value[index]["name"]) {
      console.log("sth wrong i cant find menu with index=" + index);
      return false;
    }
    const menuByLangs = menus.value[index]["name"];
    for (let lang of langs.value) {
      if (!menuByLangs[lang]) {
        msgWrong.value = "Add menu name"; // for '+lang+' lang';
        break;
      }
    }

    if (!msgWrong.value) {
      if (!startLoading()) {
        return false;
      }

      try {
        const post = {
          id: menus.value[index]["id"],
          name: menuByLangs,
        };
        const updateMenu = await putMenu(post, token);
        if (updateMenu.data.success) {
          msgGood.value = "Menu has been changed";
        }
      } catch (error) {
        console.log("_is_error__", error);
        msgWrong.value = "Add menu problem = " + error;
      }
      pre_loader.value = false;
    }
  }
}

async function delMenu(index) {
  clearMsg();
  if ("new" === index) {
    isAddMenu.value = false;
  } else {
    if (window.confirm("Are you sure you wish to delete this item?")) {
      if (!startLoading()) {
        return false;
      }

      try {
        const menuId = menus.value[index]["id"];
        const objDeleteMenu = await deleteMenu(menuId, token);
        if (objDeleteMenu.data.success) {
          const ret = await refreshMenus();
          if (ret) {
            msgGood.value = "Menu has been deleted";
            pre_loader.value = false;
          }
        }
      } catch (error) {
        console.log("_is_error__", error);
        msgWrong.value = "Delete menu problem = " + error;
      }
    }
  }
}

function clearMsg() {
  msgWrong.value = "";
  msgGood.value = "";
  errFields.value = [];
}


const startLoading = async () => {
  clearMsg();
  if (pre_loader.value) {
    return false;
  }
  pre_loader.value = true;
  return true;
}



const positionMenu = async  (direction, menuId)  => {
      if (!startLoading()) {
        return false;
      }
      try {
        const pos = await setMenuPosition(direction, menuId, token);

        if (pos.data.success) {
          const ret = await refreshMenus();
          if (ret) {
            msgGood.value = "Position menu has been changed";
            pre_loader.value = false;
          }
        }
      } catch (error) {
        console.log("_is_error__", error);
        msgWrong.value = "Position menu problem = " + error;
      }
    }

    const delImage = async (id) => {
      if (!currentPageId.value) {
        console.log("cant find page_id");
        return false;
      }

      if (window.confirm("Are you sure you wish to delete this item?")) {
        if (!startLoading()) {
          return false;
        }

        try {
          const objDeleteImage = await deleteImage(id, token);
          if (objDeleteImage.data.success) {
            const images = await getImages(
              "page",
              currentPageId.value,
              token,
            );
            if (images.data.success) {
              images.value = images.data.data;
              msgGood.value = "Image has been deleted";
              pre_loader.value = false;
            }
          }
        } catch (error) {
          console.log("_is_error_del_image_", error);
          msgWrong.value = "Delete menu problem = " + error;
        }
      }
    }

    const positionImage = async  (direction, imageId)  => {
      if (!currentPageId.value) {
        console.log("cant find page_id");
        return false;
      }

      if (!startLoading()) {
        return false;
      }
      try {
        const pos = await setImagePosition(direction, imageId, token);

        if (pos.data.success) {
          const images = await getImages(
            "page",
            currentPageId.value,
            token,
          );
          if (images.data.success) {
            images.value = images.data.data;
            msgGood.value = "Position image has been changed";
            pre_loader.value = false;
          }
        }
      } catch (error) {
        console.log("_is_error_pos_image_", error);
        msgWrong.value = "Position image problem = " + error;
      }
    }

    /**
     * todo move this function to functions
     * only root pages without children (copy from react)
     * get root pages belongs to given menu, and get pages without children
     */
    function getRootPages(menuId) {
      menuId = parseInt(menuId);
      const pageId = currentPageId.value ? parseInt(currentPageId.value) : false;

      let parentIds = []; //get children
      for (let p of allPages.value) {
        if (p.menu_id === menuId && p.page_id) {
          parentIds.push(p.page_id);
        }
      }

      let pages = [];

      //only one level of depth
      if (parentIds.includes(pageId)) {
        return pages;
      }

      for (let p of allPages.value) {
        //edit
        if (p.menu_id === menuId && !p.page_id && pageId && p.id !== pageId) {
          pages.push(p);
        }
        //new
        if (p.menu_id === menuId && !p.page_id && !pageId) {
          pages.push(p);
        }
      }

      return pages;
    }

    const handleMenuChange = () => {
      rootPagesBelongToMenu.value = menu_id.value
        ? getRootPages(menu_id.value)
        : [];
    }

    const editPage = (pageId) => {
      clearMsg();
      const p = allPages.value.find((page) => page.id === pageId);

      currentPageId.value = p.id;

      rootPagesBelongToMenu.value = p.menu_id
        ? getRootPages(p.menu_id)
        : [];
      title.value = p.title;
      short_title.value = p.short_title;
      description.value = p.description;
      page_type.value = p.type; //!
      content.value = p.content[lang.value]
        ? p.content
        : functions.createEmptyObj(langs.value);
      published.value = p.published;

      commented.value = p.commented;
      after_login.value = p.after_login;
      menu_id.value = p.menu_id;
      page_id.value = p.page_id;
      images.value = p.images;
    }

     const delPage = async (pageId) => {
      clearMsg();
      if (window.confirm("Are you sure you wish to delete this item?")) {
        if (!startLoading()) {
          return false;
        }

        try {
          const objDeletePage = await deletePage(pageId, token);
          if (objDeletePage.data.success) {
            const ret = await refreshPages();
            if (ret) {
              msgGood.value = "Page has been deleted";
              pre_loader.value = false;
            }
          }
        } catch (error) {
          console.log("_is_error__", error);
          msgWrong.value = "Delete menu problem = " + error;
        }
      }
    }

    const positionPageUp = async  (pageId) => {
      positionPage("up", pageId);
    }
    const positionPageDown = async  (pageId) => {
      positionPage("down", pageId);
    }

    const positionPage = async  (direction, pageId)  => {
      if (!startLoading()) {
        return false;
      }

      try {
        const pos = await setPagePosition(direction, pageId, token);
        if (pos.data.success) {
          const ret = await refreshPages();
          if (ret) {
            msgGood.value = "Position page has been changed";
            pre_loader.value = false;
          }
        }
      } catch (error) {
        console.log("_is_error__", error);
        msgWrong.value = "Position page problem = " + error;
      }
    }


const refreshMenus = async () => {
  try {
    const responseM = await getMenus(token);
    menus.value = responseM.data.data;
    return true;
  } catch (error) {
    console.log("error get menu=", error);
  }
  return false;
};

const refreshPages = async () => {
  try {
    const responseP = await getPages(token);
    allPages.value = responseP.data.data;
    pagesBelongsToMenus.value = getPagesBelongsToMenus(responseP.data.data);
    pagesBelongsToPages.value = getPagesBelongsToPages(responseP.data.data);

    notRelatedPages.value = getNotRelatedPages(responseP.data.data);
    innerPages.value = getInnerPages(responseP.data.data);
    return true;
  } catch (error) {
    console.log("error get pages=", error);
  }
  return false;
};
/*
const getPagesBelongsToMenus = (pages) => {
  let out = [];
  for (let page of pages) {
    if (page.menu_id && !page.page_id) {
      if ("undefined" === typeof out[page.menu_id]) {
        out[page.menu_id] = [];
      }
      out[page.menu_id].push(page);
    }
  }
  return out;
};

const getPagesBelongsToPages = (pages) => {
  let out = [];
  for (let page of pages) {
    if (page.page_id) {
      if ("undefined" === typeof out[page.page_id]) {
        out[page.page_id] = [];
      }
      out[page.page_id].push(page);
    }
  }
  return out;
};

const getNotRelatedPages = (pages) => {
  let out = [];
  for (let page of pages) {
    if (!page.menu_id && "inner" !== page.type) {
      out.push(page);
    }
  }
  return out;
};

const getInnerPages = (pages) => {
  let out = [];
  for (let page of pages) {
    if ("inner" === page.type) {
      out.push(page);
    }
  }
  return out;
};
*/

// Other methods...

// Lifecycle hooks
onMounted( async  () => {
  if (!token) {
    useRouter().push("/");
    return false;
  }

  pre_loader.value = true;
  const refreshM = await refreshMenus();
  const refreshP =await  refreshPages();

  if (refreshM && refreshP) {
      pre_loader.value = false;
    }  

})

/*
watch: {
    new_menu_name: {
      handler: function () {
        this.clearMsg();
      },
      deep: true,
    },
    menus: {
      handler: function () {
        this.clearMsg();
      },
      deep: true,
    },
    lang: {
      handler: function () {
        this.clearMsg();
      },
    },
  }
*/
   
    watch(new_menu_name, () => {
      clearMsg();
    }, { deep: true });

   
    watch(menus, () => {
      clearMsg();
    }, { deep: true });

   
    watch(lang, () => {
      clearMsg();
    });




/*
// Watchers
watch([new_menu_name, menus, lang], () => {
  clearMsg();
});
*/

// Other watchers...

</script>
