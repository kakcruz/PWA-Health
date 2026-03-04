<template>
  <div class="gradient-bg text-center p-4 rounded-4">
    <h2 class="display-6 fw-bold mb-1">{{ displayWeekday }}</h2>
    <p class="mb-0 date-line">{{ displayDate }}</p>
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

function parseDate(value) {
  return new Date(`${value}T00:00:00`);
}

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const displayWeekday = computed(() => {
  if (!props.targetDate) return "--";
  const weekday = parseDate(props.targetDate).toLocaleDateString("pt-BR", {
    weekday: "long"
  });
  return capitalize(weekday);
});

const displayDate = computed(() => {
  if (!props.targetDate) return "--/--/----";
  return parseDate(props.targetDate).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
});
</script>

<style scoped>
.date-line {
  font-size: 1.25rem;
  font-weight: 600;
  opacity: 0.95;
}
</style>
