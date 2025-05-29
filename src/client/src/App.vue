<script setup lang="ts">
import { RouterView } from 'vue-router';
import 'mdb-vue-ui-kit/css/mdb.min.css';
import './styles/themes.scss';
import { useThemeStore } from './stores/themeStore';

const themeStore = useThemeStore();
console.log('Current theme:', themeStore.currentTheme);
themeStore.setTheme(themeStore.currentTheme);
</script>

<template>
  <RouterView />
</template>
