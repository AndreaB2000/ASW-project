<script setup lang="ts">
import Pile from '@/components/Match/Pile.vue';
import { socket } from '@/services/server-connections';
import { GRID_SIZE } from '@/utils/match';
import { useMatchStore } from '@/stores/matchStore';

const match = useMatchStore();

function handleButtonClick(x: number, y: number) {
  if (!match.moveInProgress) {
    console.log(`Pressed cell ${x}, ${y}. Cell:`, match.currentState[x][y]);
    const p: string =
      match.myUsername == match.player1
        ? 'player1'
        : match.myUsername == match.player2
          ? 'player2'
          : '';
    if (document.getElementById(`${x}-${y}`)?.classList.contains(p)) {
      console.log('Emitting move');
      socket.emit('addMove', match.id, match.myUsername, x, y);
    }
  }
}
</script>

<template>
  <div
    class="grid d-grid"
    :style="`grid-template-columns: repeat(${GRID_SIZE}, 1fr);`"
    style="aspect-ratio: 1; height: 80%; box-sizing: unset"
  >
    <button
      v-for="index in GRID_SIZE * GRID_SIZE"
      :key="index"
      :id="`${Math.floor((index - 1) / GRID_SIZE)}-${(index - 1) % GRID_SIZE}`"
      @click="handleButtonClick(Math.floor((index - 1) / GRID_SIZE), (index - 1) % GRID_SIZE)"
      class="grid-button"
      :class="[
        (match?.currentState?.[Math.floor((index - 1) / GRID_SIZE)]?.[(index - 1) % GRID_SIZE]?.pile
          ?.owner ?? null) == match?.player1
          ? 'player1'
          : (match?.currentState?.[Math.floor((index - 1) / GRID_SIZE)]?.[(index - 1) % GRID_SIZE]
                ?.pile?.owner ?? null) == match?.player2
            ? 'player2'
            : '',
        (match?.currentState?.[Math.floor((index - 1) / GRID_SIZE)]?.[(index - 1) % GRID_SIZE]?.pile
          ?.owner ?? null) != match.turn
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
</template>

<style lang="scss">
@use 'sass:color';

.grid-button {
  aspect-ratio: 1;
  font-weight: bold;
  background-color: #707070;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  font-size: 0.8rem;
  margin: 5%;
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
