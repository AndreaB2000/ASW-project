import { defineStore } from 'pinia';

/**
 * Theme store
 * @description This store manages the current theme of the application.
 * It allows toggling between 'dark-gray' and 'light' themes.
 * The current theme is stored in localStorage to persist across sessions.
 * The default theme is 'dark-gray'.
 * The theme is applied to the document's root element using a data attribute.
 */
export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: localStorage.getItem('theme') || 'dark-gray',
  }),
  actions: {
    setTheme(theme: string) {
      this.currentTheme = theme
      document.documentElement.setAttribute('data-mdb-theme', theme)
      localStorage.setItem('theme', theme)
    },
    toggleTheme() {
      this.setTheme(this.currentTheme === 'dark-gray' ? 'light' : 'dark-gray')
    },
  },
})
