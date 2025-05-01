<script setup lang="ts">
import Icon from '@/components/Icon.vue';
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
        if (cell.pile == null) {
          button.innerHTML = '';
          button.classList.remove('player1');
          button.classList.remove('player2');
        } else {
          button.innerHTML = cell.pile.numberOfGrains;
          if (cell.pile.owner == match.player1) {
            button.classList.remove('player2');
            button.classList.add('player1');
          } else if (cell.pile.owner == match.player2) {
            button.classList.remove('player1');
            button.classList.add('player2');
          } else {
            console.error('Something went wrong.');
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
      <input type="text" v-model="user.username" />
    </MDBRow>
    <MDBRow center class="my-5">
      <MDBCol md="3">{{ match.player1 }}</MDBCol>
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
      <MDBCol md="3">{{ match.player2 }}</MDBCol>
    </MDBRow>
  </MDBContainer>
</template>

<style scoped lang="scss">
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

  /*&:hover {
    background-color: #7e7e7e !important;
  } */
}

.player1 {
  background-color: green;
}

.player2 {
  background-color: blue;
}
</style>
