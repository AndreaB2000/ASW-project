<script setup lang="ts">
import {
  MDBCard,
  MDBCardImg,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
} from 'mdb-vue-ui-kit';

import userPlaceholder from '@/assets/user-placeholder.jpg';

defineProps(['username']);
// const glicko = defineProps(['glicko']);
// const timeLeft = defineProps(['timeLeft']);
</script>

<template>
  <div>
    <MDBCard text="center">
      <MDBCardTitle>{{ username }}</MDBCardTitle>
      <MDBCardImg :src="userPlaceholder" top alt="..." />
      <MDBCardBody>
        <MDBCardText>Rank: 1000</MDBCardText>
        <MDBCardText>+400 -150</MDBCardText>
        <MDBBtn tag="a" href="#!" color="primary">Profile</MDBBtn>
      </MDBCardBody>
    </MDBCard>
  </div>
</template>
