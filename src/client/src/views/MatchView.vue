<script setup lang="ts">
import { socket } from '@/services/socket';
import { reactive, ref } from 'vue';

let match = reactive({
  player1: '',
  player2: '',
  state: [],
  moves: []
});

function sendMessage(topic: string, data: any = {}) {
  socket.emit(topic, (response: string) => {
    console.log(response);
  });
}

function updateMatch(response: any) {
  match.player1 = response.player1;
  match.player2 = response.player2;
  match.state = response.state;
  match.moves = response.moves;
}

socket.on('matchStart', () => {
  socket.emit('getMatch', (response: any) => {
    updateMatch(response);
  });
})

function handleButtonClick(x: number, y: number) {
  console.log(`Button clicked at coordinates: (${x}, ${y})`);
  socket.emit('matchmaking');
}

const gridSize = ref(9);
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
              @click="handleButtonClick(x-1, y-1)"
              class="grid-button"
            >
              ({{ x-1 }}, {{ y-1 }})
            </button>
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
        }

        .grid-button {
          aspect-ratio: 1;
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
          flex: 1;

          &:hover {
            background-color: #7e7e7e !important;
          }
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
