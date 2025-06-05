<script setup lang="ts">
  import {
    MDBNavbar,
    MDBNavbarItem,
    MDBNavbarBrand,
    MDBNavbarNav,
    MDBNavbarToggler,
    MDBIcon,
    MDBCollapse,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem
  } from 'mdb-vue-ui-kit';
  import { ref } from "vue";
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

  const toggler = ref(false);
  const profileToggler = ref(false);
</script>

<template>
  <MDBNavbar expand="lg" bg="transparent" container>
    <MDBNavbarBrand>
      <img
        height="30"
        src="../assets/landingIcon.svg"
        alt="Landing Icon"
        loading="lazy"
      />
    </MDBNavbarBrand>
    <MDBNavbarToggler
      @click="toggler = !toggler"
      target="#navbarSupportedContent"
    ></MDBNavbarToggler>
    <MDBCollapse v-model="toggler" id="navbarSupportedContent">
      <MDBNavbarNav class="mb-2 mb-lg-0">
        <MDBNavbarItem href="#dashboard" linkClass="link-secondary" @click="playPVP"><MDBIcon icon="gamepad" class="fas"></MDBIcon> Play</MDBNavbarItem>
        <MDBNavbarItem href="#tutorial" linkClass="link-secondary"><MDBIcon icon="graduation-cap" class="fas"></MDBIcon> Tutorial</MDBNavbarItem>
        <MDBNavbarItem href="#leaderboard" linkClass="link-secondary"><MDBIcon icon="poll" class="fas"></MDBIcon> Leaderboard</MDBNavbarItem>
        <MDBNavbarItem href="#profile" linkClass="link-secondary" class="d-block d-lg-none"><MDBIcon icon="user" class="fas"></MDBIcon> Profile</MDBNavbarItem>
        <MDBNavbarItem href="#logout" linkClass="link-secondary" class="d-block d-lg-none"><MDBIcon icon="sign-out-alt" class="fas"></MDBIcon> Logout</MDBNavbarItem>
      </MDBNavbarNav>

      <div class="d-none d-lg-block">
        <MDBNavbarItem class="me-3 me-lg-0 dropdown">
        <MDBDropdown v-model="profileToggler">
          <MDBDropdownToggle tag="a" class="nav-link" @click="profileToggler = !profileToggler">
            <img
              src="https://mdbootstrap.com/img/Photos/Avatars/img (31).jpg"
              class="rounded-circle me-2"
              height="22"
              alt="profile image"
              loading="lazy"
            />
          </MDBDropdownToggle>
          <MDBDropdownMenu>
            <MDBDropdownItem href="#">Profile</MDBDropdownItem>
            <MDBDropdownItem href="#">Logout</MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
      </MDBNavbarItem>
      </div>
    </MDBCollapse>
  </MDBNavbar>
</template>
