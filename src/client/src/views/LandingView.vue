<script setup lang="ts">
</script>

<template>
  <section>
    <section class="title">
      <img src="../assets/landingIcon.svg"></img>
      <h1>SANDPILES</h1>
    </section>
    <section class="content">
      <section class="description">
        <p>
          Place your grains. Tip the balance. In this world of unstable equilibrium, every move can
          trigger a chain reaction. Conquer the board — one avalanche at a time.
        </p>
        <section class="buttons">
          <button style="background-color: #1EC6E0;">Play with BOT</button>
          <button style="background-color: #E0961E;">Login</button>
          <button>Tutorial</button>
          <button @click="$router.push('/registration')">Register</button>
        </section>
      </section>
      <img src="../assets/sandpiles-template-img.svg"></img>
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
