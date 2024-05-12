<template>
  <div data-testid="product-edit-page">
    <h3 v-if="mode === 'edit'">Edit product</h3>
    <h3 v-else>Add product</h3>

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
            <label for="email" class="form-label">Email address</label>
            <input
              type="email"
              v-model="product.email"
              class="form-control"
              :class="{ 'is-invalid': errFields.includes('email') }"
              id="email"
              aria-describedby="emailHelp"
              placeholder="email"
              :disabled="mode === 'edit'"
            />
            <!-- <div id="emailHelp" class="form-text">We'll never share your email with anyone else.</div> -->
          </div>

          <div class="mb-3">
            <label for="name" class="form-label">Name</label>
            <input
              type="text"
              v-model="product.name"
              class="form-control"
              :class="{ 'is-invalid': errFields.includes('name') }"
              id="name"
              placeholder="name"
            />
          </div>

          <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
              type="password"
              v-model="product.password"
              class="form-control"
              :class="{ 'is-invalid': errFields.includes('password') }"
              id="password"
              placeholder="password"
            />
          </div>

          <div class="mb-3">
            <label for="password_confirmation" class="form-label"
              >Password confirmation</label
            >
            <input
              type="password"
              v-model="product.password_confirmation"
              class="form-control"
              :class="{ 'is-invalid': errFields.includes('password') }"
              id="password_confirmation"
              placeholder="password confirmation"
            />
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
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import functions from "../helpers/functions.js";
import { getProduct, postProduct, putProduct } from "../api/apiCalls.js";
import Msg from "../components/Msg.vue";
import trans from "../helpers/trans.js";

const router = useRouter();

const { token } = functions.retrieveParamsFromStorage();
const mode = router.currentRoute.value.params.mode;

const msgWrong = ref("");
const msgGood = ref("");
const errFields = ref([]);

const pre_loader = ref(false);
let product = reactive({});

const back = () => {
  router.push({ name: "products" });
};

const clearMsg = () => {
  msgWrong.value = "";
  msgGood.value = "";
};

const getEmptyProduct = () => {
  return {
    id: "",
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  };
};

const addEditProduct = async () => {
  clearMsg();
  pre_loader.value = true;
  try {
    const retProduct = product.id //product.value.id
      ? await putProduct(product, token)
      : await postProduct(product, token);
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
    const responseC = await getProduct(id, token);
    if (responseC.data.success) {
      const productData = responseC.data.data;
      product.id = productData.id;
      product.name = productData.name;
      product.email = productData.email;
      return true;
    } else {
      msgWrong.value = "Sth wrong with get product";
      console.log("error get product=", responseC.data);
    }
  } catch (error) {
    msgWrong.value = "Sth wrong with get product (error)";
    console.log("error get product=", error);
  }
  return false;
};

onMounted(async () => {
  if (!token) {
    router.push("/");
    return false;
  }

  if (mode !== "edit" && mode !== "add") {
    router.push("/"); //TODO test manually
  }

  clearMsg();
  product = getEmptyProduct();

  if (mode === "edit") {
    const id = router.currentRoute.value.params.id;
    pre_loader.value = true;
    const loadC = await loadProduct(id);

    if (loadC) {
      pre_loader.value = false;
    }
  }
});
</script>
