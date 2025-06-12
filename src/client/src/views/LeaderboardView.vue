<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { socket } from '@/services/server-connections';
import NavBar from '@/components/NavBar.vue';
import {
  MDBCard,
  MDBCardBody,
  MDBCardImg,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBRow,
} from 'mdb-vue-ui-kit';
import noProfileImage from '@/assets/noProfileImage.webp';

const accounts = ref<Object[]>([]);

onMounted(() => {
  socket.emit('getTopPlayers', (response: string) => {
    try {
      const data = JSON.parse(response);
      console.log('Received top players:', data);
      if (Array.isArray(data)) {
        accounts.value = data;
      } else {
        accounts.value = [];
      }
    } catch (e) {
      accounts.value = [];
    }
  });
});
</script>

<template>
  <NavBar />
  <div
    class="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center px-3 mt-md-3"
  >
    <div class="d-flex flex-column flex-md-row align-items-center mt-4 mt-md-0">
      <h1 class="display-3 fw-bold text-uppercase mt-2 mt-md-0 ms-md-3 mb-4">leaderboard</h1>
    </div>
  </div>
  <MDBContainer>
    <MDBRow class="d-grid d-md-flex">
      <MDBCol class="text-center justify-content-center align-items-center">
        <p class="text-uppercase fw-bold mb-0 fs-1">You</p>
        <figure class="profile-image figure mb-0">
          <img
            src="../assets/noProfileImage.webp"
            class="figure-img img-fluid rounded shadow-3 darker-bg"
            alt="Profile"
            style="max-width: 50%"
          />
        </figure>
        <p class="text-uppercase fw-bold mb-0 fs-3 secondary-text">rating: 1500</p>
        <p class="text-uppercase fw-bold mb-0 fs-1">N° 1111</p>
      </MDBCol>
      <MDBCol class="text-center align-items-center d-md-none justify-content-center">
        <div class="divider my-4 d-block d-md-none"></div>
      </MDBCol>
      <MDBCol class="text-center justify-content-center align-items-center">
        <MDBCard
          v-for="(player, index) in accounts"
          :key="index"
          class="mb-3 img-fluid"
          style="max-width: 540px"
        >
          <MDBRow class="g-0">
            <MDBCol md="4" class="ms-0">
              <MDBCardImg
                class="bg-dark m-4"
                :src="noProfileImage"
                alt="Profile"
                style="max-width: 50%"
              />
            </MDBCol>
            <MDBCol md="8">
              <MDBCardBody>
                <MDBCardTitle>N° {{ index + 1 }}</MDBCardTitle>
                <MDBCardText> {{ player.username }} - {{ player.rating }}</MDBCardText>
              </MDBCardBody>
            </MDBCol>
          </MDBRow>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</template>

<style scoped>
.divider {
  width: 80vw;
  height: 1px;
  background-color: var(--mdb-body-color);
  margin-left: auto;
  margin-right: auto;
}
</style>
