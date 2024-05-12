<template>
        <div role="change_lang" class="col-2" v-if="langs.length > 1">
          <div class="row">
            <div v-for="l in langs" :key="l"  class="col-1">
              <span
                :role="'lang_' + l"
                class="lang"
                :class="{
                  'me-1 cursor-pointer text-primary': lang === l,
                  'me-1 cursor-pointer text-secondary': lang !== l,
                }"
                @click="$emit('execChangeLang', l)"              
                >{{ l }}
              </span>
            </div>
          </div>
        </div>
</template>

<script setup>
import functions from "../helpers/functions.js";

const {
  configLangs: langs,
} = functions.retrieveParamsFromStorage();


defineProps({
  lang: String,
});

defineEmits(['execChangeLang'])
</script>