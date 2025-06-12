<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import router from '@/router';
import { socket } from '@/services/server-connections';

const loading = ref(true);

console.log('entering queue');
socket.emit('requestMatch');

const onMatchFound = (matchId: string) => {
  loading.value = false;
  router.push({ path: '/match', query: { id: matchId } });
};

socket.on('matchFound', onMatchFound);

onUnmounted(() => {
  socket.off('matchFound', onMatchFound);
});
</script>

<template>
  <div class="w-100 min-vh-100 text-white d-flex align-items-center justify-content-center">
    <div v-if="loading" class="d-flex flex-column align-items-center">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Matching...</span>
      </div>
      <div class="mt-3">Searching for opponent...</div>
    </div>
  </div>
</template>
