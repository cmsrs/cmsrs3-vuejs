<template>
  <div data-testid="products-page">
    <h3>Products</h3>

    <Msg :msgGood="msgGood" :msgWrong="msgWrong"></Msg>

    <div class="container">
      <div class="row">
        <div class="col-5">
          <button
            role="button_add_product"
            @click.prevent="addProduct"
            class="add-page-btn btn btn-primary mt-2 mb-2 mr-2"
            :disabled="pre_loader"
          >
            <i v-if="!pre_loader" class="fas fa-plus"></i>

            <span
              role="pre_loader_add_product"
              v-if="pre_loader"
              class="spinner-grow spinner-grow-sm"
            ></span>
            Add Product
          </button>
        </div>

        <div class="col-7 d-flex align-items-baseline">
          <input
            type="input"
            class="form-control col"
            name="search"
            v-model="searchValue"
          />

          <button
            role="button_search_product"
            @click.prevent="searchProducts"
            class="add-page-btn btn btn-primary mt-2 mb-2 mr-2"
            :disabled="pre_loader"
          >
            <i v-if="!pre_loader" class="fas fa-search"></i>
            <span
              role="pre_loader_search_product"
              v-if="pre_loader"
              class="spinner-grow spinner-grow-sm"
            ></span>
            <span>Search product</span>
          </button>
        </div>
      </div>

      <table class="table mt-2 mb-4">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Image</th>

            <th scope="col">
              Page
              <TableSort
                :sortColumn="'page_short_title'"
                @sort-asc="sortingAsc('page_short_title')"
                @sort-desc="sortingDesc('page_short_title')"
                :pre_loader="pre_loader"
                :column="column"
                :direction="direction"
              ></TableSort>
            </th>

            <th scope="col">
              Product name
              <TableSort
                :sortColumn="'product_name'"
                @sort-asc="sortingAsc('product_name')"
                @sort-desc="sortingDesc('product_name')"
                :pre_loader="pre_loader"
                :column="column"
                :direction="direction"
              ></TableSort>
            </th>

            <th scope="col">
              Sku
              <TableSort
                :sortColumn="'sku'"
                @sort-asc="sortingAsc('sku')"
                @sort-desc="sortingDesc('sku')"
                :pre_loader="pre_loader"
                :column="column"
                :direction="direction"
              ></TableSort>
            </th>

            <th scope="col">
              Price
              <TableSort
                :sortColumn="'price'"
                @sort-asc="sortingAsc('price')"
                @sort-desc="sortingDesc('price')"
                :pre_loader="pre_loader"
                :column="column"
                :direction="direction"
              ></TableSort>
            </th>

            <th scope="col">
              Pub
              <TableSort
                :sortColumn="'published'"
                @sort-asc="sortingAsc('published')"
                @sort-desc="sortingDesc('published')"
                :pre_loader="pre_loader"
                :column="column"
                :direction="direction"
              ></TableSort>
            </th>

            <th scope="col">
              Created
              <TableSort
                :sortColumn="'created_at'"
                @sort-asc="sortingAsc('created_at')"
                @sort-desc="sortingDesc('created_at')"
                :pre_loader="pre_loader"
                :column="column"
                :direction="direction"
              ></TableSort>
            </th>            
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, index) in products.data" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td>
              <img
                style="width: 40%"
                :src="SERVER_URL + p.images[0]['fs']['small']"
                :alt="p.images[0]['alt'][lang]"
              />                      
            </td>          
            <td>
              <span  @click="goToPage(p['page_id'])" class="cursor-pointer text-primary">
                {{ p["page_short_title"] }}
              </span>
            </td>
            <td>{{ p["product_name"] }}</td>
            <td>{{ p["sku"] }}</td>
            <td>{{ p["price"] }}</td>            
            <td>
              <i v-if="p['published']"  class="fa fa-check" aria-hidden="true"></i>
              <i v-if="!p['published']" class="fa fa-times" aria-hidden="true"></i>
            </td>            
            <td>{{ p["created_at"] ? p["created_at"].split("T")[0] : "" }}</td>
            <td>
              <span
                role="edit_product"
                class="me-1"
                :class="{ 'disabled-if-loader': pre_loader }"
                @click="editProduct(p['id'])"
                ><i class="far fa-edit cursor-pointer"></i
              ></span>
              <span
                role="del_product"
                class="ms-1"
                :class="{ 'disabled-if-loader': pre_loader }"
                @click="delProduct(p['id'])"
                ><i class="fas fa-trash cursor-pointer"></i
              ></span>
            </td>
          </tr>
        </tbody>
      </table>

      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-end">
          <li
            v-for="(link, index) in products.links"
            :key="index"
            class="page-item"
            :class="{
              disabled: !link['url'] || pre_loader,
              active: link['active'],
            }"
          >
            <a
              role="pagination_links"
              class="page-link"
              @click="link['url'] && changePageByUrl(link['url'])"
              v-html="link.label"
            ></a>
          </li>
        </ul>
      </nav>
    </div>
    <!--  container -->
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { SERVER_URL } from "../config.js";
import { useRouter } from "vue-router";
import functions from "../helpers/functions.js";
import { getProducts, deleteProduct } from "../api/apiCalls.js";
import Msg from "../components/Msg.vue";
import TableSort from "../components/TableSort.vue";

const router = useRouter();

//const { token } = functions.retrieveParamsFromStorage();

// Data
const {
  configLangs: langs,
  configDefaultLang,
  token,
} = functions.retrieveParamsFromStorage();

const lang = ref(configDefaultLang);
const msgWrong = ref("");
const msgGood = ref("");
const pre_loader = ref(false);
const products = ref([]);

//search params for:
//api/products/$column/$direction?token=$token&search=abc
const column = ref("");
const direction = ref("");
const page = ref("");
const search = ref(""); //after click button
const searchValue = ref(""); // current value

const addProduct = () => {
  router.push({ name: "product", params: { mode: "add" } });
};

const editProduct = (id) => {
  router.push({ name: "product", params: { mode: "edit", id: id } });
};

const searchProducts = async () => {
  pre_loader.value = true;
  search.value = searchValue.value;

  const refreshC = await refreshProducts();

  if (refreshC) {
    pre_loader.value = false;
  }
};

const goToPage = (pageId) => {
  router.push("/pages/"+pageId);
};

const delProduct = async (id) => {
  clearMsg();
  if (window.confirm("Are you sure you wish to delete this item?")) {
    pre_loader.value = true;

    try {
      const response = await deleteProduct(id, token);
      if (response.data.success) {
        const ret = await refreshProducts();
        if (ret) {
          msgGood.value = "Product has been deleted";
          pre_loader.value = false;
        }
      }
    } catch (error) {
      console.log("_is_error__", error);
      msgWrong.value = "Delete product problem = " + error;
    }
  }
};

const changePageByUrl = async (url) => {
  pre_loader.value = true;
  page.value = functions.retrieveParamsFromUrl(url, "page");

  const refreshC = await refreshProducts();

  if (refreshC) {
    pre_loader.value = false;
  }
};

const sortingAsc = async (column) => {
  sorting(column, "asc");
};

const sortingDesc = async (column) => {
  sorting(column, "desc");
};

const sorting = async (col, dir) => {
  pre_loader.value = true;
  column.value = col;
  direction.value = dir;
  page.value = "1";

  const refreshC = await refreshProducts();

  if (refreshC) {
    pre_loader.value = false;
  }
};

const clearMsg = () => {
  msgWrong.value = "";
  msgGood.value = "";
};

const refreshProducts = async () => {
  clearMsg();
  try {
    const responseC = await getProducts(
      lang.value,
      column.value,
      direction.value,
      token,
      page.value,
      search.value,
    );
    products.value = responseC.data.data;
    return true;
  } catch (error) {
    console.log("error get products=", error);
  }
  return false;
};

onMounted(async () => {
  if (!token) {
    router.push("/");
    return false;
  }

  pre_loader.value = true;

  // set up sorting on the start
  column.value = "created_at";
  direction.value = "desc";
  page.value = "1";
  search.value = "";

  const refreshC = await refreshProducts();

  if (refreshC) {
    pre_loader.value = false;
  }
});
</script>
