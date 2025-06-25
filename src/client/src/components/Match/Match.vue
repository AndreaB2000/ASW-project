<script setup lang="ts">
import PlayerInMatch from '@/components/Match/PlayerInMatch.vue';
import Grid from '@/components/Match/Grid.vue';
import { socket } from '@/services/server-connections';
import { MDBRow, MDBCol } from 'mdb-vue-ui-kit';
import { useMatchStore } from '@/stores/matchStore';
import { onMounted, onUnmounted, ref } from 'vue';
import { GameResult, getRatingChange } from '@/services/rating';
import { useUserStore } from '@/stores/userStore';

const match = useMatchStore();
const user = useUserStore();

const myRatingChange = ref<number>(0);
const opponentRatingChange = ref<number>(0);

onMounted(() => {
  let lastMovePromise = Promise.resolve();
  socket.on('move', (movingPlayer: string, x: number, y: number) => {
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

  socket.emit('getMatch', match.id, (error: any, matchData: any, whichPlayerAmI: number) => {
    if (error) {
      console.error('Error getting match', error);
    } else {
      match.currentState = matchData.initialState.state;
      match.player1 = matchData.player1;
      match.player2 = matchData.player2;
      match.turn = match.player1;
      match.whichPlayerAmI = whichPlayerAmI;
      user.username = match.whichPlayerAmI == 1 ? match.player1 : match.player2;
    }

    socket.emit('getRating', match.player1, (player1rating: number) => {
      if (match.player2 != 'bot') {
        socket.emit('getRating', match.player2, (player2rating: number) => {
          match.player2RatingChange = getRatingChange(
            player1rating,
            player2rating,
            GameResult.WinA,
          );
          match.player1RatingChange = getRatingChange(
            player2rating,
            player1rating,
            GameResult.WinA,
          );
          if (match.whichPlayerAmI == 0) {
            myRatingChange.value = match.player1RatingChange;
            opponentRatingChange.value = match.player2RatingChange;
          } else {
            myRatingChange.value = match.player2RatingChange;
            opponentRatingChange.value = match.player1RatingChange;
          }
        });
      } else {
        myRatingChange.value = 0;
        opponentRatingChange.value = 0;
      }
    });
  });
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
      <PlayerInMatch
        class="player-in-match"
        :username="match.player1"
        :rating-change="match.player1RatingChange"
      />
    </MDBCol>
    <MDBCol md="6" class="d-flex justify-content-center align-items-center">
      <PlayerInMatch
        class="player-in-match"
        :username="match.player2"
        :rating-change="match.player2RatingChange"
      />
    </MDBCol>
  </MDBRow>

  <!-- Large viewport -->
  <MDBRow class="d-none d-xl-flex" center>
    <MDBCol md="3" class="d-flex justify-content-center align-items-center">
      <PlayerInMatch
        class="player-in-match"
        :username="match.player1"
        :rating-change="match.player1RatingChange"
      />
    </MDBCol>
    <MDBCol md="6" class="d-flex justify-content-center" style="aspect-ratio: 1">
      <Grid />
    </MDBCol>
    <MDBCol md="3" class="d-flex justify-content-center align-items-center">
      <PlayerInMatch
        class="player-in-match"
        :username="match.player2"
        :rating-change="match.player2RatingChange"
      />
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
