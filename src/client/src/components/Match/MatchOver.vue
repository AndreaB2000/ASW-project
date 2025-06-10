<script setup lang="ts">
import { useMatchStore } from '@/stores/matchStore';
import { MDBRow, MDBCol, MDBContainer, MDBBtn } from 'mdb-vue-ui-kit';

const match = useMatchStore();
const myUsername = match.whichPlayerAmI == 1 ? match.player1 : match.player2;
const props = defineProps(['initialScore', 'delta']);
</script>

<template>
  <MDBContainer class="vh-100 d-flex justify-content-center">
    <MDBCol
      style="border: 3px solid gray; border-radius: 15px; height: fit-content; width: fit-content"
    >
      <MDBRow
        class="justify-content-center align-items-center text-center"
        style="min-height: 10vh"
      >
        <h1>Match is over</h1>
      </MDBRow>
      <MDBRow style="min-height: 50vh">
        <MDBCol md="6" class="d-flex justify-content-center align-items-center">
          <p v-if="match.winner == myUsername">You won!</p>
          <p v-else>{{ match.winner }} won</p>
        </MDBCol>
        <MDBCol md="6" class="d-flex justify-content-center align-items-center">
          <p>{{ props.initialScore }} elo score</p>
          <p>+{{ props.delta }}</p>
        </MDBCol>
      </MDBRow>
      <MDBRow
        class="justify-content-center align-items-center text-center"
        style="min-height: 10vh"
      >
        <MDBBtn color="primary" class="w-25 py-3" @click="$router.push('/play')">Back</MDBBtn>
      </MDBRow>
    </MDBCol>
  </MDBContainer>
  <!-- <MDBRow center>
    <MDButton></MDButton>
  </MDBRow> -->
</template>
