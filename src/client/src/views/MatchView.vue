<script setup lang="ts">
import { socket } from '@/services/socket';
import { reactive, ref } from 'vue';

const gridSize = 9;

let match = reactive<any>({});

function updateMatch(matchId: string) {
  socket.emit('getMatch', matchId, (error: any, matchData: any) => {
    if (error) {
      console.error('Error getting match', error);
      return;
    }
    match = reactive(matchData);
    updateBoard();
  });
}

function updateBoard() {
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const button = document.getElementById(`${x}-${y}`)
      if (button) {
        const cell = match.initialState.state[x][y];
        if (cell.pile == null) {
          button.innerHTML = '';
          button.classList.remove('player1')
          button.classList.remove('player2')
        } else {
          button.innerHTML = cell.pile.numberOfGrains;
          button.classList.add(cell.pile.owner == match.player1 ? 'player1' : 'player2')
        }
      }
    }
  }
}

socket.on('matchStart', (matchId) => {
  updateMatch(matchId)
})

function handleButtonClick(x: number, y: number) {
  /* if (document.getElementById(`${x}-${y}`)?.classList.contains(MY_USERNAME)) {
    socket.emit('addMove', x, y)
    // Move animation
  } */
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
      <p>{{ match.player1 }}</p>
      <section class="board">
        <div class="grid">
          <div v-for="x in gridSize" :key="x" class="grid-row">
            <button
              v-for="y in gridSize"
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
          aspect-ratio: 1; // Mantiene il rapporto 1:1
          width: 100%; // Occupa tutto lo spazio disponibile nel flex
          max-width: 60px; // Limita la larghezza massima
          min-width: 60px; // Limita la larghezza minima
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
