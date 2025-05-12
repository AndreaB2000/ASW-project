<script setup lang="ts">
import router from '@/router';
import { useMatchStore } from '@/stores/matchStore';
import { socket } from '@/services/server-connections';
import { ref } from 'vue';

const username = ref<string>('');
const match = useMatchStore();

// Emit with the username value
function enterQueue() {
  console.log('enterQueue', username.value);
  socket.emit('requestMatch', { username: username.value });
}

// Listen for match found
socket.on('matchFound', (matchId: any) => {
  match.id = matchId;
  router.push('/match');
});
</script>

<template>
  <input type="text" placeholder="Enter your username" v-model="username" />
  <button @click="enterQueue" style="background-color: #1ec6e0">Play PVP</button>
</template>
