<template>
  <div data-testid="user-edit-page">
    <h3>Settings</h3>

    <Msg :msgGood="msgGood" :msgWrong="msgWrong"></Msg>

    <div class="container">
        <form>

          <div if="config.is_cache_enable" class="form-check mt-2 row">
            <label>
              <input
                class="col-1"
                type="checkbox"
                v-model="toggleCacheEnable"
                :true-value="1"
              />
              {{ trans.ttt("toggle_cache_enable") }}    
            </label>
          </div>

          <div if="config.is_cache_enable" class="form-check mt-2 row">
            <label>
              <input
                class="col-1"
                type="checkbox"
                v-model="clearCache"
                :true-value="1"
              />
              {{  trans.ttt("clear_cache") }}    
            </label>
          </div>


          <div class="form-check mt-2 row">
            <label>
              <input
                class="col-1"
                type="checkbox"
                v-model="createSitemap"
                :true-value="1"
              />
              {{  trans.ttt("create_sitemap") }}    
            </label>
          </div>
          


        </form>
    </div><!--  container -->
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
//import { useRouter } from "vue-router";
import functions from "../helpers/functions.js";
//import { checkCache } from "../api/apiCalls";
import Msg from "../components/Msg.vue";
import trans from "../helpers/trans.js";
import { useAuthStore } from "../state/store.js";
const { auth, config } = useAuthStore();

//const {
//  cacheEnable
//} = functions.retrieveParamsFromStorage();


const msgWrong = ref("");
const msgGood = ref("");

const toggleCacheEnable = ref(false);
const clearCache = ref(false);
const createSitemap = ref(false);

const pre_loader = ref(false);

const clearMsg = () => {
  msgWrong.value = "";
  msgGood.value = "";
};

// cache_enable and file_exist
/*
const getStatusCache = async () => {
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
*/

onMounted(async () => {
  if (!auth.token) {
    router.push("/");
    return false;
  }
  
  clearMsg();

  


});
</script>
