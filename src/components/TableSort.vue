<template>
  <span>
    <span
      :role="'sorting_' + sortColumn + '_asc'"
      :class="{ 'disabled-if-loader': pre_loader }"
      class="ml-2 col-1"
      @click.prevent="$emit('sortAsc')"
    >
      <i
        class="fas fa-arrow-down cursor-pointer"
        :class="{ 'text-primary': sortColumn == column && direction == 'asc' }"
        aria-hidden="true"
      ></i>
    </span>
    <span
      :role="'sorting_' + sortColumn + '_desc'"
      :class="{ 'disabled-if-loader': pre_loader }"
      class="ml-2 col-1"
      @click.prevent="$emit('sortDesc')"
    >
      <i
        class="fas fa-arrow-up cursor-pointer"
        :class="{ 'text-primary': sortColumn == column && direction == 'desc' }"
        aria-hidden="true"
      ></i>
    </span>
  </span>
</template>

<script setup>

defineProps({
  pre_loader: Boolean,
  sortColumn: String,
  column: String,
  direction: String,
});

defineEmits(['sortAsc', 'sortDesc'])
</script>
