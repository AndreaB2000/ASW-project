<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { server, socket } from '@/services/server-connections';
import { useRouter } from 'vue-router';
import { useMatchStore } from '@/stores/matchStore';
import { onMounted, onUnmounted, ref, type Ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBFooter } from 'mdb-vue-ui-kit';

const router = useRouter();
const match = useMatchStore();
const userStore = useUserStore();

const matches = ref<{ opponent: string; winner: string | null; creationDate: Date }[]>([]);

function playPVP() {
  console.log('enterQueue');
  socket.emit('requestMatch');
}

function playWithBot() {
  console.log('match with bot requested');
  socket.emit('requestMatchWithBot');
}

// TODO | BASO: Get this after getting the last match
const lastOpponentEloPoints = ref(0);

onMounted(async () => {
  socket.on('matchFound', (matchId: string) => {
    match.id = matchId;
    router.push({ path: '/match' });
  });

  console.log('user', userStore.username);

  socket.emit('matchHistory', userStore.username, (matchIds: string[]) => {
    console.log('matchIds', JSON.stringify(matchIds));
    matchIds.forEach((id: string) => {
      socket.emit('getMatch', id, (error: any, matchData: any, whichPlayerAmI: number) => {
        if (error) {
          console.error('Error getting match', error);
          return;
        }
        matches.value.push({
          opponent: userStore == matchData.player1 ? matchData.player2 : matchData.player1,
          winner: matchData.winner,
          creationDate: matchData.creationDate,
        });
      });
    });
  });
  // TODO | BASO : Get information about the current user
});

// DO NOT write this, or matchmaking time will be infinite
// onUnmounted(() => {
//   socket.off('matchFound');
// });
</script>

<template>
  <NavBar />

  <div
    class="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center px-3"
  >
    <div class="d-flex flex-column flex-md-row align-items-center mt-4 mt-md-0">
      <img class="landing-icon" src="../assets/landingIcon.svg" alt="Landing Icon" loading="lazy" />
      <h1 class="display-1 fw-bold text-uppercase mt-2 mt-md-0 ms-md-3">sandpiles</h1>
    </div>
    <h2 class="subtitle display-6 text-nowrap mt-2 mb-8">The sand stacking multiplayer game</h2>
    <h3 class="fw-bold text-uppercase spaced-title">start a match!</h3>
    <div class="d-grid d-md-flex justify-content-center align-items-center gap-2 mt-4">
      <MDBBtn class="text-uppercase" color="primary" @click="$router.push('/matchmaking')"
        >Ranked</MDBBtn
      >
      <div class="divider d-none d-md-block"></div>
      <MDBBtn class="text-uppercase" color="primary" @click="playWithBot">Bot</MDBBtn>
    </div>
    <p class="text-uppercase mt-5 fs-3">current ranking: {{ userStore.rank }}</p>
    <p class="text-uppercase fs-3">current elo: {{ userStore.eloPoints }}</p>
  </div>

  <MDBFooter
    class="fixed-bottom align-items-center d-flex justify-content-center"
    style="background-color: rgba(0, 0, 0, 0) !important"
  >
    <MDBCard
      v-if="matches.length > 0 && matches[0].opponent"
      class="w-100 mx-3 mb-3"
      style="max-width: 600px"
    >
      <MDBCardBody>
        <MDBCardTitle class="text-uppercase">Last game</MDBCardTitle>
        <MDBCardText>
          You <span class="fw-bold">{{ matches[0].winner }}</span> against
          <span class="fw-bold">{{ matches[0].opponent }}</span> (<span class="fw-bold">{{
            lastOpponentEloPoints
          }}</span
          >)
        </MDBCardText>
      </MDBCardBody>
    </MDBCard>
  </MDBFooter>
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
