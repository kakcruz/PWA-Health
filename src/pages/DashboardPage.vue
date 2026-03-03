<template>
  <section>
    <AppHeader :title="`Ola, ${userStore.user.name}`" subtitle="MUNGERO" />

    <p class="subtitle mb-3">Tudo pronto para seu acompanhamento hoje?</p>

    <CardComponent custom-class="p-2 mb-3 border-0">
      <CountdownTimer :target-date="applicationStore.next_application_date" />
      <div class="p-3">
        <h2 class="h6 fw-bold mb-1">Proxima Aplicacao</h2>
        <p class="subtitle mb-3">
          Sua dose esta agendada para {{ applicationStore.nextApplicationDateFormatted }}.
        </p>
        <ButtonPrimary>Ver detalhes da dose</ButtonPrimary>
      </div>
    </CardComponent>

    <h3 class="h6 fw-bold mb-3">Gerenciamento</h3>
    <div class="row g-3">
      <div class="col-6" v-for="item in managementItems" :key="item.title">
        <CardComponent custom-class="h-100">
          <i :class="`${item.icon} fs-4 text-primary`"></i>
          <p class="fw-semibold mt-2 mb-1">{{ item.title }}</p>
          <p class="subtitle mb-0">{{ item.desc }}</p>
        </CardComponent>
      </div>
    </div>

    <BottomNavigation />
  </section>
</template>

<script setup>
import AppHeader from "../components/AppHeader.vue";
import ButtonPrimary from "../components/ButtonPrimary.vue";
import CardComponent from "../components/CardComponent.vue";
import CountdownTimer from "../components/CountdownTimer.vue";
import BottomNavigation from "../components/BottomNavigation.vue";
import { useUserStore } from "../stores/userStore";
import { useApplicationStore } from "../stores/applicationStore";

const userStore = useUserStore();
const applicationStore = useApplicationStore();

const managementItems = [
  { title: "Historico", desc: "Aplicacoes anteriores", icon: "bi bi-clock-history" },
  { title: "Dosagem", desc: "Ajuste sua dose", icon: "bi bi-eyedropper" },
  { title: "Nutricao", desc: "Dicas para rotina", icon: "bi bi-egg-fried" },
  { title: "Progresso", desc: "Peso e medidas", icon: "bi bi-graph-up-arrow" }
];
</script>
