<template>
  <section>
    <h1 class="page-title">Agendar Aplicacao</h1>

    <CardComponent custom-class="mb-3">
      <div class="d-flex align-items-center gap-2 mb-3">
        <div class="rounded-3 p-2 bg-light"><i class="bi bi-capsule"></i></div>
        <div>
          <p class="mb-0 fw-bold">MUNGERO</p>
          <p class="subtitle">Gestao de Medicamentos</p>
        </div>
      </div>

      <p class="fw-semibold mb-2">Frequencia da aplicacao</p>
      <div class="d-grid gap-2 mb-3">
        <label
          v-for="option in frequencyOptions"
          :key="option.value"
          class="schedule-option"
          :class="{ active: frequency === option.value }"
        >
          <input v-model="frequency" type="radio" :value="option.value" name="frequency" />
          <span>{{ option.label }}</span>
        </label>
      </div>

      <label class="form-label fw-semibold">Data da proxima aplicacao</label>
      <input v-model="nextDate" class="form-control form-control-lg rounded-4 mb-3" type="date" />

      <ButtonPrimary @click="saveSchedule">Salvar Agendamento</ButtonPrimary>
    </CardComponent>

    <BottomNavigation />
  </section>
</template>

<script setup>
import { ref } from "vue";
import CardComponent from "../components/CardComponent.vue";
import ButtonPrimary from "../components/ButtonPrimary.vue";
import BottomNavigation from "../components/BottomNavigation.vue";
import { useApplicationStore } from "../stores/applicationStore";
import { saveApplication } from "../services/supabaseService";
import { createApplicationWebhook } from "../services/webhookService";

const applicationStore = useApplicationStore();

const frequency = ref(applicationStore.frequency_days);
const nextDate = ref(applicationStore.next_application_date);

const frequencyOptions = [
  { label: "1x por semana", value: 7 },
  { label: "A cada 15 dias", value: 15 },
  { label: "A cada 20 dias", value: 20 },
  { label: "A cada 30 dias", value: 30 }
];

async function saveSchedule() {
  applicationStore.setFrequencyDays(frequency.value);
  applicationStore.setNextApplicationDate(nextDate.value);

  const payload = {
    frequency_days: frequency.value,
    next_application_date: nextDate.value,
    created_at: new Date().toISOString()
  };

  await Promise.allSettled([saveApplication(payload), createApplicationWebhook(payload)]);
}
</script>

<style scoped>
.schedule-option {
  border: 1px solid #ded9ff;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  cursor: pointer;
  background: #fff;
}

.schedule-option input {
  display: none;
}

.schedule-option.active {
  border-color: var(--mg-primary);
  background: #f4f1ff;
  box-shadow: inset 0 0 0 1px var(--mg-primary);
}
</style>
