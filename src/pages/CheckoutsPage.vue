<template>
  <div data-testid="checkouts-page">
    <div class="container">
      <div class="row mt-3 mb-3">
        <h3 class="col-10">Checkouts</h3>
        <ChangeLang :lang="lang" @exec-change-lang="changeLang"></ChangeLang>
      </div>
    </div>

    <Msg :msgGood="msgGood" :msgWrong="msgWrong"></Msg>

    <div class="container">
      <div class="row mb-4">
        <div class="col-5">
          &nbsp;
          <!--          
          <button
            role="button_add_checkout"
            @click.prevent="addCheckout"
            class="add-page-btn btn btn-primary mt-2 mb-2 mr-2"
            :disabled="pre_loader"
          >
            <i v-if="!pre_loader" class="fas fa-plus"></i>
            

            <span
              role="pre_loader_add_checkout"
              v-if="pre_loader"
              class="spinner-grow spinner-grow-sm"
            ></span>
            Add Checkout            
          </button>
          -->
        </div>

        <div class="col-7 d-flex align-items-baseline">
          <input
            type="input"
            placeholder="search: email"
            class="form-control col"
            name="search"
            v-model="searchValue"
          />

          <button
            role="button_search_checkout"
            @click.prevent="searchCheckouts"
            class="add-page-btn btn btn-primary mt-2 mb-2 mr-2"
            :disabled="pre_loader"
          >
            <i v-if="!pre_loader" class="fas fa-search"></i>
            <span
              role="pre_loader_search_checkout"
              v-if="pre_loader"
              class="spinner-grow spinner-grow-sm"
            ></span>
            <span>Search checkout</span>
          </button>
        </div>
      </div>

      <table class="table mt-2 mb-4">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Email</th>
            <th scope="col">Telephone</th>
            <th scope="col">
              Id
              <TableSort
                :sortColumn="'id'"
                @sort-asc="sortingAsc('id')"
                @sort-desc="sortingDesc('id')"
                :pre_loader="pre_loader"
                :column="column"
                :direction="direction"
              ></TableSort>
            </th>

            <th scope="col">
              Total price
              <TableSort
                :sortColumn="'price_total_add_deliver'"
                @sort-asc="sortingAsc('price_total_add_deliver')"
                @sort-desc="sortingDesc('price_total_add_deliver')"
                :pre_loader="pre_loader"
                :column="column"
                :direction="direction"
              ></TableSort>
            </th>

            <th scope="col">Basket price</th>
            <th scope="col">Deliver price</th>
            <th scope="col">Basket</th>

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
          <tr v-for="(p, index) in checkouts.data" :key="index">
            <th scope="row">{{ index + 1 }}</th>
            <td>{{ p["email"] }}</td>
            <td>{{ p["telephone"] }}</td>
            <td>{{ p["id"] }}</td>
            <td :role="'price_total_add_deliver_' + lang">
              <b>{{ p["price_total_add_deliver"] }}</b>
            </td>
            <td>{{ p["price_total"] }}</td>
            <td>{{ p["price_deliver"] }}</td>

            <td>Basket - todo</td>

            <td>{{ p["created_at"] ? p["created_at"].split("T")[0] : "" }}</td>
            <td>
              <span
                role="edit_checkout"
                class="me-1"
                :class="{ 'disabled-if-loader': pre_loader }"
                @click="editCheckout(p['id'])"
                ><i class="far fa-money-bill-alt  cursor-pointer" aria-hidden="true"></i
              ></span>
            </td>
          </tr>
        </tbody>
      </table>

      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-end">
          <li
            v-for="(link, index) in checkouts.links"
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
import { useRouter } from "vue-router";
import functions from "../helpers/functions.js";
import { getCheckouts } from "../api/apiCalls.js";
import Msg from "../components/Msg.vue";
import ChangeLang from "../components/ChangeLang.vue";
import TableSort from "../components/TableSort.vue";
import { useAuthStore } from "../state/store.js";
const { auth, setDefaultLang } = useAuthStore();

const router = useRouter();

//const { token } = functions.retrieveParamsFromStorage();

// Data
const {
  //configLangs: langs,
  configDefaultLang,
  //token,
} = functions.retrieveParamsFromStorage();

//console.log('def_lang', configDefaultLang);

const lang = ref(configDefaultLang);
const msgWrong = ref("");
const msgGood = ref("");
const pre_loader = ref(false);
const checkouts = ref([]);

//search params for:
//api/checkouts/$column/$direction?token=$token&search=abc
const column = ref("");
const direction = ref("");
const page = ref("");
const search = ref(""); //after click button
const searchValue = ref(""); // current value

const windowWidth = ref(window.innerWidth);

// const updateWindowWidth = () => {
//   windowWidth.value = window.innerWidth;
// };

// const iconClass = computed(() => {
//   return windowWidth.value < 990
//     ? "fa fa-camera-retro fa-lg"
//     : "fa fa-camera-retro fa-3x";
// });

// const addCheckout = () => {
//   router.push({ name: "checkout", params: { mode: "add" } });
// };

const editCheckout = (id) => {
  alert(id);
  //router.push({ name: "checkout", params: { mode: "edit", id: id } });
};

async function changeLang(inLang) {
  pre_loader.value = true;
  lang.value = inLang;
  setDefaultLang(inLang);

  const refreshP = await refreshCheckouts();

  if (refreshP) {
    pre_loader.value = false;
  }
}

const searchCheckouts = async () => {
  pre_loader.value = true;
  page.value = "1";
  search.value = searchValue.value;

  const refreshP = await refreshCheckouts();

  if (refreshP) {
    pre_loader.value = false;
  }
};

// const goToPage = (pageId) => {
//   router.push("/pages/" + pageId);
// };

// const delCheckout = async (id) => {
//   clearMsg();
//   if (window.confirm("Are you sure you wish to delete this item?")) {
//     pre_loader.value = true;

//     try {
//       const response = await deleteCheckout(id, auth.token);
//       if (response.data.success) {
//         const ret = await refreshCheckouts();
//         if (ret) {
//           msgGood.value = "Checkout has been deleted";
//           pre_loader.value = false;
//         }
//       }
//     } catch (error) {
//       console.log("_is_error__", error);
//       msgWrong.value = "Delete checkout problem = " + error;
//     }
//   }
// };

const changePageByUrl = async (url) => {
  pre_loader.value = true;
  page.value = functions.retrieveParamsFromUrl(url, "page");

  const refreshP = await refreshCheckouts();

  if (refreshP) {
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

  const refreshP = await refreshCheckouts();

  if (refreshP) {
    pre_loader.value = false;
  }
};

const clearMsg = () => {
  msgWrong.value = "";
  msgGood.value = "";
};

const refreshCheckouts = async () => {
  clearMsg();
  try {
    const responseP = await getCheckouts(
      lang.value,
      column.value,
      direction.value,
      auth.token,
      page.value,
      search.value,
    );
    checkouts.value = responseP.data.data;
    return true;
  } catch (error) {
    console.log("error get checkouts=", error);
  }
  return false;
};

onMounted(async () => {
  if (!auth.token) {
    router.push("/");
    return false;
  }

  pre_loader.value = true;
  //window.addEventListener("resize", updateWindowWidth);
  // set up sorting on the start
  column.value = "created_at";
  direction.value = "desc";
  page.value = "1";
  search.value = "";

  const refreshP = await refreshCheckouts();

  if (refreshP) {
    pre_loader.value = false;
  }
});
</script>
