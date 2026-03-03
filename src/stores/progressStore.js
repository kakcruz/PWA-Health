import { defineStore } from "pinia";

export const useProgressStore = defineStore("progressStore", {
  state: () => ({
    weight: 75.2,
    start_weight: 80,
    measures: {
      cintura: 84,
      quadril: 102
    },
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80"
    ],
    history: [
      { label: "Sem 1", value: 79.2 },
      { label: "Sem 2", value: 78.1 },
      { label: "Sem 3", value: 77.2 },
      { label: "Sem 4", value: 76.4 },
      { label: "Sem 5", value: 75.8 },
      { label: "Sem 6", value: 75.2 }
    ]
  }),
  getters: {
    removedKg(state) {
      return Math.max(0, Number((state.start_weight - state.weight).toFixed(1)));
    }
  },
  actions: {
    setWeight(value) {
      this.weight = value;
    },
    addPhoto(url) {
      this.photos.push(url);
    },
    removePhoto(index) {
      if (index < 0 || index >= this.photos.length) return;
      this.photos.splice(index, 1);
    }
  }
});
