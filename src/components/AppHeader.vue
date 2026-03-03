<template>
  <header class="d-flex justify-content-between align-items-center mb-3">
    <div>
      <p class="title-sm">{{ subtitle }}</p>
      <h1 class="title-lg">{{ title }}</h1>
    </div>
    <button class="btn btn-light rounded-circle shadow-sm" aria-label="Notificacoes">
      <i class="bi bi-bell"></i>
    </button>
  </header>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ""
  }
});
</script>
