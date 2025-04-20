<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import HelloWorld from './components/HelloWorld.vue';
import { io } from 'socket.io-client';

export const socket = io('ws://localhost:3000');
</script>

<template>
  <RouterView />
</template>
