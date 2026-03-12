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

      <div class="question-card">
        <p class="question-eyebrow">Etapa {{ currentStep }} de {{ steps.length }}</p>
        <h2 v-if="currentStepMeta.title" class="question-title">{{ currentStepMeta.title }}</h2>
        <p class="question-description">{{ currentStepMeta.description }}</p>

        <div v-if="currentStep === 1" class="step-body">
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
        </div>

        <div v-else-if="currentStep === 2" class="step-body">
          <label class="field-label" for="start-date">Quando foi sua última aplicação?</label>
          <div class="date-input-wrap">
            <input id="start-date" v-model="startDate" class="date-input" type="date" />
          </div>
          <p v-if="startDateWithWeekday" class="weekday-hint">{{ startDateWithWeekday }}</p>

          <article v-if="frequencyLabel" class="summary-inline">
            <p class="summary-label">Frequência escolhida</p>
            <p class="summary-value">{{ frequencyLabel }}</p>
          </article>
        </div>

        <div v-else class="step-body">
          <div class="review-grid">
            <article class="review-card">
              <p class="review-label">Frequência da aplicação</p>
              <p class="review-value">{{ frequencyLabel }}</p>
            </article>

            <article class="review-card">
              <p class="review-label">Data da última aplicação</p>
              <p class="review-value">{{ startDateWithWeekday || "--" }}</p>
            </article>

            <article class="next-card">
              <div class="next-header">
                <p class="section-title">Data da próxima aplicação:</p>
              </div>
              <p class="next-date">{{ nextDateDisplay }}</p>
            </article>
          </div>
        </div>
      </div>

      <div class="actions-bar">
        <button
          type="button"
          class="secondary-btn"
          :disabled="currentStep === 1"
          @click="goToPreviousStep"
        >
          <i class="bi bi-arrow-left"></i>
          Voltar
        </button>

        <button
          v-if="currentStep < steps.length"
          type="button"
          class="primary-btn"
          :disabled="!canAdvance"
          @click="goToNextStep"
        >
          Próximo
          <i class="bi bi-arrow-right"></i>
        </button>

        <button
          v-else
          type="button"
          class="save-btn"
          :disabled="!canSave"
          @click="saveSchedule"
        >
          <i class="bi bi-floppy"></i>
          Salvar aplicação
        </button>
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal-backdrop" @click="closeSuccessModal">
      <div class="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title" @click.stop>
        <div class="success-icon">
          <i class="bi bi-check2-circle"></i>
        </div>
        <h2 id="success-title" class="success-title">Agendamento salvo</h2>
        <p class="success-text">A data da próxima aplicação foi salva com sucesso.</p>
        <button type="button" class="primary-btn modal-btn" @click="closeSuccessModal">Voltar ao início</button>
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

const currentStep = ref(1);
const frequency = ref(applicationStore.frequency_days);
const startDate = ref(applicationStore.start_application_date);
const showSuccessModal = ref(false);

const steps = [
  {
    id: 1,
    title: "Com que frequência você aplica?",
    description: "Escolha a recorrência da aplicação."
  },
  {
    id: 2,
    title: "Quando foi a última aplicação?",
    description: "Informe a data da última dose para calcular a próxima aplicação com a frequência selecionada."
  },
  {
    id: 3,
    title: "",
    description: "Revise os dados antes de salvar"
  }
];

const frequencyOptions = [
  { label: "1x por semana", desc: "Aplicação semanal recorrente", value: 7 },
  { label: "A cada 10 dias", desc: "Decendial", value: 10 },
  { label: "A cada 15 dias", desc: "Quinzenal", value: 15 },
  { label: "A cada 20 dias", desc: "Ciclo de 20 dias", value: 20 },
  { label: "A cada 25 dias", desc: "Ciclo de 25 dias", value: 25 },
  { label: "1x por mês", desc: "Mensal", value: 30 }
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

const currentStepMeta = computed(() => steps.find((step) => step.id === currentStep.value) || steps[0]);
const frequencyOptionSelected = computed(
  () => frequencyOptions.find((option) => option.value === Number(frequency.value)) || frequencyOptions[0]
);
const frequencyLabel = computed(() => frequencyOptionSelected.value?.label || "--");

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

const startDateWithWeekday = computed(() => formatDateWithWeekday(startDate.value));
const nextDateWithWeekday = computed(() => formatDateWithWeekday(nextDate.value));
const nextDateDisplay = computed(() => nextDateWithWeekday.value || "--");

const canAdvance = computed(() => {
  if (currentStep.value === 1) return Boolean(frequency.value);
  if (currentStep.value === 2) return Boolean(startDate.value);
  return true;
});

const canSave = computed(() => Boolean(startDate.value && nextDate.value));

watch([frequency, startDate], () => {
  showSuccessModal.value = false;
});

function goToNextStep() {
  if (!canAdvance.value || currentStep.value >= steps.length) return;
  currentStep.value += 1;
}

function goToPreviousStep() {
  if (currentStep.value <= 1) return;
  currentStep.value -= 1;
}

async function saveSchedule() {
  if (!canSave.value) return;

  applicationStore.setFrequencyDays(frequency.value);
  applicationStore.setStartApplicationDate(startDate.value);
  applicationStore.setNextApplicationDate(nextDate.value);

  const payload = {
    frequency_days: frequency.value,
    next_application_date: nextDate.value,
    created_at: new Date().toISOString()
  };

  await Promise.allSettled([saveApplication(payload), createApplicationWebhook(payload)]);
  showSuccessModal.value = true;
}

function closeSuccessModal() {
  showSuccessModal.value = false;
  currentStep.value = 1;
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
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.14);
}

.shell-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 14px 8px;
}

.back-btn {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: #12192b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.shell-title {
  margin: 0;
  font-size: 1.55rem;
  font-weight: 800;
  color: #1c2436;
}

.question-card {
  margin: 12px 12px 0;
  border: 1px solid #edf0f7;
  border-radius: 20px;
  background: #fff;
  padding: 16px;
}

.question-eyebrow {
  margin: 0;
  color: #7a42ea;
  font-size: 0.82rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-weight: 700;
}

.question-title {
  margin: 8px 0 0;
  color: #10192d;
  font-size: 1.35rem;
  font-weight: 800;
}

.question-description {
  margin: 8px 0 0;
  color: #7b86a2;
  line-height: 1.5;
}

.step-body {
  margin-top: 16px;
}

.options-list {
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
  font-weight: 600;
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

.field-label,
.section-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #10192d;
}

.date-input-wrap {
  margin-top: 10px;
}

.date-input {
  width: 100%;
  border: 1px solid #d8deea;
  border-radius: 16px;
  padding: 12px 12px 12px 14px;
  font-size: 1.05rem;
  color: #1d2538;
  background: #fff;
}

.weekday-hint {
  margin: 8px 0 0;
  color: #8b96b1;
  font-size: 0.9rem;
}

.summary-inline {
  margin-top: 14px;
  border: 1px solid #ebeef6;
  border-radius: 16px;
  background: #f9fbff;
  padding: 12px 14px;
}

.summary-label,
.review-label {
  margin: 0;
  color: #7f8ca8;
  font-size: 0.83rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.summary-value,
.review-value {
  margin: 6px 0 0;
  color: #162038;
  font-size: 1.05rem;
  font-weight: 600;
}

.review-grid {
  display: grid;
  gap: 12px;
}

.review-card {
  border: 1px solid #ebeef6;
  border-radius: 16px;
  background: #fbfcff;
  padding: 14px;
}

.next-card {
  border: 1px solid #d9c7ff;
  border-radius: 18px;
  background: linear-gradient(180deg, #f8f4ff 0%, #f2edff 100%);
  padding: 14px;
  text-align: left;
}

.next-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.next-date {
  margin: 12px 0 0;
  color: #7339e9;
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 1.2;
}

.actions-bar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 16px 12px 18px;
  border-top: 1px solid #edf0f7;
  margin-top: 16px;
}

.secondary-btn,
.primary-btn,
.save-btn {
  width: 100%;
  border-radius: 999px;
  padding: 13px 16px;
  font-weight: 600;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.2s ease;
}

.secondary-btn {
  border: 1px solid #d8deea;
  background: #fff;
  color: #1b253b;
}

.primary-btn,
.save-btn {
  border: 0;
  color: #fff;
  background: linear-gradient(90deg, #6f3be8, #8b39f1);
  box-shadow: 0 10px 20px rgba(112, 57, 234, 0.24);
}

.secondary-btn:disabled,
.primary-btn:disabled,
.save-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1200;
  background: rgba(12, 18, 31, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.success-modal {
  width: min(100%, 360px);
  border-radius: 24px;
  background: #fff;
  padding: 24px 20px 20px;
  text-align: center;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.24);
}

.success-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  margin: 0 auto 14px;
  background: #efe7ff;
  color: #7539ea;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.success-title {
  margin: 0;
  color: #10192d;
  font-size: 1.3rem;
  font-weight: 800;
}

.success-text {
  margin: 10px 0 0;
  color: #6f7c98;
  line-height: 1.5;
}

.modal-btn {
  margin-top: 18px;
}

@media (max-width: 520px) {
  .shell-title {
    font-size: 1.35rem;
  }

  .question-title {
    font-size: 1.18rem;
  }

  .next-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .actions-bar {
    grid-template-columns: 1fr;
  }
}
</style>
