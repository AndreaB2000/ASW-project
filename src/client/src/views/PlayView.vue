<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { server, socket } from '@/services/server-connections';
import { useUserStore } from '@/stores/userStore';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBFooter } from 'mdb-vue-ui-kit';
import { onMounted, ref, type Ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

// TODO | BASO: fill these values with real data from the server
const lastOpponentUsername: Ref<string | null> = ref("Unknown");
const lastOpponentEloPoints = ref(0);
const lastMatchEnding = ref("Won");

// TODO | BASO: fill these values with real data from the server
onMounted(async () => {
  if (userStore.rank === -1) {
    try {
      const rankRes = await server.get('/account/ranking');
      userStore.rank = rankRes.data.rank;
      userStore.eloPoints = rankRes.data.elo;
    } catch (error) {
      console.error('Error fetching last match:', error);
    }
  }
});
</script>

<template>
  <NavBar />
  <div class="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center px-3">
    <div class="d-flex flex-column flex-md-row align-items-center mt-4 mt-md-0">
      <img
        class="landing-icon"
        src="../assets/landingIcon.svg"
        alt="Landing Icon"
        loading="lazy"
      />
      <h1 class="display-1 fw-bold text-uppercase mt-2 mt-md-0 ms-md-3">sandpiles</h1>
    </div>
    <h2 class="subtitle display-6 text-nowrap mt-2 mb-8">The sand stacking multiplayer game</h2>
    <h3 class="fw-bold text-uppercase spaced-title">start a match!</h3>
    <div class="d-grid d-md-flex justify-content-center align-items-center gap-2 mt-4">
      <MDBBtn class="text-uppercase" color="primary" @click="$router.push('/matchmaking')">Ranked</MDBBtn>
      <div class="divider d-none d-md-block"></div>
      <MDBBtn class="text-uppercase" color="primary">Bot</MDBBtn>
    </div>
    <p class="text-uppercase mt-5 fs-3">current ranking: {{ userStore.rank }}</p>
    <p class="text-uppercase fs-3">current elo: {{ userStore.eloPoints }}</p>
  </div>

  <MDBFooter class="fixed-bottom align-items-center d-flex justify-content-center" style="background-color: rgba(0, 0, 0, 0) !important;">
    <MDBCard v-if="lastOpponentUsername" class="w-100 mx-3 mb-3" style="max-width: 600px;">
      <MDBCardBody>
        <MDBCardTitle class="text-uppercase">Last game</MDBCardTitle>
        <MDBCardText>
          You <span class="fw-bold">{{ lastMatchEnding }}</span> against
          <span class="fw-bold">{{ lastOpponentUsername }}</span> (<span class="fw-bold">{{ lastOpponentEloPoints }}</span>)
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
