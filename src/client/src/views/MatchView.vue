<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import Match from '@/components/Match/Match.vue';
import MatchOver from '@/components/Match/MatchOver.vue';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-vue-ui-kit';
import { computed } from 'vue';
import { useMatchStore } from '@/stores/matchStore';

const isMatchOver = computed(() => match.winner != null && !match.moveInProgress);
const match = useMatchStore();
</script>

<template>
  <MDBRow style="min-height: 10vh">
    <Icon />
  </MDBRow>
  <MDBRow>
    <MDBCol>
      <Match v-if="!isMatchOver" />
      <MatchOver v-else />
    </MDBCol>
  </MDBRow>
</template>
