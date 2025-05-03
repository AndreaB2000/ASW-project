import { GRID_SIZE, MOVE_DELAY_MILLIS, sleep } from '@/utils/match';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMatchStore = defineStore('match', () => {
  const player1 = ref('');
  const player2 = ref('');
  const currentState = ref<any>({});
  const id = ref('');
  const turn = ref(player1.value);
  const winner = ref<string | null>(null);

  const moveInProgress = ref(false);

  async function applyMove(movingPlayer: string, x: number, y: number): Promise<void> {
    moveInProgress.value = true;
    currentState.value[x][y].pile.numberOfGrains += 1;

    const collapsingPiles: [x: number, y: number][] = [];

    do {
      await sleep(MOVE_DELAY_MILLIS);

      // Empties array
      collapsingPiles.length = 0;

      for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
          if (
            currentState.value[i][j].pile != null &&
            currentState.value[i][j].pile.numberOfGrains >= 4
          )
            collapsingPiles.push([i, j]);
        }
      }

      collapsingPiles.forEach(([i, j]) => {
        if (currentState.value[i][j].pile.numberOfGrains > 4) {
          currentState.value[i][j].pile.numberOfGrains =
            currentState.value[i][j].pile.numberOfGrains - 4;
        } else if (currentState.value[i][j].pile.numberOfGrains == 4) {
          currentState.value[i][j].pile = null;
        }

        [
          { x: (i - 1 + GRID_SIZE) % GRID_SIZE, y: j },
          { x: (i + 1) % GRID_SIZE, y: j },
          { x: i, y: (j - 1 + GRID_SIZE) % GRID_SIZE },
          { x: i, y: (j + 1) % GRID_SIZE },
        ].forEach(coord => {
          if (currentState.value[coord.x][coord.y].pile == null) {
            currentState.value[coord.x][coord.y].pile = { owner: movingPlayer, numberOfGrains: 1 };
          } else {
            currentState.value[coord.x][coord.y].pile.numberOfGrains += 1;
            currentState.value[coord.x][coord.y].pile.owner = movingPlayer;
          }
        });
      });
    } while (collapsingPiles.length != 0);
    moveInProgress.value = false;
  }

  async function changeTurn() {
    if (turn.value == player1.value) {
      turn.value = player2.value;
    } else {
      turn.value = player1.value;
    }
  }

  return {
    player1,
    player2,
    currentState,
    id,
    turn,
    moveInProgress,
    winner,
    applyMove,
    changeTurn,
  };
});
