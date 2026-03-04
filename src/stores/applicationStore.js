import { defineStore } from "pinia";
const APPLICATION_STORAGE_KEY = "mw:application-schedule";

function getTodayIso() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

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

function getDefaultState() {
  const today = getTodayIso();
  return {
    frequency_days: 7,
    start_application_date: today,
    next_application_date: today
  };
}

function readStoredState() {
  if (typeof window === "undefined") return getDefaultState();
  try {
    const raw = window.localStorage.getItem(APPLICATION_STORAGE_KEY);
    if (!raw) return getDefaultState();
    const parsed = JSON.parse(raw);
    return {
      frequency_days: Number(parsed.frequency_days) || 7,
      start_application_date: parsed.start_application_date || getTodayIso(),
      next_application_date: parsed.next_application_date || getTodayIso()
    };
  } catch {
    return getDefaultState();
  }
}

export const useApplicationStore = defineStore("applicationStore", {
  state: () => readStoredState(),
  getters: {
    nextApplicationDateFormatted: (state) =>
      parseLocalDate(state.next_application_date).toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
  },
  actions: {
    persistSchedule() {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(
        APPLICATION_STORAGE_KEY,
        JSON.stringify({
          frequency_days: this.frequency_days,
          start_application_date: this.start_application_date,
          next_application_date: this.next_application_date
        })
      );
    },
    setFrequencyDays(days) {
      this.frequency_days = days;
      this.persistSchedule();
    },
    setStartApplicationDate(date) {
      this.start_application_date = date;
      this.persistSchedule();
    },
    setNextApplicationDate(date) {
      this.next_application_date = date;
      this.persistSchedule();
    },
    refreshNextApplicationDate(referenceDate = new Date()) {
      if (!this.next_application_date) return;

      const today = new Date(referenceDate);
      today.setHours(0, 0, 0, 0);

      let next = parseLocalDate(this.next_application_date);
      while (next <= today) {
        next = addFrequency(next, this.frequency_days);
      }

      this.next_application_date = formatIso(next);
      this.persistSchedule();
    }
  }
});
