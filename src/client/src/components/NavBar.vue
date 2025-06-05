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
  import { server, socket } from '@/services/server-connections';
  import { useRouter } from 'vue-router';
  import DialogModal from '@/components/DialogModal.vue';

  const router = useRouter();
  const toggler = ref(false);
  const profileToggler = ref(false);
  const dialog = ref({
    visible: false,
    text: ''
  });

  function playPVP() {
    console.log('enterQueue');
    socket.emit('requestMatch');
  }
  function logout() {
    server.post('/account/logout').then(() => {
      console.log('Logged out successfully');
      router.push('/');
    }).catch((error) => {
      console.error('Logout failed:', error);
      dialog.value.text = error.response?.data?.message || 'Logout failed. Please try again.';
      dialog.value.visible = true;
    });
  }
  function buttonNotBinded() {
    dialog.value.text = 'This button is not binded yet';
    dialog.value.visible = true;
  }

  socket.on('matchFound', (matchId: string) => {
    router.push({ path: '/match', query: { id: matchId } });
  });
</script>

<template>
  <MDBNavbar expand="lg" bg="transparent" container>
    <MDBNavbarBrand>
      <img
        height="30"
        src="../assets/landingIcon.svg"
        alt="Landing Icon"
        loading="lazy"
        style="cursor: pointer;"
        @click="$router.push('/play')"
      />
    </MDBNavbarBrand>
    <MDBNavbarToggler
      @click="toggler = !toggler"
      target="#navbarSupportedContent"
    ></MDBNavbarToggler>
    <MDBCollapse v-model="toggler" id="navbarSupportedContent">
      <MDBNavbarNav class="mb-2 mb-lg-0">
        <MDBNavbarItem href="#" linkClass="link-secondary" @click="playPVP"><MDBIcon icon="gamepad" class="fas"></MDBIcon> Play</MDBNavbarItem>
        <MDBNavbarItem href="#" linkClass="link-secondary" @click="buttonNotBinded"><MDBIcon icon="graduation-cap" class="fas"></MDBIcon> Tutorial</MDBNavbarItem>
        <MDBNavbarItem href="#" linkClass="link-secondary" @click="buttonNotBinded"><MDBIcon icon="poll" class="fas"></MDBIcon> Leaderboard</MDBNavbarItem>
        <MDBNavbarItem
          href="#"
          linkClass="link-secondary"
          class="d-block d-lg-none"
          @click="$router.push('/profile')"
          ><MDBIcon icon="user" class="fas"></MDBIcon> Profile
        </MDBNavbarItem>
        <MDBNavbarItem
          href="#"
          linkClass="link-secondary"
          class="d-block d-lg-none"
          @click="logout"
          ><MDBIcon icon="sign-out-alt" class="fas"></MDBIcon> Logout
        </MDBNavbarItem>
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
            <MDBDropdownItem href="#" @click="$router.push('/profile')">Profile</MDBDropdownItem>
            <MDBDropdownItem href="#" @click="logout">Logout</MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
      </MDBNavbarItem>
      </div>
    </MDBCollapse>
  </MDBNavbar>
  <DialogModal v-model="dialog.visible" :text=dialog.text @close="dialog.visible = false" />
</template>
