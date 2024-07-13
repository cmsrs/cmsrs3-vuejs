<template>
  <div class="container">
    <div class="row test-page">
      <div
        role="edit_page"
        class="ml-2 col-1"
        :class="{ 'disabled-if-loader': pre_loader }"
        @click="$emit('execEditPage', p.id)"
      >
        <i class="far fa-edit cursor-pointer"></i>
      </div>
      <div
        role="del_page"
        class="ml-2 col-1"
        :class="{ 'disabled-if-loader': pre_loader }"
        @click="$emit('execDelPage', p.id)"
      >
        <i class="fas fa-trash cursor-pointer"></i>
      </div>
      <div
        role="down_page"
        :class="{ 'disabled-if-loader': pre_loader }"
        class="ml-2 col-1"
        @click="$emit('execPositionPageDown', p.id)"
      >
        <i class="fas fa-arrow-down cursor-pointer" aria-hidden="true"></i>
      </div>
      <div
        role="up_page"
        :class="{ 'disabled-if-loader': pre_loader }"
        class="ml-2 col-1"
        @click="$emit('execPositionPageUp', p.id)"
      >
        <i class="fas fa-arrow-up cursor-pointer" aria-hidden="true"></i>
      </div>
      <span class="col" :class="{ 'text-secondary': !p.published }">
        <span
          @click="$emit('execEditPage', p.id)"
          v-if="showPageId"
          :class="{ 'text-primary': p.id == currentPageId }"
        >
          {{ p.short_title[lang] + " (" + p.id + ")" }}
        </span>
        <span
          v-else
          :class="{ 'text-primary': p.id == currentPageId }"
          @click="$emit('execEditPage', p.id)"
        >
          {{ p.short_title[lang] }}
        </span>
      </span>
    </div>
  </div>
</template>
<script setup>
defineProps({
  pre_loader: Boolean,
  p: Object,
  lang: String,
  allPages: Object,
  showPageId: Boolean,
  currentPageId: [Number, Boolean],
});

defineEmits([
  "execEditPage",
  "execDelPage",
  "execPositionPageUp",
  "execPositionPageDown",
]);
</script>
