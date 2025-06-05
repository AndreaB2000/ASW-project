<script lang="ts" setup>
import { socket } from '@/services/server-connections';
import { useRouter } from 'vue-router';

const router = useRouter();

function playPVP() {
  console.log('enterQueue');
  socket.emit('requestMatch');
}

socket.on('matchFound', (matchId: string) => {
  router.push({ path: '/match', query: { id: matchId } });
});

</script>

<template>
  <p style="font-size: large">you are now logged in</p>
  <button @click="playPVP">Play</button>
  <button>Tutorial</button>
  <button>Leaderboard</button>
  <button @click="$router.push('/profile')">Profile</button>
</template>
