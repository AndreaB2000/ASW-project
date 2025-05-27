<script setup lang="ts">
import { useMatchStore } from '@/stores/matchStore';
import { MDBRow } from 'mdb-vue-ui-kit';

const match = useMatchStore();
const myUsername = match.whichPlayerAmI == 1 ? match.player1 : match.player2;
</script>

<template>
  <MDBRow center>
    <h1>Match is over</h1>
    <p v-if="match.winner == myUsername">You won!</p>
    <p v-else>{{ match.winner }} won</p>
  </MDBRow>
</template>
