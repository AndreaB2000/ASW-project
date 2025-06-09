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
import { socket } from '@/services/server-connections';
import { useRouter } from 'vue-router';

const collapse1 = ref(false);
const router = useRouter();
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
        <MDBNavbarItem href="#playpvp" linkClass="link-secondary" @click="playPVP"
          ><MDBIcon icon="gamepad" class="fas"></MDBIcon> Play PVP</MDBNavbarItem
        >
        <MDBNavbarItem href="#playbot" linkClass="link-secondary" @click="playWithBot"
          ><MDBIcon icon="gamepad" class="fas"></MDBIcon> Play against bot</MDBNavbarItem
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

      <div class="d-none d-lg-block">
        <img
          src="https://mdbootstrap.com/img/Photos/Avatars/img (31).jpg"
          class="rounded-circle me-2"
          height="22"
          alt=""
          loading="lazy"
        />
      </div>
    </MDBCollapse>
  </MDBNavbar>
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
