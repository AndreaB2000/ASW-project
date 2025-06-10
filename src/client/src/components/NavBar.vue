<script setup lang="ts">
import { socket } from '@/services/server-connections';
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

const collapse1 = ref(false);

function playPVP() {
  console.log('enterQueue');
  socket.emit('requestMatch');
}

function playWithBot() {
  console.log('match with bot requested');
  socket.emit('requestMatchWithBot');
}
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
