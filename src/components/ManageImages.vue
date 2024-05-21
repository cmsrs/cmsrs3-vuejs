<template>
  <div class="row mt-3">
    <div class="col-5">
      <label
        class="custom-file-upload mt-3 mb-3"
        :style="{
          opacity: internalPreLoader || !currentPageId ? '0.6' : '1',
        }"
      >
        <input
          role="upload_images"
          class="upload-img"
          type="file"
          name="images"
          @change="handleUploadFile"
          multiple
          :disabled="internalPreLoader || !currentPageId"
        />
        <span
          role="internalPreLoader_upload_images"
          v-if="internalPreLoader"
          class="spinner-grow spinner-grow-sm"
        ></span>
        <i v-if="!internalPreLoader" class="fas fa-plus"></i>Upload Images
      </label>
    </div>

    <div class="col-5">&nbsp;</div>

    <div class="col-1">
      <div
        role="delete_many_images"
        class="trash mt-3"
        :class="{ 'disabled-if-loader': internalPreLoader }"
        :style="{
          opacity: internalPreLoader || !currentPageId ? '0.6' : '1',
        }"
        :disabled="internalPreLoader || !currentPageId"
        @click="deleteImages"
      >
        <i class="fas fa-trash cursor-pointer" aria-hidden="true"></i>
      </div>
    </div>

    <div class="col-1">
      <input
        role="selected_all_items"
        class="form-check-input mt-4"
        type="checkbox"
        v-model="selectedAllItems"
        :true-value="true"
        @click="selectAllItems()"
      />
    </div>
  </div>

  <div
    class="row mt-2"
    v-for="(image, index) in internalImages"
    :key="image.id"
  >
    <img
      class="col-2"
      :src="SERVER_URL + image['fs']['small']"
      :alt="image['alt'][lang]"
    />

    <div class="form-group col-4">
      <input
        class="form-control"
        v-model="internalImages[index]['alt'][lang]"
      />
    </div>

    <div
      role="del_image"
      class="trash col-1"
      :class="{ 'disabled-if-loader': internalPreLoader }"
      @click="delImage(image.id)"
    >
      <i class="fas fa-trash cursor-pointer" aria-hidden="true"></i>
    </div>

    <div
      role="down_image"
      :class="{ 'disabled-if-loader': internalPreLoader }"
      class="col-1"
      @click="positionImage('down', image.id)"
    >
      <i class="fas fa-arrow-down cursor-pointer" aria-hidden="true"></i>
    </div>

    <div
      role="up_image"
      :class="{ 'disabled-if-loader': internalPreLoader }"
      class="col-1"
      @click="positionImage('up', image.id)"
    >
      <i class="fas fa-arrow-up cursor-pointer" aria-hidden="true"></i>
    </div>

    <div class="form-group col-2">
      <input class="form-control" v-model="internalImages[index]['position']" />
    </div>

    <div class="col-1">
      <input
        class="form-check-input"
        role="check_image"
        type="checkbox"
        v-model="selectedItems[image.id]"
        @change="selectItem(image.id, $event.target.checked)"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { SERVER_URL } from "../config.js";
import imgs from "../helpers/imgs.js";
import jsonStoreTest from "../../test/jsonStore.js";
import functions from "../helpers/functions.js";
import trans from "../helpers/trans.js";
import {
  uploadImage,
  getImages,
  deleteImage,
  setImagePosition,
} from "../api/apiCalls";
import { useAuthStore } from "../state/store.js";
const { auth } = useAuthStore();

const selectedItems = ref({});
const selectedAllItems = ref(false);

const props = defineProps({
  startLoading: Function,
  lang: String,
  currentPageId: [Number, Boolean],
  clearMsg: Function,
});

const internalImages = defineModel("internalImages");
const internalMsgWrong = defineModel("internalMsgWrong");
const internalMsgGood = defineModel("internalMsgGood");
const internalPreLoader = defineModel("internalPreLoader");

async function handleUploadFile(event) {
  if (internalPreLoader.value) {
    return false;
  }

  const files = event.target.files || event.dataTransfer.files;
  if (!files.length) {
    return false;
  }

  if (!props.currentPageId) {
    return false;
  }

  if (!props.startLoading()) {
    return false;
  }

  const newImages = await imgs.getImagesUpload(files);

  for (let i = 0; i < newImages.length; i++) {
    let ret = uploadImage(
      newImages[i],
      "page",
      props.currentPageId,
      auth.token,
    );

    if (auth.token !== jsonStoreTest.getTestToken()) {
      //console.log(jsonStoreTest.getTestToken()+'----------'+ auth.token );
      await functions.delay(6000); //in test we not execute this line//test token = 'abcde12345'
    }

    if (ret) {
      internalMsgGood.value =
        "Images has been uploaded " + (i + 1) + "/" + newImages.length;
    }
  }

  const dbImages = await getImagesByCurrentId();
  if (dbImages.data.success) {
    internalImages.value = dbImages.data.data;
    internalMsgGood.value = "Images has been uploaded";
    internalPreLoader.value = false;
  }
}

const delImage = async (id) => {
  if (!props.currentPageId) {
    console.log("cant find page_id");
    return false;
  }

  if (window.confirm("Are you sure you wish to delete this item?")) {
    if (!props.startLoading()) {
      return false;
    }

    await delImagesWrap(id, false);
  }
};

const delImagesWrap = async (id, isMany) => {
  try {
    const objDeleteImage = await deleteImage(id, auth.token);
    if (objDeleteImage.data.success) {
      const dbImages = await getImagesByCurrentId();
      if (dbImages.data.success) {
        internalImages.value = dbImages.data.data;
        internalMsgGood.value = isMany
          ? trans.ttt("success_images_delete")
          : trans.ttt("success_image_delete"); //  "Image has been deleted";
        internalPreLoader.value = false;
      }
    }
    return true;
  } catch (error) {
    console.log("_is_error_del_image_", error);
    internalMsgWrong.value = "Delete menu problem = " + error;
    return false;
  }
};

const positionImage = async (direction, imageId) => {
  if (!props.currentPageId) {
    console.log("cant find page_id");
    return false;
  }

  if (!props.startLoading()) {
    return false;
  }
  try {
    const pos = await setImagePosition(direction, imageId, auth.token);

    if (pos.data.success) {
      const dbImages = await getImagesByCurrentId();
      if (dbImages.data.success) {
        internalImages.value = dbImages.data.data;
        internalMsgGood.value = trans.ttt("success_image_position"); //"Position image has been changed";
        internalPreLoader.value = false;
      }
    }else{    
      internalPreLoader.value = false;
      return false; //When one image occurs, we can't change its position.
    }
  } catch (error) {
    console.log("_is_error_pos_image_", error);
    internalMsgWrong.value = "Position image problem = " + error;
  }
};

const getImagesByCurrentId = async () => {
  const dbImages = await getImages("page", props.currentPageId, auth.token);
  await resetSelectedItems();
  return dbImages;
};

const selectItem = (imageId, isCheck) => {
  props.clearMsg();
  selectedItems.value[imageId] = isCheck;
};

const selectAllItems = () => {
  selectedAllItems.value = !selectedAllItems.value;

  internalImages.value.forEach((image) => {
    selectedItems.value[image.id] = selectedAllItems.value;
  });
};

const deleteImages = async () => {
  let items = [];
  for (const imageId in selectedItems.value) {
    if (selectedItems.value[imageId] === true) {
      items.push(imageId);
    }
  }

  if (!items.length) {
    internalMsgWrong.value = trans.ttt("fail_delete_images_no_items");
    return false;
  }

  if (window.confirm("Are you sure you wish to delete these items?")) {
    if (!props.startLoading()) {
      return false;
    }

    let ids = items.join(",");
    const ret = await delImagesWrap(ids, true);
    if (ret) {
      selectedItems.value = {};
    }
  }
};

/**
 * We use this function in the parent component too.
 */
const resetSelectedItems = async () => {
  selectedAllItems.value = false;

  if (!props.currentPageId) {
    return false;
  }

  if (!internalImages.value || !internalImages.value.length) {
    return false;
  }

  internalImages.value.forEach((image) => {
    selectedItems.value[image.id] = false;
  });
};

defineExpose({
  resetSelectedItems,
});
</script>