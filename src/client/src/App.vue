<script setup lang="ts">
import { RouterView } from 'vue-router';
import { io } from 'socket.io-client';

export const socket = io('ws://localhost:3000');
</script>

<template>
  <RouterView />
</template>
