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
      <span class="col">
        <span v-if="showPageId">
          {{ p.short_title[lang] + " (" + p.id + ")" }}
        </span>
        <span v-else>
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
});

defineEmits(['execEditPage', 'execDelPage',  'execPositionPageUp',   'execPositionPageDown' ])

</script>
