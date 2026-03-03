<template>
  <div class="app-shell">
    <main class="app-content">
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade-slide" mode="out-in">
          <component :is="Component" :key="route.fullPath" />
        </Transition>
      </RouterView>
    </main>
  </div>
</template>

<script setup>
import { RouterView } from "vue-router";
</script>
