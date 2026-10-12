<template>
  <div class="mb-3" data-testid="tags-page">
    <!-- Header -->
    <div class="container">
      <div class="row mt-3 mb-3">
        <h3 class="col-10">CMS - tags and categories</h3>
        <ChangeLang :lang="lang" @exec-change-lang="changeLang" />
      </div>
    </div>

    <Msg :msgGood="msgGood" :msgWrong="msgWrong" />

    <div class="container">
      <div class="row">
        <!-- LEFT COLUMN: Categories and tags -->
        <div class="col-6">
          <h5 class="mt-2">Categories and tags</h5>

          <button
            role="button_add_tag_category"
            class="btn btn-primary mt-2 mb-2"
            :disabled="pre_loader"
            @click.prevent="addCategory"
          >
            <i class="fas fa-plus"></i>
            Add category
          </button>

          <!-- Existing categories -->
          <div
            v-for="category in categories"
            :key="category.id"
            class="container mt-3 tag-category"
            :data-category-id="category.id"
          >
            <div class="row align-items-start">
              <!-- Category name -->
              <div class="form-group col-6">
                <input
                  class="form-control"
                  :class="{
                    'is-invalid': categoryErrors[category.id]?.includes('name'),
                  }"
                  :disabled="pre_loader"
                  :value="category.name?.[lang] ?? ''"
                  :placeholder="`Category name ${lang}`"
                  @input="
                    updateCategoryName(category.id, lang, $event.target.value)
                  "
                />
              </div>

              <!-- Entity type -->
              <div class="form-group col-4">
                <select
                  class="form-control"
                  :class="{
                    'is-invalid':
                      categoryErrors[category.id]?.includes('entity_type'),
                  }"
                  :disabled="pre_loader"
                  v-model="category.entity_type"
                >
                  <option value="">Select type</option>

                  <option
                    v-for="entityType in tagEntityTypes"
                    :key="entityType"
                    :value="entityType"
                  >
                    {{ entityType }}
                  </option>
                </select>
              </div>

              <!-- Save category -->
              <div class="col-1">
                <i
                  class="far fa-save cursor-pointer"
                  :class="{ 'disabled-if-loader': pre_loader }"
                  title="Save category"
                  role="button_save_tag_category"
                  @click="saveCategory(category)"
                ></i>
              </div>

              <!-- Delete category -->
              <div class="col-1 trash">
                <i
                  class="fas fa-trash cursor-pointer"
                  :class="{ 'disabled-if-loader': pre_loader }"
                  title="Delete category"
                  role="button_delete_tag_category"
                  @click="deleteCategory(category)"
                ></i>
              </div>
            </div>

            <!-- Tags assigned to this category -->
            <div class="ms-3 mt-2 mb-3">
              <div
                v-for="tag in getTagsByCategory(category.id)"
                :key="tag.id"
                class="row align-items-center mb-2 tag-item"
                :class="{
                  'selected-tag': currentTagId === tag.id,
                }"
                role="tag_item"
                @click="editTag(tag)"
              >
                <div class="col-10">
                  <span>{{ tag.name?.[lang] || "(empty)" }}</span>
                </div>

                <div class="col-2 text-end">
                  <i
                    class="far fa-edit cursor-pointer"
                    title="Edit tag"
                    @click.stop="editTag(tag)"
                  ></i>
                </div>
              </div>

              <div
                v-if="getTagsByCategory(category.id).length === 0"
                class="text-secondary small mb-2"
              >
                No tags in this category
              </div>
            </div>
          </div>

          <!-- New category form -->
          <div v-if="isAddCategory" class="container mt-3">
            <h6>New category</h6>

            <div class="row align-items-start">
              <div class="form-group col-6">
                <input
                  class="form-control"
                  :class="{ 'is-invalid': newCategoryError }"
                  v-model="newCategory.name[lang]"
                  :placeholder="`Category name ${lang}`"
                  :disabled="pre_loader"
                />
              </div>

              <div class="form-group col-4">
                <select
                  class="form-control"
                  v-model="newCategory.entity_type"
                  :disabled="pre_loader"
                >
                  <option value="">Select type</option>

                  <option
                    v-for="entityType in tagEntityTypes"
                    :key="entityType"
                    :value="entityType"
                  >
                    {{ entityType }}
                  </option>
                </select>
              </div>

              <div class="col-1">
                <i
                  class="far fa-save cursor-pointer"
                  :class="{ 'disabled-if-loader': pre_loader }"
                  title="Save category"
                  @click="saveCategory('new')"
                ></i>
              </div>

              <div class="col-1 trash">
                <i
                  class="fas fa-trash cursor-pointer"
                  :class="{ 'disabled-if-loader': pre_loader }"
                  title="Cancel"
                  @click="cancelAddCategory"
                ></i>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Tag form -->
        <div class="col-6">
          <h5 class="mt-2">Tag</h5>

          <button
            role="button_add_tag"
            class="btn btn-primary mt-2 mb-2 me-2"
            :disabled="pre_loader"
            @click.prevent="clearTagData"
          >
            <i class="fas fa-plus"></i>
            Add tag
          </button>

          <button
            role="button_clear_tag"
            class="btn btn-info mt-2 mb-2"
            :disabled="pre_loader"
            @click.prevent="clearTagData"
          >
            Clear data
          </button>

          <form @submit.prevent="saveTag">
            <!-- Tag name -->
            <div class="form-group mt-3">
              <label for="tagName" class="text-secondary"> Name: </label>

              <input
                id="tagName"
                class="form-control"
                :class="{
                  'is-invalid': tagErrors.includes('name'),
                }"
                v-model="tagName[lang]"
                :placeholder="`Tag name ${lang}`"
                :disabled="pre_loader"
              />
            </div>

            <!-- Category -->
            <div class="form-group mt-3">
              <label for="tagCategory" class="text-secondary">
                Category:
              </label>

              <select
                id="tagCategory"
                class="form-control"
                :class="{
                  'is-invalid': tagErrors.includes('tag_category_id'),
                }"
                v-model="tagCategoryId"
                :disabled="pre_loader"
              >
                <option value="">Select category</option>

                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name?.[lang] || "(empty)" }}
                </option>
              </select>
            </div>

            <!-- Save tag -->
            <button
              role="button_save_tag"
              type="submit"
              class="btn btn-primary mt-3 me-2"
              :disabled="pre_loader"
            >
              <i
                v-if="!pre_loader"
                :class="currentTagId ? 'far fa-save' : 'fas fa-plus'"
              ></i>

              <span
                v-if="pre_loader"
                class="spinner-grow spinner-grow-sm"
              ></span>

              {{ currentTagId ? "Save tag" : "Add tag" }}
            </button>

            <!-- Delete tag -->
            <button
              v-if="currentTagId"
              role="button_delete_tag"
              type="button"
              class="btn btn-danger mt-3"
              :disabled="pre_loader"
              @click.prevent="deleteTag"
            >
              <i class="fas fa-trash"></i>
              Delete tag
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";

import functions from "../helpers/functions.js";
import trans from "../helpers/trans.js";
import { handleError } from "../helpers/common.js";

import {
  postTagCategory,
  getTagCategories,
  putTagCategory,
  deleteTagCategory,
  postTag,
  getTags,
  putTag,
  deleteTag as deleteTagRequest,
} from "../api/apiCalls.js";

import Msg from "../components/Msg.vue";
import ChangeLang from "../components/ChangeLang.vue";

import { useAuthStore } from "../state/store.js";

const { auth, config, setDefaultLang } = useAuthStore();

const {
  configLangs: langs,
  configDefaultLang,
  token,
} = functions.retrieveParamsFromStorage();

// State
const lang = ref(configDefaultLang);

const msgWrong = ref("");
const msgGood = ref("");
const pre_loader = ref(false);

const categories = ref([]);
const tags = ref([]);

const isAddCategory = ref(false);
const newCategoryError = ref(false);

const newCategory = ref({
  name: {},
  entity_type: "",
});

const tagName = ref({});
const tagCategoryId = ref("");
const currentTagId = ref(false);

const tagErrors = ref([]);
const categoryErrors = ref({});

// Entity types from the application configuration.
// Example: ["page", "product"]
const tagEntityTypes = computed(() => {
  const types = config.tag_entity_types;

  return Array.isArray(types) ? types : [];
});

// Tags which do not belong to any existing category.
const unassignedTags = computed(() => {
  return tags.value.filter((tag) => {
    return !categories.value.some(
      (category) => Number(category.id) === Number(tag.tag_category_id),
    );
  });
});

// --------------------------------------------------
// Common helpers
// --------------------------------------------------

function clearMsg() {
  msgWrong.value = "";
  msgGood.value = "";
  tagErrors.value = [];
  categoryErrors.value = {};
  newCategoryError.value = false;
}

const startLoading = () => {
  clearMsg();

  if (pre_loader.value) {
    return false;
  }

  pre_loader.value = true;
  return true;
};

function finishLoading() {
  pre_loader.value = false;
}

function getTagsByCategory(categoryId) {
  return tags.value.filter(
    (tag) => Number(tag.tag_category_id) === Number(categoryId),
  );
}

function emptyTranslations() {
  return functions.createEmptyObj(langs);
}

function getApiErrorMessage(error) {
  const apiError = error?.response?.data?.error;

  if (apiError) {
    return functions.parseError(apiError);
  }

  return error?.message || "Something went wrong";
}

// --------------------------------------------------
// Language
// --------------------------------------------------

function changeLang(inLang) {
  lang.value = inLang;
  setDefaultLang(inLang);
}

watch(lang, () => {
  clearMsg();
});

// --------------------------------------------------
// Refresh data
// --------------------------------------------------

async function refreshCategories() {
  const response = await getTagCategories(token);

  if (response.data.success) {
    categories.value = response.data.data || [];
    return true;
  }

  throw new Error("Could not load tag categories");
}

async function refreshTags() {
  const response = await getTags(token);

  if (response.data.success) {
    tags.value = response.data.data || [];
    return true;
  }

  throw new Error("Could not load tags");
}

async function refreshData() {
  try {
    await Promise.all([refreshCategories(), refreshTags()]);

    return true;
  } catch (error) {
    msgWrong.value = await getApiErrorMessage(error);
    return false;
  }
}

// --------------------------------------------------
// Categories
// --------------------------------------------------

function addCategory() {
  clearMsg();

  isAddCategory.value = true;

  newCategory.value = {
    name: emptyTranslations(),
    entity_type: tagEntityTypes.value[0] || "",
  };
}

function cancelAddCategory() {
  isAddCategory.value = false;
  newCategoryError.value = false;
}

function updateCategoryName(categoryId, selectedLang, value) {
  const category = categories.value.find(
    (item) => Number(item.id) === Number(categoryId),
  );

  if (!category) {
    return;
  }

  if (!category.name) {
    category.name = emptyTranslations();
  }

  category.name[selectedLang] = value;
}

function validateCategory(category) {
  const errors = [];

  for (const currentLang of langs) {
    if (!category.name?.[currentLang]?.trim()) {
      msgWrong.value = "Add category name" + cmsLangPrefix(currentLang);

      errors.push("name");
      break;
    }
  }

  if (!category.entity_type) {
    msgWrong.value = "Select category entity type";
    errors.push("entity_type");
  }

  return errors;
}

function cmsLangPrefix(currentLang) {
  return ` (${currentLang})`;
}

async function saveCategory(categoryOrNew) {
  clearMsg();

  const isNew = categoryOrNew === "new";

  const category = isNew ? newCategory.value : categoryOrNew;

  const errors = validateCategory(category);

  if (isNew) {
    newCategoryError.value = errors.includes("name");
  } else {
    categoryErrors.value[category.id] = errors;
  }

  if (errors.length) {
    return false;
  }

  if (!startLoading()) {
    return false;
  }

  try {
    const post = {
      name: { ...category.name },
      entity_type: category.entity_type,
    };

    const response = isNew
      ? await postTagCategory(post, token)
      : await putTagCategory(post, category.id, token);

    if (response.data.success) {
      await refreshCategories();

      isAddCategory.value = false;

      msgGood.value = isNew
        ? "Category has been added"
        : "Category has been changed";
    } else {
      msgWrong.value = await functions.parseError(response.data.error);
    }
  } catch (error) {
    handleError(error, config.demo_status, msgWrong, pre_loader);
  } finally {
    finishLoading();
  }
}

async function deleteCategory(category) {
  clearMsg();

  const assignedTags = getTagsByCategory(category.id);

  if (assignedTags.length > 0) {
    msgWrong.value =
      "This category contains tags. Move or delete its tags before deleting the category.";
    return;
  }

  if (!window.confirm("Are you sure you wish to delete this category?")) {
    return;
  }

  if (!startLoading()) {
    return false;
  }

  try {
    const response = await deleteTagCategory(category.id, token);

    if (response.data.success) {
      await refreshCategories();

      msgGood.value = "Category has been deleted";

      if (
        currentTagId.value &&
        !categories.value.some(
          (item) => Number(item.id) === Number(tagCategoryId.value),
        )
      ) {
        clearTagData();
      }
    } else {
      msgWrong.value = await functions.parseError(response.data.error);
    }
  } catch (error) {
    handleError(error, config.demo_status, msgWrong, pre_loader);
  } finally {
    finishLoading();
  }
}

// --------------------------------------------------
// Tags
// --------------------------------------------------

function clearTagData() {
  clearMsg();

  currentTagId.value = false;
  tagName.value = emptyTranslations();
  tagCategoryId.value = "";
}

function editTag(tag) {
  clearMsg();

  currentTagId.value = tag.id;

  tagName.value = {
    ...emptyTranslations(),
    ...tag.name,
  };

  tagCategoryId.value =
    tag.tag_category_id == null ? "" : String(tag.tag_category_id);
}

function validateTag() {
  tagErrors.value = [];

  for (const currentLang of langs) {
    if (!tagName.value[currentLang]?.trim()) {
      msgWrong.value = "Add tag name" + cmsLangPrefix(currentLang);

      tagErrors.value.push("name");
      return false;
    }
  }

  if (!tagCategoryId.value) {
    msgWrong.value = "Select tag category";

    tagErrors.value.push("tag_category_id");
    return false;
  }

  const selectedCategoryExists = categories.value.some(
    (category) => Number(category.id) === Number(tagCategoryId.value),
  );

  if (!selectedCategoryExists) {
    msgWrong.value = "Selected category does not exist";

    tagErrors.value.push("tag_category_id");
    return false;
  }

  return true;
}

async function saveTag() {
  clearMsg();

  if (!validateTag()) {
    return false;
  }

  if (!startLoading()) {
    return false;
  }

  try {
    const post = {
      name: { ...tagName.value },
      tag_category_id: Number(tagCategoryId.value),
    };

    const response = currentTagId.value
      ? await putTag(post, currentTagId.value, token)
      : await postTag(post, token);

    if (response.data.success) {
      const wasNew = !currentTagId.value;

      await refreshTags();

      if (wasNew) {
        clearTagData();
      }

      msgGood.value = wasNew ? "Tag has been added" : "Tag has been changed";
    } else {
      msgWrong.value = await functions.parseError(response.data.error);
    }
  } catch (error) {
    handleError(error, config.demo_status, msgWrong, pre_loader);
  } finally {
    finishLoading();
  }
}

async function deleteTag() {
  clearMsg();

  if (!currentTagId.value) {
    return false;
  }

  if (!window.confirm("Are you sure you wish to delete this tag?")) {
    return;
  }

  if (!startLoading()) {
    return false;
  }

  try {
    const response = await deleteTagRequest(currentTagId.value, token);

    if (response.data.success) {
      await refreshTags();

      clearTagData();

      msgGood.value = "Tag has been deleted";
    } else {
      msgWrong.value = await functions.parseError(response.data.error);
    }
  } catch (error) {
    handleError(error, config.demo_status, msgWrong, pre_loader);
  } finally {
    finishLoading();
  }
}

// Alias prevents naming conflict with deleteTag().
// async function deleteTagApi(id, authToken) {
//   return deleteTagRequest(id, authToken);
// }

// --------------------------------------------------
// Initialization
// --------------------------------------------------

onMounted(async () => {
  if (!auth.token) {
    return;
  }

  pre_loader.value = true;

  try {
    await Promise.all([refreshCategories(), refreshTags()]);
  } catch (error) {
    handleError(error, config.demo_status, msgWrong, pre_loader);
  } finally {
    finishLoading();
  }
});
</script>

<style scoped>
.tag-category {
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.tag-item {
  padding: 5px 8px;
  border-radius: 4px;
  cursor: pointer;
}

.tag-item:hover {
  background-color: #f1f3f5;
}

.selected-tag {
  background-color: #e9ecef;
}

.disabled-if-loader {
  pointer-events: none;
  opacity: 0.5;
}

.cursor-pointer {
  cursor: pointer;
}

.trash {
  color: #dc3545;
}
</style>
