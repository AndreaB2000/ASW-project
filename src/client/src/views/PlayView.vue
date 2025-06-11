<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { socket } from '@/services/server-connections';
import { useRouter } from 'vue-router';
import { useMatchStore } from '@/stores/matchStore';
import { ref } from 'vue';
import { MDBBadge, MDBListGroupItem, MDBListGroup, MDBContainer } from 'mdb-vue-ui-kit';

// TODO: Here I have to input the actual username of the logged user
const myUsername = 'beginner';

const router = useRouter();
const match = useMatchStore();
const matches = ref<
  { player1: string; player2: string; winner: string | null; creationDate: Date }[]
>([]);

socket.on('matchFound', (matchId: string) => {
  match.id = matchId;
  router.push('/match');
});

socket.emit('matchHistory', myUsername, (matchIds: string[]) => {
  matchIds.forEach((id: string) => {
    socket.emit('getMatch', id, (error: any, matchData: any, whichPlayerAmI: number) => {
      if (error) {
        console.error('Error getting match', error);
        return;
      }
      matches.value.push({
        player1: matchData.player1,
        player2: matchData.player2,
        winner: matchData.winner,
        creationDate: matchData.creationDate,
      });
    });
  });
});
</script>

<template>
  <NavBar />
  <MDBContainer>
    <MDBListGroup md="4" class="my-5 center">
      <MDBListGroupItem
        v-for="(match, index) in matches"
        :key="index"
        class="d-flex justify-content-between align-items-center"
      >
        <div>
          <div class="fw-bold">{{ match.player1 }} VS {{ match.player2 }}</div>
          <div class="text-muted">
            {{ match.creationDate }} - winner: {{ match.winner }}, - myUsername: {{ myUsername }}
          </div>
        </div>
        <MDBBadge v-if="match.winner == null" class="badge-warning rounded-pill"
          >In progress</MDBBadge
        >
        <MDBBadge v-else-if="match.winner == myUsername" class="badge-success rounded-pill"
          >Won</MDBBadge
        >
        <MDBBadge v-else class="badge-danger rounded-pill">Lost</MDBBadge>
      </MDBListGroupItem>
    </MDBListGroup>
  </MDBContainer>
</template>
