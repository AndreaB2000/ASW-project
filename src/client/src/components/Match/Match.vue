<script setup lang="ts">
import PlayerInMatch from '@/components/Match/PlayerInMatch.vue';
import Pile from '@/components/Match/Pile.vue';
import { socket } from '@/services/socket';
import { MDBRow, MDBCol } from 'mdb-vue-ui-kit';
import { useUserStore } from '@/stores/userStore';
import { useMatchStore } from '@/stores/matchStore';
import { GRID_SIZE } from '@/utils/match';

// Define the matchId prop
const props = defineProps<{
  matchId: string; // Change to number if your matchId is numeric
}>();

const user = useUserStore();
const match = useMatchStore();

function getMatch(matchId: string) {
  socket.emit('getMatch', matchId, (error: any, matchData: any) => {
    if (error) {
      console.error('Error getting match', error);
      return;
    }
    match.currentState = matchData.initialState.state;
    match.player1 = matchData.player1;
    match.player2 = matchData.player2;
  });
}

// socket.on('matchStart', (matchId: string) => {
  match.id = props.matchId;
  getMatch(props.matchId);
// });

socket.on('move', async (movingPlayer: string, x: number, y: number) => {
  console.log('Move received from server');
  await match.applyMove(movingPlayer, x, y);
  await match.changeTurn();
});

socket.on('over', (winner: string) => {
  match.winner = winner;
  console.log('The winner is', winner, '!');
});

function handleButtonClick(x: number, y: number) {
  if (!match.moveInProgress) {
    console.log(`Pressed cell ${x}, ${y}. Cell:`, match.currentState[x][y]);
    if (document.getElementById(`${x}-${y}`)?.classList.contains(user.username)) {
      socket.emit('addMove', match.id, user.username, x, y);
    }
  }
  console.log(
    match?.currentState?.[x]?.[y]?.pile?.owner ?? null,
    '=',
    match?.player1,
    '? -> player1',
  );
  console.log(
    match?.currentState?.[x]?.[y]?.pile?.owner ?? null,
    '=',
    match?.player2,
    '? -> player2',
  );
}

</script>

<template>
  <MDBRow center class="my-5">
    <MDBCol md="3" class="d-flex justify-content-center align-items-center">
      <PlayerInMatch :username="match.player1" />
    </MDBCol>
    <MDBCol md="6" class="d-flex justify-content-center">
      <div
        class="grid d-grid"
        :style="`grid-template-columns: repeat(${GRID_SIZE}, 1fr);`"
        style="aspect-ratio: 1; width: fit-content"
      >
        <button
          v-for="index in GRID_SIZE * GRID_SIZE"
          :key="index"
          :id="`${Math.floor((index - 1) / GRID_SIZE)}-${(index - 1) % GRID_SIZE}`"
          @click="handleButtonClick(Math.floor((index - 1) / GRID_SIZE), (index - 1) % GRID_SIZE)"
          class="grid-button"
          :class="[
            (match?.currentState?.[Math.floor((index - 1) / GRID_SIZE)]?.[(index - 1) % GRID_SIZE]
              ?.pile?.owner ?? null) == match?.player1
              ? 'player1'
              : (match?.currentState?.[Math.floor((index - 1) / GRID_SIZE)]?.[
                    (index - 1) % GRID_SIZE
                  ]?.pile?.owner ?? null) == match?.player2
                ? 'player2'
                : '',
            (match?.currentState?.[Math.floor((index - 1) / GRID_SIZE)]?.[(index - 1) % GRID_SIZE]
              ?.pile?.owner ?? null) == match.turn
              ? 'inactive'
              : '',
          ]"
        >
          <Pile
            :number-of-grains="
              match?.currentState?.[Math.floor((index - 1) / GRID_SIZE)]?.[(index - 1) % GRID_SIZE]
                ?.pile?.numberOfGrains ?? 0
            "
          />
        </button>
      </div>
    </MDBCol>
    <MDBCol md="3" class="d-flex justify-content-center align-items-center">
      <PlayerInMatch :username="match.player2" />
    </MDBCol>
  </MDBRow>
  <MDBRow center class="my-5">
    <input type="text" v-model="user.username" />
  </MDBRow>
</template>

<style scoped lang="scss">
@use 'sass:color';

input {
  width: 20%;
}

.grid-button {
  aspect-ratio: 1;
  width: 80px;
  font-weight: bold;
  background-color: #707070;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.8rem;
  margin: 2px;
}

@mixin player-styles($color) {
  background-color: $color;

  &.inactive {
    background-color: color.adjust($color, $lightness: -20%);
  }
}

$player1color: #42cc42;
$player2color: #2e4aff;

.player1 {
  @include player-styles($player1color);
}

.player2 {
  @include player-styles($player2color);
}
</style>
