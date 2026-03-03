<template>
  <section>
    <h1 class="page-title">Progresso</h1>

    <CardComponent custom-class="mb-3">
      <div class="d-flex justify-content-between">
        <div>
          <p class="subtitle mb-1">Peso atual</p>
          <h2 class="h3 fw-bold text-primary">{{ progressStore.weight }} kg</h2>
        </div>
        <div class="text-end">
          <p class="subtitle mb-1">Meta</p>
          <p class="fw-bold">{{ userStore.goal_weight }} kg</p>
        </div>
      </div>
      <div class="progress mb-2" role="progressbar">
        <div class="progress-bar" :style="{ width: `${progressPercent}%` }"></div>
      </div>
      <p class="subtitle mb-0">Voce ja eliminou {{ progressStore.removedKg }} kg desde o inicio.</p>
    </CardComponent>

    <!-- <CardComponent custom-class="mb-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <p class="fw-semibold mb-0">Evolucao de Peso</p>
        <small class="subtitle">Ultimos 30 dias</small>
      </div>
      <canvas ref="chartCanvas" height="120"></canvas>
    </CardComponent> -->

    <section class="mb-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h2 class="h5 fw-bold mb-0">Medidas de Progresso</h2>
        <button type="button" class="chip active border-0" @click="showMeasuresModal = true">
          Ver todas
        </button>
      </div>

      <div class="row g-3">
        <div class="col-6" v-for="measure in previewMeasures" :key="measure.key">
          <CardComponent>
            <div class="d-flex justify-content-between align-items-start mb-1">
              <p class="subtitle mb-0">{{ measure.label }}</p>
              <i :class="`${measure.icon} measure-icon`"></i>
            </div>
            <div class="d-flex align-items-center gap-2">
              <p class="h4 fw-bold mb-0">{{ measure.value.toFixed(1) }} cm</p>
              <span class="trend-icon" :class="measure.trend === 'down' ? 'trend-down' : 'trend-up'">
                <i :class="measure.trend === 'down' ? 'bi bi-arrow-down' : 'bi bi-arrow-up'"></i>
              </span>
            </div>
          </CardComponent>
        </div>
      </div>
    </section>

    <CardComponent>
      <div class="d-flex justify-content-between align-items-center mb-2">
        <p class="fw-semibold mb-0">Galeria de Fotos</p>
        <label class="chip active" style="cursor: pointer">
          <input class="d-none" type="file" accept="image/*" @change="uploadPhoto" />
          Upload
        </label>
      </div>
      <div class="photo-grid">
        <div
          v-for="(photo, idx) in progressStore.photos"
          :key="`${photo}-${idx}`"
          class="gallery-item"
        >
          <img :src="photo" alt="Foto de progresso" class="gallery-img" />
          <button
            type="button"
            class="delete-photo-btn"
            aria-label="Excluir foto"
            @click="openDeleteModal(photo)"
          >
            <i class="bi bi-trash3-fill"></i>
          </button>
        </div>
      </div>
      <p v-if="!progressStore.photos.length" class="subtitle mt-2 mb-0">
        Nenhuma foto na galeria. Faca upload para comecar.
      </p>
    </CardComponent>

    <div v-if="showMeasuresModal" class="measure-modal-overlay" @click.self="showMeasuresModal = false">
      <div class="measure-modal-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <p class="fw-semibold mb-0">Medidas detalhadas</p>
          <button type="button" class="btn-close" aria-label="Fechar" @click="showMeasuresModal = false"></button>
        </div>
        <div class="measure-modal-body">
          <div class="row g-2">
            <div class="col-6" v-for="measure in allMeasures" :key="`modal-${measure.key}`">
              <div class="measure-item">
                <div class="d-flex justify-content-between align-items-start mb-1">
                  <p class="subtitle mb-0">{{ measure.label }}</p>
                  <i :class="`${measure.icon} measure-icon`"></i>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <p class="measure-value mb-0">{{ measure.value.toFixed(1) }} cm</p>
                  <span class="trend-icon" :class="measure.trend === 'down' ? 'trend-down' : 'trend-up'">
                    <i :class="measure.trend === 'down' ? 'bi bi-arrow-down' : 'bi bi-arrow-up'"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="photoToDelete !== null" class="delete-modal-overlay" @click.self="photoToDelete = null">
      <div class="delete-modal-card">
        <p class="fw-semibold mb-2">Confirmar exclusao</p>
        <p class="subtitle mb-3">Deseja remover esta foto da galeria?</p>
        <div class="d-flex gap-2">
          <button type="button" class="btn btn-light rounded-3 w-100" @click="photoToDelete = null">
            Cancelar
          </button>
          <button type="button" class="btn btn-danger rounded-3 w-100" @click="confirmRemovePhoto">
            Excluir
          </button>
        </div>
      </div>
    </div>

    <BottomNavigation />
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import Chart from "chart.js/auto";
import CardComponent from "../components/CardComponent.vue";
import BottomNavigation from "../components/BottomNavigation.vue";
import { useProgressStore } from "../stores/progressStore";
import { useUserStore } from "../stores/userStore";
import { savePhoto, saveWeight } from "../services/supabaseService";
import { updateProgressWebhook } from "../services/webhookService";

const chartCanvas = ref(null);
const progressStore = useProgressStore();
const userStore = useUserStore();
const photoToDelete = ref(null);
const showMeasuresModal = ref(false);
let chartInstance = null;

const progressPercent = computed(() => {
  const total = progressStore.start_weight - userStore.goal_weight;
  const done = progressStore.start_weight - progressStore.weight;
  if (total <= 0) return 0;
  return Math.min(100, Math.round((done / total) * 100));
});

const allMeasures = computed(() => [
  { key: "pescoco", label: "Pescoco", value: 33.0, trend: "down", icon: "bi bi-person-badge" },
  { key: "ombro", label: "Ombro", value: 98.0, trend: "up", icon: "bi bi-arrows-expand" },
  { key: "peito", label: "Peito", value: 93.0, trend: "down", icon: "bi bi-heart-pulse" },
  { key: "cintura", label: "Cintura", value: Number(progressStore.measures.cintura), trend: "down", icon: "bi bi-rulers" },
  { key: "quadril", label: "Quadril", value: Number(progressStore.measures.quadril), trend: "up", icon: "bi bi-person-standing" },
  { key: "braco_esq", label: "Braco (Esq.)", value: 32.0, trend: "down", icon: "bi bi-person-arms-up" },
  { key: "braco_dir", label: "Braco (Dir.)", value: 32.0, trend: "up", icon: "bi bi-person-arms-up" },
  { key: "abd_sup", label: "Abdomen Sup.", value: 80.0, trend: "down", icon: "bi bi-crosshair" },
  { key: "abd_inf", label: "Abdomen Inf.", value: 93.0, trend: "up", icon: "bi bi-crosshair2" },
  { key: "coxa_esq", label: "Coxa (Esq.)", value: 55.0, trend: "down", icon: "bi bi-person-walking" },
  { key: "coxa_dir", label: "Coxa (Dir.)", value: 55.3, trend: "up", icon: "bi bi-person-walking" },
  { key: "pant_esq", label: "Panturrilha (Esq.)", value: 36.2, trend: "down", icon: "bi bi-universal-access" },
  { key: "pant_dir", label: "Panturrilha (Dir.)", value: 36.5, trend: "up", icon: "bi bi-universal-access" }
]);

const previewMeasures = computed(() => allMeasures.value.slice(0, 4));

onMounted(async () => {
  if (chartCanvas.value) {
    chartInstance = new Chart(chartCanvas.value, {
      type: "bar",
      data: {
        labels: progressStore.history.map((h) => h.label),
        datasets: [
          {
            data: progressStore.history.map((h) => h.value),
            backgroundColor: "#8E7CFF",
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: "#f1f1f7" } }
        }
      }
    });
  }

  const payload = {
    weight: progressStore.weight,
    measures: progressStore.measures,
    at: new Date().toISOString()
  };

  await Promise.allSettled([saveWeight(payload), updateProgressWebhook(payload)]);
});

onBeforeUnmount(() => {
  if (chartInstance) chartInstance.destroy();
});

async function uploadPhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const localUrl = URL.createObjectURL(file);
  progressStore.addPhoto(localUrl);
  event.target.value = "";
  await savePhoto({
    name: file.name,
    size: file.size,
    created_at: new Date().toISOString()
  });
}

function openDeleteModal(photoUrl) {
  photoToDelete.value = { photoUrl };
}

function confirmRemovePhoto() {
  if (!photoToDelete.value) return;
  const { photoUrl } = photoToDelete.value;
  const index = progressStore.photos.findIndex((photo) => photo === photoUrl);
  if (index === -1) {
    photoToDelete.value = null;
    return;
  }
  if (typeof photoUrl === "string" && photoUrl.startsWith("blob:")) {
    URL.revokeObjectURL(photoUrl);
  }
  progressStore.removePhoto(index);
  photoToDelete.value = null;
}
</script>

<style scoped>
section {
  overflow-x: hidden;
}

.progress {
  height: 10px;
  border-radius: 999px;
  background: #ececf8;
}

.progress-bar {
  background: var(--mg-gradient);
}

.gallery-img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 12px;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.gallery-item {
  position: relative;
  min-width: 0;
}

.delete-photo-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  border: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  color: #fff;
  background: rgba(31, 41, 55, 0.75);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.delete-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 20px;
}

.delete-modal-card {
  width: 100%;
  max-width: 340px;
  background: #fff;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.28);
}

.trend-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
}

.trend-down {
  background: #e8f7ee;
  color: #16a34a;
}

.trend-up {
  background: #ffe9ea;
  color: #dc2626;
}

.measure-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1090;
  padding: 16px;
}

.measure-modal-card {
  width: 100%;
  max-width: 380px;
  background: #fff;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.28);
}

.measure-modal-body {
  max-height: 58vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 2px;
}

.measure-item {
  border: 1px solid #eceaf8;
  border-radius: 12px;
  padding: 10px;
  background: #fff;
}

.measure-value {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--mg-primary);
}

.measure-icon {
  color: #b89bf8;
  font-size: 1.1rem;
  line-height: 1;
}
</style>
