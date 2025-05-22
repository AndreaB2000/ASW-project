<script setup lang="ts">
import router from '@/router';
import { socket } from '@/services/server-connections';
import { ref } from 'vue';

const username = ref<string>('');

// Emit with the username value
function enterQueue() {
  console.log('enterQueue', username.value);
  socket.emit('requestMatch', { username: username.value });
}

// Listen for match found
socket.on('matchFound', (matchId: string) => {
  router.push({ path: '/match', query: { id: matchId } });
});
</script>

<template>
  <input type="text" placeholder="Enter your username" v-model="username" />
  <button @click="enterQueue" style="background-color: #1ec6e0">Play PVP</button>
</template>
