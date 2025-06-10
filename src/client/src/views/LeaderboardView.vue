<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { socket } from '@/services/server-connections';

const accounts = ref<Object[]>([]);

onMounted(() => {
  socket.emit('getTopPlayers', (response: string) => {
    try {
      const data = JSON.parse(response);
      console.log('Received top players:', data);
      if (Array.isArray(data)) {
        accounts.value = data;
      } else {
        accounts.value = [];
      }
    } catch (e) {
      accounts.value = [];
    }
  });
});
</script>

<template>
  <section class="leaderboard-container">
    <div class="leaderboard-card">
      <h1 class="leaderboard-title">Leaderboard</h1>
      <ul class="leaderboard-list">
        <li v-for="(player, index) in accounts" :key="index" class="leaderboard-item">
          <span class="rank">#{{ index + 1 }}</span>
          <span class="username">{{ player.username }}</span>
          <span class="rating">{{ player.rating}}</span>
        </li>
      </ul>
      <div v-if="accounts.length === 0" class="empty-message">No players found.</div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.leaderboard-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 60vh;
  background: transparent;
  padding: 2rem 0;
}

.leaderboard-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.08);
  padding: 2rem 2.5rem;
  min-width: 340px;
  max-width: 400px;
  width: 100%;
}

.leaderboard-title {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.leaderboard-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.leaderboard-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #eee;
  font-size: 1.1rem;
  font-weight: 500;
  color: #444;
  transition: background 0.2s;
}

.leaderboard-item:last-child {
  border-bottom: none;
}

.rank {
  font-weight: bold;
  color: #6c63ff;
  margin-right: 1rem;
  min-width: 2.5rem;
  text-align: right;
}

.username {
  flex: 1;
  margin-left: 0.5rem;
}

.rating {
  font-family: monospace;
  color: #888;
  margin-left: 1rem;
}

.empty-message {
  text-align: center;
  color: #aaa;
  margin-top: 2rem;
  font-size: 1.1rem;
}
</style>
