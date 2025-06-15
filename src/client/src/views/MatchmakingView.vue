<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import router from '@/router';
import { socket } from '@/services/server-connections';
import { useMatchStore } from '@/stores/matchStore';

const loading = ref(true);
const match = useMatchStore();

console.log('entering queue');
socket.emit('requestMatch');

const onMatchFound = (matchId: string) => {
  loading.value = false;
  match.id = matchId;
  router.push({ path: '/match' });
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
