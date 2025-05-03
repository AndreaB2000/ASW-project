<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import Match from '@/components/Match.vue';
import MatchOver from '@/components/MatchOver.vue';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-vue-ui-kit';
import { computed } from 'vue';
import { useMatchStore } from '@/stores/matchStore';

const isMatchOver = computed(() => match.winner != null && !match.moveInProgress);

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
    <Match v-if="!isMatchOver" />
    <MatchOver v-else />
  </MDBContainer>
</template>
