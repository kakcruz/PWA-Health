<template>
  <section>
    <h1 class="page-title">Conteudo e Dicas</h1>

    <input
      v-model="search"
      class="form-control rounded-pill mb-3"
      placeholder="Buscar conteudos ou dicas"
      type="search"
    />

    <div class="d-flex gap-2 mb-3 overflow-auto">
      <button
        v-for="item in filters"
        :key="item"
        class="chip"
        :class="{ active: selectedFilter === item }"
        @click="selectedFilter = item"
      >
        {{ item }}
      </button>
    </div>

    <CardComponent custom-class="mb-3">
      <p class="subtitle mb-1">Recomendado</p>
      <h2 class="h6 fw-bold">Instrucoes de Medicamento</h2>
      <p class="subtitle mb-2">Entenda a bula, dosagem e horarios para seu tratamento.</p>
      <a href="#" class="text-decoration-none fw-semibold">Ler guia completo</a>
    </CardComponent>

    <CardComponent custom-class="mb-3 p-0 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1584516150909-c43483ee793e?w=1000&q=80"
        alt="Video tutorial"
        class="w-100 content-thumb"
      />
      <div class="p-3">
        <h3 class="h6 fw-bold mb-1">Como aplicar corretamente</h3>
        <p class="subtitle mb-0">Passo a passo tecnica subcutanea</p>
      </div>
    </CardComponent>

    <CardComponent custom-class="mb-3">
      <h3 class="h6 fw-bold mb-1">Dicas Nutricionais</h3>
      <p class="subtitle mb-0">Sugestoes de alimentacao para potencializar seus resultados.</p>
    </CardComponent>

    <CardComponent>
      <h3 class="h6 fw-bold mb-1">Dica do dia</h3>
      <p class="subtitle mb-0">
        Alterne os locais de aplicacao para evitar irritacao da pele e garantir melhor absorcao.
      </p>
    </CardComponent>

    <BottomNavigation />
  </section>
</template>

<script setup>
import { ref } from "vue";
import CardComponent from "../components/CardComponent.vue";
import BottomNavigation from "../components/BottomNavigation.vue";

const search = ref("");
const selectedFilter = ref("Tudo");
const filters = ["Tudo", "Medicamentos", "Aplicacao", "Nutricao"];
</script>

<style scoped>
.content-thumb {
  height: 140px;
  object-fit: cover;
}
</style>
