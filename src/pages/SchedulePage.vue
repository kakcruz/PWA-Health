<template>
  <section class="schedule-page">
    <p class="screen-caption">Agendar Aplicação</p>

    <div class="schedule-shell">
      <header class="shell-header">
        <button type="button" class="back-btn" aria-label="Voltar" @click="router.back()">
          <i class="bi bi-arrow-left"></i>
        </button>
        <h1 class="shell-title">Agendar Aplicação</h1>
      </header>

      <div class="med-card">
        <span class="med-icon">
          <i class="bi bi-capsule"></i>
        </span>
        <div>
          <p class="med-name">MUNGERO</p>
          <p class="med-subtitle">Gestao de Aplicações</p>
        </div>
      </div>

      <p class="section-title">Frequencia da aplicação</p>
      <div class="options-list">
        <label
          v-for="option in frequencyOptions"
          :key="option.label"
          class="schedule-option"
          :class="{ active: frequency === option.value }"
        >
          <div class="option-icon">
            <i class="bi bi-calendar-check"></i>
          </div>
          <input v-model="frequency" type="radio" :value="option.value" name="frequency" />
          <div class="option-text">
            <p class="option-label">{{ option.label }}</p>
            <p class="option-desc">{{ option.desc }}</p>
          </div>
          <span class="option-dot" aria-hidden="true"></span>
        </label>
      </div>

      <label class="section-title" for="start-date">Data da ultima aplicação</label>
      <div class="date-input-wrap">
        <input id="start-date" v-model="startDate" class="date-input" type="date" />
      </div>
      <p v-if="startDateWithWeekday" class="weekday-hint">{{ startDateWithWeekday }}</p>

      <div class="next-header">
        <p class="section-title mb-0">Data da próxima aplicação</p>
      </div>
      <article class="next-card">
        <p class="next-date">
          {{ nextDateDisplay }}
        </p>
        <p class="next-note">Baseado na frequencia selecionada</p>
      </article>

      <div class="save-wrap">
        <button type="button" class="save-btn" @click="saveSchedule">
          <i class="bi bi-floppy"></i>
          {{ saveButtonLabel }}
        </button>
        <div v-if="savedSchedule" class="next-confirm-box">
          <p class="next-confirm-title">Sua proxima aplicacao sera em:</p>
          <p class="next-confirm-date">{{ nextDateDisplay }}</p>
        </div>
      </div>
    </div>

    <BottomNavigation />
  </section>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import BottomNavigation from "../components/BottomNavigation.vue";
import { useApplicationStore } from "../stores/applicationStore";
import { saveApplication } from "../services/supabaseService";
import { createApplicationWebhook } from "../services/webhookService";

const router = useRouter();
const applicationStore = useApplicationStore();

const frequency = ref(applicationStore.frequency_days);
const startDate = ref(applicationStore.start_application_date);
const savedSchedule = ref(false);

const frequencyOptions = [
  { label: "1x por semana", desc: "Aplicacao semanal recorrente", value: 7 },
  { label: "A cada 10 dias", desc: "Decendial", value: 10 },
  { label: "A cada 15 dias", desc: "Quinzenal", value: 15 },
  { label: "A cada 20 dias", desc: "Ciclo de 20 dias", value: 20 },
  { label: "A cada 25 dias", desc: "Ciclo de 25 dias", value: 25 },
  { label: "1x por mes", desc: "Mensal", value: 30 }
];

function parseLocalDate(dateString) {
  return new Date(`${dateString}T00:00:00`);
}

function formatIso(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addFrequency(date, frequencyDays) {
  const next = new Date(date);
  if (frequencyDays === 30) {
    next.setMonth(next.getMonth() + 1);
    return next;
  }
  next.setDate(next.getDate() + Number(frequencyDays || 0));
  return next;
}

const nextDate = computed(() => {
  if (!startDate.value) return "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let candidate = addFrequency(parseLocalDate(startDate.value), frequency.value);
  while (candidate <= today) {
    candidate = addFrequency(candidate, frequency.value);
  }

  return formatIso(candidate);
});

function formatDateWithWeekday(dateString) {
  if (!dateString) return "";
  const formatted = parseLocalDate(dateString).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

const startDateWithWeekday = computed(() => formatDateWithWeekday(startDate.value));
const nextDateWithWeekday = computed(() => formatDateWithWeekday(nextDate.value));
const nextDateDisplay = computed(() => nextDateWithWeekday.value || "--");
const saveButtonLabel = computed(() =>
  savedSchedule.value ? "Salvar próxima aplicação" : "Salvar Agendamento"
);

watch([frequency, startDate], () => {
  savedSchedule.value = false;
});

async function saveSchedule() {
  if (!startDate.value || !nextDate.value) return;

  applicationStore.setFrequencyDays(frequency.value);
  applicationStore.setStartApplicationDate(startDate.value);
  applicationStore.setNextApplicationDate(nextDate.value);

  const payload = {
    frequency_days: frequency.value,
    next_application_date: nextDate.value,
    created_at: new Date().toISOString()
  };

  await Promise.allSettled([saveApplication(payload), createApplicationWebhook(payload)]);
  savedSchedule.value = true;
}
</script>

<style scoped>
.schedule-page {
  padding: 0 0 96px;
}

.screen-caption {
  margin: 0 2px 8px;
  color: #8c95aa;
  font-size: 0.95rem;
}

.schedule-shell {
  width: 100%;
  background: #fff;
  border: 1px solid #e8eaf2;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.14);
}

.shell-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 8px;
}

.back-btn {
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  background: transparent;
  color: #12192b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.shell-title {
  margin: 0;
  font-size: 1.55rem;
  font-weight: 800;
  color: #1c2436;
}

.med-card {
  margin: 6px 12px 0;
  border-radius: 16px;
  padding: 12px;
  background: #f6f2ff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.med-icon {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: #ece2ff;
  color: #7539ea;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
}

.med-name {
  margin: 0;
  color: #0e172d;
  font-size: 1.9rem;
  font-weight: 800;
}

.med-subtitle {
  margin: 0;
  color: #7b86a2;
}

.section-title {
  margin: 18px 14px 8px;
  font-size: 18px;
  font-weight: 600;
  color: #10192d;
  line-height: normal;
}

.options-list {
  padding: 0 12px;
  display: grid;
  gap: 10px;
}

.schedule-option {
  border: 1px solid #e1e5f0;
  border-radius: 16px;
  padding: 11px 12px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  background: #fff;
}

.schedule-option input {
  display: none;
}

.schedule-option.active {
  border-color: #7a42ea;
  background: #f8f4ff;
  box-shadow: inset 0 0 0 1px #7a42ea;
}

.option-icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: #f4f6fb;
  color: #9aa5bd;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.schedule-option.active .option-icon {
  background: #efe7ff;
  color: #7539ea;
}

.option-label {
  margin: 0;
  color: #162038;
  font-weight: 700;
}

.option-desc {
  margin: 2px 0 0;
  color: #7f8ca8;
  font-size: 0.83rem;
}

.option-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #c8d0df;
}

.schedule-option.active .option-dot {
  border-color: #7539ea;
  box-shadow: inset 0 0 0 4px #7539ea;
}

.date-input-wrap {
  margin: 0 12px;
  position: relative;
}

.date-input {
  width: 100%;
  border: 1px solid #d8deea;
  border-radius: 16px;
  padding: 12px 12px 12px 14px;
  font-size: 1.05rem;
  color: #1d2538;
}

.date-icon {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #7884a0;
}

.weekday-hint {
  margin: 8px 14px 0;
  color: #8b96b1;
  font-size: 0.9rem;
}

.next-header {
  margin-top: 14px;
  padding: 0 14px;
}

.auto-chip {
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #6f35e4;
  background: #ede3ff;
  border-radius: 999px;
  padding: 6px 10px;
}

.next-card {
  margin: 8px 12px 14px;
  border: 1px solid #d9c7ff;
  border-radius: 16px;
  background: #f7f2ff;
  padding: 14px;
  text-align: center;
}

.next-date {
  margin: 0;
  color: #7339e9;
  font-size: 1.85rem;
  font-weight: 800;
}

.next-note {
  margin: 8px 0 0;
  color: #9a85d9;
  font-weight: 600;
}

.save-wrap {
  border-top: 1px solid #edf0f7;
  padding: 14px 12px 16px;
}

.save-btn {
  width: 100%;
  border: 0;
  border-radius: 999px;
  padding: 13px 16px;
  color: #fff;
  font-weight: 700;
  font-size: 1.02rem;
  background: linear-gradient(90deg, #6f3be8, #8b39f1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 10px 20px rgba(112, 57, 234, 0.34);
}

.next-confirm-box {
  margin-top: 12px;
  border: 1px solid #ddd3ff;
  border-radius: 14px;
  background: #f8f4ff;
  padding: 10px 12px;
}

.next-confirm-title {
  margin: 0;
  color: #6f63a5;
  font-size: 0.9rem;
}

.next-confirm-date {
  margin: 4px 0 0;
  color: #7339e9;
  font-size: 1.05rem;
  font-weight: 700;
}

@media (max-width: 390px) {
  .shell-title {
    font-size: 1.35rem;
  }

  .med-name {
    font-size: 1.5rem;
  }

  .section-title {
    font-size: 1.35rem;
  }

  .next-date {
    font-size: 1.45rem;
  }
}
</style>
