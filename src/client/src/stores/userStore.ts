import { defineStore } from 'pinia';

/**
 * User store
 * @description This store is used to manage user-related data and actions.
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    email: '',
    rank: -1,
    eloPoints: 0
  }),
  actions: {
    setUsername(username: string) {
      this.username = username;
    },
    setEmail(email: string) {
      this.email = email;
    },
    setRank(rank: number) {
      this.rank = rank;
    },
    setEloPoints(eloPoints: number) {
      this.eloPoints = eloPoints;
    }
  },
});
