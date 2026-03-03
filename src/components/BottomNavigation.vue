<template>
  <nav class="bottom-nav card-soft px-2 py-2">
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="bottom-link"
      :class="{ active: route.path === item.to }"
    >
      <i :class="item.icon"></i>
      <small>{{ item.label }}</small>
    </RouterLink>
  </nav>
</template>

<script setup>
import { useRoute, RouterLink } from "vue-router";

const route = useRoute();
const items = [
  { label: "Inicio", to: "/", icon: "bi bi-house-door" },
  { label: "Agenda", to: "/agenda", icon: "bi bi-calendar2-check" },
  { label: "Dosagem", to: "/dosagem", icon: "bi bi-eyedropper" },
  { label: "Progresso", to: "/progresso", icon: "bi bi-bar-chart" },
  { label: "Conteudo", to: "/conteudo", icon: "bi bi-journal-text" }
];
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 24px);
  max-width: 398px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  z-index: 30;
}

.bottom-link {
  text-decoration: none;
  color: var(--mg-text-light);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 12px;
  padding: 8px 2px;
  font-size: 0.7rem;
}

.bottom-link i {
  font-size: 1rem;
}

.bottom-link.active {
  background: #f0edff;
  color: var(--mg-primary);
  font-weight: 700;
}
</style>
