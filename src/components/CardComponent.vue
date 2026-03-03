<template>
  <div class="card-soft p-3" :class="customClass">
    <slot />
  </div>
</template>

<script setup>
defineProps({
  customClass: {
    type: String,
    default: ""
  }
});
</script>
