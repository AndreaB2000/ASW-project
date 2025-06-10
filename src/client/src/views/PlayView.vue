<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { socket } from '@/services/server-connections';
import { useRouter } from 'vue-router';
import { useMatchStore } from '@/stores/matchStore';

const router = useRouter();
const match = useMatchStore();

socket.on('matchFound', (matchId: string) => {
  match.id = matchId;
  router.push('/match');
});
</script>

<template>
  <NavBar />
</template>
