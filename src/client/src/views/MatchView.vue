<script setup lang="ts">
import Icon from '@/components/Icon.vue';
import PlayerInMatch from '../components/PlayerInMatch.vue';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-vue-ui-kit';
import { socket } from '@/services/socket';
import { useUserStore } from '@/stores/userStore';
import { useMatchStore } from '@/stores/matchStore';
import { GRID_SIZE } from '@/utils/match';

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
    updateBoard();
  });
}

function updateBoard() {
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      const button = document.getElementById(`${x}-${y}`);
      if (button) {
        const cell = match.currentState[x][y];
        button.classList.remove('player1', 'player2', 'inactive');
        if (cell.pile == null) {
          button.innerHTML = '';
        } else {
          button.innerHTML = cell.pile.numberOfGrains;
          if (cell.pile.owner == match.player1) {
            button.classList.add('player1');
          } else if (cell.pile.owner == match.player2) {
            button.classList.add('player2');
          }

          if (cell.pile.owner != match.turn) {
            button.classList.remove('inactive');
          } else {
            button.classList.add('inactive');
          }
        }
      }
    }
  }
}

socket.on('matchStart', (matchId: string) => {
  match.id = matchId;
  getMatch(matchId);
});

socket.on('move', async (movingPlayer: string, x: number, y: number) => {
  console.log('Move received from server');
  await match.applyMove(movingPlayer, x, y, updateBoard);
  await match.changeTurn();
  updateBoard();
});

function handleButtonClick(x: number, y: number) {
  if (!match.moveInProgress) {
    console.log(`Pressed cell ${x}, ${y}. Cell:`, match.currentState[x][y]);
    if (document.getElementById(`${x}-${y}`)?.classList.contains(user.username)) {
      socket.emit('addMove', match.id, user.username, x, y);
    }
  }
}

socket.emit('matchmaking');
</script>

<template>
  <MDBContainer fluid>
    <MDBRow center class="my-5">
      <MDBCol md="3">
        <Icon />
      </MDBCol>
      <MDBCol md="9"></MDBCol>
    </MDBRow>
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
          ></button>
        </div>
      </MDBCol>
      <MDBCol md="3" class="d-flex justify-content-center align-items-center">
        <PlayerInMatch :username="match.player2" />
      </MDBCol>
    </MDBRow>
    <MDBRow center class="my-5">
      <input type="text" v-model="user.username" />
    </MDBRow>
  </MDBContainer>
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
  background-color: #f0f0f0;
  border: none;
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
