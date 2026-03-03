import { defineStore } from "pinia";

export const useApplicationStore = defineStore("applicationStore", {
  state: () => ({
    frequency_days: 7,
    next_application_date: "2026-03-03"
  }),
  getters: {
    nextApplicationDateFormatted: (state) =>
      new Date(state.next_application_date).toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
  },
  actions: {
    setFrequencyDays(days) {
      this.frequency_days = days;
    },
    setNextApplicationDate(date) {
      this.next_application_date = date;
    }
  }
});
