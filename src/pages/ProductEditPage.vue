<template>
  <div data-testid="product-edit-page">
    <div class="container">
      <div class="row mt-3 mb-3">
        <h3 class="col-10" v-if="mode === 'edit'">Edit product</h3>
        <h3 class="col-10" v-else>Add product</h3>
        <ChangeLang :lang="lang" @exec-change-lang="changeLang"></ChangeLang>
      </div>
    </div>

    <Msg :msgGood="msgGood" :msgWrong="msgWrong"></Msg>

    <div class="container">
      <div class="row">
        <div class="col">
          <button
            @click.prevent="back"
            class="add-page-btn btn btn-info ml-3 mt-2 mb-2"
            :disabled="pre_loader"
          >
            Back
          </button>
        </div>
      </div>

      <div class="row pb-4 pt-4">
        <form>
          <div class="mb-3">
            <label for="product_name" class="form-label">Product Name</label>
            <input
              :role="'product_name_' + lang"
              type="text"
              v-model="product_name[lang]"
              :class="{ 'is-invalid': errFields.includes('product_name') }"
              class="form-control"
              id="product_name"
              placeholder="product name"
            />
          </div>

          <div class="mb-3">
            <label for="sku" class="form-label">Sku</label>
            <input
              type="sku"
              v-model="sku"
              class="form-control"
              :class="{ 'is-invalid': errFields.includes('sku') }"
              id="sku"
              placeholder="sku"
            />
          </div>

          <div class="mb-3">
            <label for="price" class="form-label">Price</label>
            <input
              type="price"
              v-model="price"
              class="form-control"
              :class="{ 'is-invalid': errFields.includes('price') }"
              id="price"
              placeholder="price"
            />
          </div>

          <div class="form-check mt-2 row">
            <label>
              <input
                class="col-1"
                name="published"
                type="checkbox"
                v-model="published"
                :true-value="1"
              />
              Published
            </label>
          </div>

          <div class="form-group">
            <textarea
              class="form-control textarea-rs"
              rows="20"
              cols="50"
              v-model="product_description[lang]"
              placeholder="product description"
            ></textarea>
          </div>

          <div class="form-group mt-3">
            <label for="page" class="text-secondary">Page:</label>
            <select
              role="page_items"
              class="rs-select form-control"
              v-model="page_id"
            >
              <option value=""></option>
              <option v-for="page in shopPages" :key="page.id" :value="page.id">
                {{ page.short_title[lang] }}
              </option>
            </select>
          </div>

          <button
            role="button_save_edit_product"
            @click.prevent="addEditProduct"
            class="add-page-btn btn btn-primary mt-2 mb-2 mr-2"
            :disabled="pre_loader"
          >
            <i v-if="!pre_loader" class="fas fa-plus"></i>
            <span
              role="pre_loader_add_edit_product"
              v-if="pre_loader"
              class="spinner-grow spinner-grow-sm"
            ></span>
            <span v-if="mode === 'edit'">Edit product</span>
            <span v-else>Add product</span>
          </button>
        </form>
      </div>
    </div>
    <!--  container -->
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import functions from "../helpers/functions.js";
import {
  getProduct,
  postProduct,
  putProduct,
  getPagesByType,
} from "../api/apiCalls.js";
import Msg from "../components/Msg.vue";
import ChangeLang from "../components/ChangeLang.vue";
import trans from "../helpers/trans.js";
import { useAuthStore } from "../state/store.js";
const { auth, setDefaultLang } = useAuthStore();

const { configLangs: langs, configDefaultLang } =
  functions.retrieveParamsFromStorage();

const lang = ref(configDefaultLang);

const router = useRouter();
const mode = router.currentRoute.value.params.mode;

const msgWrong = ref("");
const msgGood = ref("");
const errFields = ref([]);

const pre_loader = ref(false);
const shopPages = ref([]);

//form data - start
const currentId = ref("");
const product_name = ref(functions.createEmptyObj(langs));
const sku = ref("");
const price = ref("");
const published = ref(false);
const product_description = ref(functions.createEmptyObj(langs));
const page_id = ref("");
const images = ref([]);
//form data - stop

async function changeLang(inLang) {
  lang.value = inLang;
  setDefaultLang(inLang);
}

const back = () => {
  router.push({ name: "products" });
};

const clearMsg = () => {
  msgWrong.value = "";
  msgGood.value = "";
  errFields.value = [];
};

const addEditProduct = async () => {
  clearMsg();
  pre_loader.value = true;
  try {
    const product = {
      id: currentId.value,
      product_name: product_name.value,
      sku: sku.value,
      price: price.value,
      published: published.value,
      product_description: product_description.value,
      page_id: page_id.value,
      images: images.value,
    };

    const retProduct = product.id //product.value.id
      ? await putProduct(product, auth.token)
      : await postProduct(product, auth.token);
    if (retProduct.data.success) {
      msgGood.value = product.id
        ? trans.ttt("success_product_edit")
        : trans.ttt("success_product_add");
    } else if (retProduct.data.success === false) {
      msgWrong.value = await functions.parseError(retProduct.data.error);
      errFields.value = await functions.getErrorFields(retProduct.data.error);
    } else {
      msgWrong.value =
        "Something wrong with add or edit product - check response status";
    }
  } catch (error) {
    console.log("_is_error__", error);
  }
  pre_loader.value = false;
};

const loadProduct = async (id) => {
  try {
    const response = await getProduct(id, auth.token);
    if (response.data.success) {
      const productData = response.data.data;
      currentId.value = productData.id;
      product_name.value = productData.product_name; //[lang.value];
      sku.value = productData.sku;
      price.value = productData.price;
      published.value = productData.published;
      product_description.value = productData.product_description; //[lang.value];
      page_id.value = productData.page_id;
      images.value = productData.images;

      return true;
    } else {
      msgWrong.value = "Sth wrong with get product";
      console.log("error get product=", response.data);
    }
  } catch (error) {
    msgWrong.value = "Sth wrong with get product (error)";
    console.log("error get product=", error);
  }
  return false;
};

const getShopPages = async () => {
  try {
    const response = await getPagesByType("shop", auth.token);
    if (response.data.success) {
      shopPages.value = response.data.data;
      return true;
    } else {
      msgWrong.value = "Sth wrong with get pages by type";
      console.log("error get pages by type=", response.data);
    }
  } catch (error) {
    msgWrong.value = "Sth wrong with get pages by type (error)";
    console.log("error get pages by type=", error);
  }
  return false;
};

onMounted(async () => {
  if (!auth.token) {
    router.push("/");
    return false;
  }

  if (mode !== "edit" && mode !== "add") {
    router.push("/"); //TODO test manually
  }

  clearMsg();
  pre_loader.value = true;
  await getShopPages();

  if (mode === "edit") {
    const id = router.currentRoute.value.params.id;
    const loadC = await loadProduct(id);

    if (loadC) {
      pre_loader.value = false;
    }
  } else {
    pre_loader.value = false;
  }
});
</script>