<template>
  <section>
    <h1 class="page-title">Ajuste de Dosagem</h1>

    <CardComponent custom-class="mb-3 text-center">
      <div class="syringe-wrap mb-3">
        <div class="syringe"></div>
      </div>
      <p class="h2 fw-bold text-primary mb-0">{{ dosageMl }}ml = {{ selectedUi }} UI</p>
      <p class="subtitle">Dose recomendada</p>
    </CardComponent>

    <CardComponent custom-class="mb-3">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <p class="fw-semibold mb-0">Ajuste Manual</p>
        <span class="chip active">{{ selectedUi }} UI</span>
      </div>
      <input v-model="selectedUi" class="form-range" type="range" min="0" max="100" step="5" />
      <div class="d-flex justify-content-between subtitle">
        <span>0 UI</span>
        <span>100 UI</span>
      </div>
    </CardComponent>

    <CardComponent>
      <p class="fw-semibold mb-2">Como medir corretamente?</p>
      <p class="subtitle mb-0">
        Confirme sempre a unidade indicada no corpo da seringa e mantenha a aplicacao no mesmo
        horario para estabilidade.
      </p>
    </CardComponent>

    <BottomNavigation />
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import CardComponent from "../components/CardComponent.vue";
import BottomNavigation from "../components/BottomNavigation.vue";

const selectedUi = ref(50);
const dosageMl = computed(() => (selectedUi.value / 100).toFixed(1));
</script>

<style scoped>
.syringe-wrap {
  height: 120px;
  background: #f5f1ff;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.syringe {
  width: 210px;
  height: 44px;
  border-radius: 10px;
  border: 2px solid #cfcbf9;
  background: linear-gradient(90deg, #b8abff 0 50%, #ffffff 50% 100%);
  position: relative;
}

.syringe::after {
  content: "";
  width: 44px;
  height: 8px;
  background: #cfcbf9;
  position: absolute;
  right: -44px;
  top: 16px;
  border-radius: 0 6px 6px 0;
}
</style>
