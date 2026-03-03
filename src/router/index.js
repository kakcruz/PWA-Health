import { createRouter, createWebHistory } from "vue-router";
import DashboardPage from "../pages/DashboardPage.vue";
import SchedulePage from "../pages/SchedulePage.vue";
import DosagePage from "../pages/DosagePage.vue";
import ProgressPage from "../pages/ProgressPage.vue";
import ContentPage from "../pages/ContentPage.vue";

const routes = [
  { path: "/", name: "home", component: DashboardPage },
  { path: "/agenda", name: "schedule", component: SchedulePage },
  { path: "/dosagem", name: "dosage", component: DosagePage },
  { path: "/progresso", name: "progress", component: ProgressPage },
  { path: "/conteudo", name: "content", component: ContentPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
