<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { socket } from '@/services/server-connections';
import type { Account } from '../models/Account';

const accounts = ref<Account[]>([]);

onMounted(() => {
  socket.emit('getTopPlayers', (response: string) => {
    const data = JSON.parse(response);
    console.log(data);
    accounts.value = data;
  });
});
</script>

<template>
  <section>
    <section class="content">
      <section class="description">
        <h1>Leaderboard</h1>
        <!-- list the top players taken from players array variable -->
        <ul>
          <li v-for="(player, index) in accounts" :key="index">
            <p>{{ player.username }}: {{ player.rating }}</p>
          </li>
        </ul>
      </section>
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
