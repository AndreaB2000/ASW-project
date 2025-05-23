import { defineStore } from 'pinia';

/**
 * User store
 * @description This store is used to manage user-related data and actions.
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    email: ''
  }),
  actions: {
    setEmail(email: string) {
      this.email = email;
    },
  },
});
