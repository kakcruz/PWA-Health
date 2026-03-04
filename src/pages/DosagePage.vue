<template>
  <section class="dosage-page">
    <h1 class="page-title dosage-top-title">Ajuste de Dosagem</h1>

    <CardComponent custom-class="dosage-shell mb-3">
      <header class="dosage-header">
        <button type="button" class="back-btn" aria-label="Voltar" @click="router.back()">
          <i class="bi bi-arrow-left"></i>
        </button>

        <div>
          <h2 class="dosage-title">Calculadora de Dosagem</h2>
          <p class="dosage-subtitle">
            Converta sua dose de mg para UI e saiba exatamente onde posicionar o embolo da sua
            seringa.
          </p>
        </div>
      </header>

      <article class="guide-card">
        <p class="guide-chip">GUIA DE POSICIONAMENTO</p>
        <h3 class="guide-title">Posicione no risco: {{ formattedUi }} UI</h3>

        <div class="syringe-wrap">
          <div class="syringe">
            <div class="markings"></div>
            <span class="needle"></span>
            <span class="plunger"></span>
            <span class="cursor"></span>
          </div>
        </div>

        <p class="compat-chip">COMPATIVEL COM PADRAO DE MEDIDA UI EUROPEU</p>

        <div class="tip-box">
          <i class="bi bi-info-circle-fill"></i>
          <p>
            Puxe o embolo ate que o <strong>topo da borracha preta</strong> esteja exatamente no
            <strong>risco {{ formattedUi }}</strong> da sua seringa.
          </p>
        </div>
      </article>

      <section class="dose-card">
        <div class="dose-header">
          <p>Dose indicada (mg)</p>
          <span>DESTAQUE</span>
        </div>

        <div class="dose-pill">
          <strong>{{ dosageMg }}</strong>
          <small>mg</small>
        </div>

        <p class="dose-note">A dosagem que seu medico prescreveu para esta aplicacao.</p>
      </section>

      <section class="total-card">
        <p class="total-title">Total no frasco (mg)</p>
        <p class="total-value">{{ totalMg }}</p>
      </section>
    </CardComponent>

    <BottomNavigation />
  </section>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import CardComponent from "../components/CardComponent.vue";
import BottomNavigation from "../components/BottomNavigation.vue";

const router = useRouter();

const selectedUi = ref(8);
const dosageMg = computed(() => (selectedUi.value / 3.2).toFixed(1).replace(".", ","));
const totalMg = ref("5,0 mg");
const formattedUi = computed(() => String(selectedUi.value).padStart(2, "0"));
</script>

<style scoped>
.dosage-page {
  overflow-x: hidden;
}

.dosage-top-title {
  margin-bottom: 10px;
}

.dosage-shell {
  padding: 0;
  overflow: hidden;
}

.dosage-header {
  padding: 18px 16px 14px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: start;
  border-bottom: 1px solid #f0ebff;
}

.back-btn {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #4b4b66;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.back-btn i {
  font-size: 1.1rem;
}

.dosage-title {
  margin: 0;
  font-weight: 700;
  font-size: 1.25rem;
  text-align: center;
  color: #2b2f42;
}

.dosage-subtitle {
  margin: 6px 0 0;
  font-size: 0.93rem;
  line-height: 1.35;
  color: #8a90aa;
  text-align: center;
}

.guide-card {
  margin: 14px 12px;
  border: 2px solid #e4d7ff;
  border-radius: 24px;
  padding: 16px 14px 14px;
  background: #fcfaff;
}

.guide-chip {
  margin: 0 auto 10px;
  width: fit-content;
  background: #ede4ff;
  border-radius: 999px;
  color: #8869db;
  font-size: 0.72rem;
  padding: 4px 10px;
  font-weight: 700;
  letter-spacing: 0.03em;
}

.guide-title {
  margin: 0;
  text-align: center;
  color: #6f46db;
  font-size: 1.9rem;
  font-weight: 800;
}

.syringe-wrap {
  margin-top: 14px;
  border-radius: 22px;
  background: #f0eef5;
  height: 132px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.syringe {
  position: relative;
  width: 230px;
  height: 56px;
}

.syringe::before {
  content: "";
  position: absolute;
  left: 40px;
  top: 8px;
  width: 166px;
  height: 40px;
  border: 2px solid #c9bddd;
  border-radius: 4px;
  background: linear-gradient(90deg, #f8f5ff 0%, #efe8ff 100%);
}

.markings {
  position: absolute;
  left: 58px;
  top: 13px;
  width: 138px;
  height: 30px;
  background: repeating-linear-gradient(
    90deg,
    rgba(141, 123, 190, 0.9) 0 1px,
    transparent 1px 10px,
    rgba(141, 123, 190, 0.8) 10px 11px,
    transparent 11px 20px
  );
}

.plunger {
  position: absolute;
  left: 20px;
  top: 23px;
  width: 22px;
  height: 10px;
  border: 2px solid #c9bddd;
  border-right: 0;
  background: #fff;
}

.needle {
  position: absolute;
  left: 10px;
  top: 24px;
  width: 12px;
  height: 8px;
  border-radius: 3px 0 0 3px;
  background: #d6dce9;
}

.cursor {
  position: absolute;
  left: 55px;
  top: 4px;
  width: 3px;
  height: 48px;
  background: #6f46db;
  border-radius: 999px;
}

.cursor::after {
  content: "";
  position: absolute;
  left: -3px;
  bottom: -7px;
  width: 9px;
  height: 9px;
  background: #6f46db;
  clip-path: polygon(50% 100%, 0 0, 100% 0);
}

.compat-chip {
  margin: 16px auto 0;
  width: fit-content;
  max-width: 94%;
  text-align: center;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 0.66rem;
  letter-spacing: 0.03em;
  font-weight: 700;
  color: #97a2be;
  background: #eff1f7;
}

.tip-box {
  margin-top: 14px;
  border-radius: 18px;
  background: #f1ebff;
  padding: 12px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  color: #666d89;
}

.tip-box i {
  color: #8f61f5;
}

.tip-box p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.35;
}

.tip-box strong {
  color: #6f46db;
}

.dose-card {
  padding: 8px 14px 4px;
}

.dose-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.dose-header p {
  margin: 0;
  color: #6f46db;
  font-weight: 700;
}

.dose-header span {
  font-size: 0.7rem;
  color: #ba9bf9;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.dose-pill {
  border: 2px solid #cfbcff;
  border-radius: 999px;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: #6f46db;
}

.dose-pill strong {
  font-size: 2.1rem;
  line-height: 1;
}

.dose-pill small {
  font-size: 1.4rem;
  font-weight: 700;
}

.dose-note {
  margin: 8px 2px 0;
  color: #8e97b0;
  font-size: 0.85rem;
  font-style: italic;
}

.total-card {
  padding: 6px 14px 20px;
}

.total-title {
  margin: 0;
  color: #3c455f;
  font-weight: 700;
}

.total-value {
  margin: 6px 0 0;
  color: #6f46db;
  font-weight: 700;
  font-size: 1.1rem;
}

@media (max-width: 390px) {
  .guide-title {
    font-size: 1.65rem;
  }

  .dose-pill strong {
    font-size: 1.8rem;
  }
}
</style>
