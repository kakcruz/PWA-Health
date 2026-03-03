<template>
  <div class="gradient-bg text-center p-4 rounded-4">
    <h2 class="display-6 fw-bold mb-1">{{ displayText }}</h2>
    <p class="mb-0 small opacity-75">DIAS : HORAS</p>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  targetDate: {
    type: String,
    required: true
  }
});

const displayText = computed(() => {
  const now = new Date();
  const target = new Date(props.targetDate);
  const ms = target.getTime() - now.getTime();
  if (ms <= 0) return "00:00";
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  return `${String(days).padStart(2, "0")}:${String(hours).padStart(2, "0")}`;
});
</script>
