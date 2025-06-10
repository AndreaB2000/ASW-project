<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { socket } from '@/services/server-connections';
import { useRouter } from 'vue-router';

const router = useRouter();
const match = useMatchStore();

function playPVP() {
  console.log('enterQueue');
  socket.emit('requestMatch');
}

function playWithBot() {
  console.log('match with bot requested');
  socket.emit('requestMatchWithBot');
}

socket.on('matchFound', (matchId: string) => {
  router.push({ path: '/match', query: { id: matchId } });
});
</script>

<template>
  <NavBar />
</template>

<style scoped>
.landing-icon {
  width: 10vw;
  max-width: 120px;
  min-width: 80px;
}

.subtitle {
  font-size: clamp(1rem, 4vw, 2rem);
}

.spaced-title {
  letter-spacing: 1vw;
}
.divider {
  height: 3rem;
  width: 1px;
  background-color: var(--mdb-body-color);
  margin: 0 0.5rem;
}
</style>
