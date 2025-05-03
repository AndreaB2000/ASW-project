<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import Match from '@/components/Match.vue';
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdb-vue-ui-kit';
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useMatchStore } from '@/stores/matchStore';

const isMatchOver = computed(() => match.winner != null && !match.moveInProgress);

const user = useUserStore();
const match = useMatchStore();
</script>

<template>
  <MDBContainer fluid>
    <MDBRow center class="my-5">
      <MDBCol md="3">
        <Icon />
      </MDBCol>
      <MDBCol md="9"></MDBCol>
    </MDBRow>
    <div v-if="!isMatchOver">
      <Match />
    </div>
    <MDBRow center v-else>
      <h1>Match is over</h1>
      <p v-if="match.winner == user.username">You won!</p>
      <p v-else>{{ match.winner }} won</p>
    </MDBRow>
  </MDBContainer>
</template>
