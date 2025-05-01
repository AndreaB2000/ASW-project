<script setup lang="ts">
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
      const button = document.getElementById(`${x}-${y}`)
      if (button) {
        const cell = match.currentState[x][y];
        if (cell.pile == null) {
          button.innerHTML = '';
          button.classList.remove('player1')
          button.classList.remove('player2')
        } else {
          button.innerHTML = cell.pile.numberOfGrains;
          if (cell.pile.owner == match.player1) {
            button.classList.remove('player2');
            button.classList.add('player1');
          } else if (cell.pile.owner == match.player2) {
            button.classList.remove('player1');
            button.classList.add('player2');
          } else {
            console.error("Something went wrong.");
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
  <section>
    <section class="title">
      <img src="../assets/landingIcon.svg"></img>
      <h1>SANDPILES</h1>
    </section>
    <section class="content">
      <input type="text" v-model="user.username"/>
      <p>{{ match.player1 }}</p>
      <section class="board">
        <div class="grid">
          <div v-for="x in GRID_SIZE" :key="x" class="grid-row">
            <button
              v-for="y in GRID_SIZE"
              :key="`${x-1}-${y-1}`"
              :id="`${x-1}-${y-1}`"
              @click="handleButtonClick(x-1, y-1)"
              class="grid-button"
            ></button>
          </div>
        </div>
      </section>
      <p>{{ match.player2 }}</p>
    </section>
  </section>
</template>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .title {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 2vw;
    max-height: 20vh;

    h1 {
      font-size: 5rem;
      letter-spacing: 40%;
    }

    img {
      height: 10vh;
    }
  }

  .content {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 2vw;
    flex-wrap: wrap;

    .board {
      width: 80%;
      max-width: 600px;

      .grid {
        display: flex;
        flex-direction: column;
        gap: 5px;

        .grid-row {
          display: flex;
          gap: 5px;
          justify-content: center;
        }

        .grid-button {
          aspect-ratio: 1;
          width: 100%;
          max-width: 60px;
          min-width: 60px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          background-color: #f0f0f0;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          font-size: 0.8rem;
          padding: 0;

          &:hover {
            background-color: #7e7e7e !important;
          }
        }

        .player1 {
          background-color: green;
        }

        .player2 {
          background-color: blue;
        }
      }
    }

    .description {
      width: 35%;
      min-width: 300px;

      .buttons {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1vw;
        margin-top: 7vh;

        button {
          font-weight: bold;
          background-color: #f0f0f0;
          border: none;
          border-radius: 20px;
          padding: 3vh 2vw;
          font-size: 2rem;
          min-width: 276px;
          cursor: pointer;
          transition: background-color 0.3s ease;

          &:hover {
            background-color: #7e7e7e !important;
          }
        }
      }
    }

    img {
      width: 35%;
      min-width: 300px;
    }
  }
}
</style>
