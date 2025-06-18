<script setup lang="ts">
import { useMatchStore } from '@/stores/matchStore';
import { MDBRow, MDBCol, MDBContainer, MDBBtn } from 'mdb-vue-ui-kit';
import { onUnmounted } from 'vue';

const match = useMatchStore();
const myUsername = match.whichPlayerAmI == 1 ? match.player1 : match.player2;

onUnmounted(() => {
  match.$reset();
});
</script>

<template>
  <MDBContainer class="vh-75 d-flex justify-content-center">
    <MDBCol style="height: fit-content; width: fit-content">
      <MDBRow
        class="justify-content-center align-items-center text-center"
        style="min-height: 17vh"
      >
        <h1>Match is over</h1>
      </MDBRow>
      <MDBRow class="d-flex flex-column align-content-center" style="min-height: 35vh">
        <MDBRow
          v-if="match.winner == myUsername"
          class="justify-content-center align-items-center sub-element"
          style="border-color: green; color: green"
        >
          <p>You won!</p>
        </MDBRow>
        <MDBRow
          v-else
          class="justify-content-center align-items-center sub-element"
          style="border-color: red; color: red"
        >
          <p>{{ match.winner }} won</p>
        </MDBRow>
        <MDBRow
          class="justify-content-center align-items-center sub-element"
          style="border-color: darkorange; color: darkorange"
        >
          <p id="elo">Score</p>
        </MDBRow>
      </MDBRow>
      <MDBRow
        class="justify-content-center align-items-center text-center"
        style="min-height: 10vh"
      >
        <MDBBtn color="primary" class="w-25 py-3" @click="$router.push('/play')">Back</MDBBtn>
      </MDBRow>
    </MDBCol>
  </MDBContainer>
</template>

<style lang="scss" scoped>
.sub-element {
  align-content: center;
  border: 7px solid green;
  border-radius: 15px;
  max-width: 25vw;
  max-height: 25vh;
  margin: 2%;
  padding: 3%;
}

h1 {
  font-size: 60px;
  font-weight: bold;
}

p {
  font-size: 40px;
  text-align: center;
}
</style>
