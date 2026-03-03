import { defineStore } from "pinia";

export const useUserStore = defineStore("userStore", {
  state: () => ({
    user: {
      id: "user-01",
      name: "Ana"
    },
    goal_weight: 70
  }),
  actions: {
    setGoalWeight(value) {
      this.goal_weight = value;
    }
  }
});
