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
  <div class="d-flex flex-column align-items-center justify-content-center" style="height: 80vh">
    <div v-if="loading">
      <span class="material-icons mb-3" style="font-size: 48px; color: #0d6efd">hourglass_top</span>
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Matching...</span>
      </div>
      <div class="mt-3">Looking for a match...</div>
    </div>
  </div>
</template>
