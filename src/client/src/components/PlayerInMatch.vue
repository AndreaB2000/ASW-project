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
  <div style="width: 50%">
    <MDBCard text="center">
      <MDBCardTitle>{{ username }}</MDBCardTitle>
      <MDBCardImg :src="userPlaceholder" top alt="..." />
      <MDBCardBody>
        <MDBCardText>
          Some quick example text to build on the card title and make up the bulk of the card's
          content.
        </MDBCardText>
        <MDBBtn tag="a" href="#!" color="primary">Button</MDBBtn>
      </MDBCardBody>
    </MDBCard>
  </div>
</template>
