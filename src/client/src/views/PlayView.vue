<script setup lang="ts">
import {
  MDBNavbar,
  MDBNavbarItem,
  MDBNavbarBrand,
  MDBNavbarNav,
  MDBNavbarToggler,
  MDBIcon,
  MDBCollapse,
} from 'mdb-vue-ui-kit';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const collapse1 = ref(false);
const router = useRouter();
</script>

<template>
  <MDBNavbar expand="lg" bg="transparent" container>
    <MDBNavbarBrand>
      <img height="30" src="../assets/landingIcon.svg" alt="Landing Icon" loading="lazy" />
    </MDBNavbarBrand>
    <MDBNavbarToggler
      @click="collapse1 = !collapse1"
      target="#navbarSupportedContent"
    ></MDBNavbarToggler>
    <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
      <MDBNavbarNav class="mb-2 mb-lg-0">
        <MDBNavbarItem
          href="#matchmaking"
          linkClass="link-secondary"
          ><MDBIcon icon="gamepad" class="fas"></MDBIcon> Play</MDBNavbarItem
        >
        <MDBNavbarItem href="#tutorial" linkClass="link-secondary"
          ><MDBIcon icon="graduation-cap" class="fas"></MDBIcon> Tutorial</MDBNavbarItem
        >
        <MDBNavbarItem href="#leaderboard" linkClass="link-secondary"
          ><MDBIcon icon="poll" class="fas"></MDBIcon> Leaderboard</MDBNavbarItem
        >
        <MDBNavbarItem href="#profile" linkClass="link-secondary" class="d-block d-lg-none"
          ><MDBIcon icon="user" class="fas"></MDBIcon> Profile</MDBNavbarItem
        >
      </MDBNavbarNav>

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
  width: 1px;
  background-color: var(--mdb-body-color);
  margin: 0 0.5rem;
}
</style>
