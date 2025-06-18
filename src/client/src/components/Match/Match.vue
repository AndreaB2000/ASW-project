<script setup lang="ts">
import PlayerInMatch from '@/components/Match/PlayerInMatch.vue';
import Grid from '@/components/Match/Grid.vue';
import { socket } from '@/services/server-connections';
import { MDBRow, MDBCol } from 'mdb-vue-ui-kit';
import { useMatchStore } from '@/stores/matchStore';
import { onMounted, onUnmounted } from 'vue';

const match = useMatchStore();

function getMatch(matchId: string) {
  socket.emit('getMatch', matchId, (error: any, matchData: any, whichPlayerAmI: number) => {
    if (error) {
      console.error('Error getting match', error);
      return;
    }
    match.currentState = matchData.initialState.state;
    match.player1 = matchData.player1;
    match.player2 = matchData.player2;
    match.turn = match.player1;
    match.whichPlayerAmI = whichPlayerAmI;
    match.myUsername = match.whichPlayerAmI == 1 ? match.player1 : match.player2;
  });
}

onMounted(() => {
  let lastMovePromise = Promise.resolve();
  socket.on('move', (movingPlayer: string, x: number, y: number) => {
    console.log('MOVE FROM SOCKET');
    lastMovePromise = lastMovePromise
      .then(async () => {
        console.log('Move received from server');
        await match.applyMove(movingPlayer, x, y);
      })
      .catch(err => {
        console.error('Error processing move:', err);
      });
  });

  socket.on('over', (winner: string) => {
    match.winner = winner;
    console.log(`The winner is ${winner}!`);
  });

  getMatch(match.id);
});

onUnmounted(() => {
  socket.off('move');
  socket.off('over');
});
</script>

<template>
  <!-- Small viewport -->
  <MDBRow class="d-xl-none mx-5 my-1" center>
    <Grid />
  </MDBRow>
  <MDBRow class="d-xl-none my-5" center>
    <MDBCol md="6" class="d-flex justify-content-center align-items-center">
      <PlayerInMatch class="player-in-match" :username="match.player1" />
    </MDBCol>
    <MDBCol md="6" class="d-flex justify-content-center align-items-center">
      <PlayerInMatch class="player-in-match" :username="match.player2" />
    </MDBCol>
  </MDBRow>

  <!-- Large viewport -->
  <MDBRow class="d-none d-xl-flex" center>
    <MDBCol md="3" class="d-flex justify-content-center align-items-center">
      <PlayerInMatch class="player-in-match" :username="match.player1" />
    </MDBCol>
    <MDBCol md="6" class="d-flex justify-content-center" style="aspect-ratio: 1">
      <Grid />
    </MDBCol>
    <MDBCol md="3" class="d-flex justify-content-center align-items-center">
      <PlayerInMatch class="player-in-match" :username="match.player2" />
    </MDBCol>
  </MDBRow>
</template>

<style scoped lang="scss">
input {
  width: 20%;
}

.player-in-match {
  width: 60%;
}
</style>
