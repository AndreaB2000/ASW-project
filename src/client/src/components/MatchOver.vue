<script setup lang="ts">
import { useUserStore } from '@/stores/userStore';
import { useMatchStore } from '@/stores/matchStore';
import { MDBRow } from 'mdb-vue-ui-kit';

const user = useUserStore();
const match = useMatchStore();
</script>

<template>
  <MDBRow center>
    <h1>Match is over</h1>
    <p v-if="match.winner == user.username">You won!</p>
    <p v-else>{{ match.winner }} won</p>
  </MDBRow>
</template>
