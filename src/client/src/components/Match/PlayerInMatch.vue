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
import { onMounted, ref } from 'vue';
import { socket } from '@/services/server-connections';

const props = defineProps<{ username: string; ratingChange: number }>();

const rating = ref(0);

onMounted(() => {
  socket.emit('getRating', props.username, (userRating: number) => {
    rating.value = userRating;
    console.log(userRating);
  });
});
</script>

<template>
  <div>
    <MDBCard text="center">
      <MDBCardTitle>{{ username }}</MDBCardTitle>
      <MDBCardImg :src="userPlaceholder" top alt="..." />
      <MDBCardBody>
        <MDBCardText>Rating: {{ rating }}</MDBCardText>
        <MDBCardText>Prize: {{ props.ratingChange }}</MDBCardText>
        <MDBBtn tag="a" href="#!" color="primary">Profile</MDBBtn>
      </MDBCardBody>
    </MDBCard>
  </div>
</template>
