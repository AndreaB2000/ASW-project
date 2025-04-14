<script setup lang="ts"></script>

<template>
  <img src="../assets/landingIcon.svg" alt="Landing Icon" />
  <section>
    <img src="../assets/sandpiles-template-img.svg" alt="Sandpiles Template" />
    <section>
      <h1>REGISTRER</h1>
      <form>
        <div>
          <label for="username">Username</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div>
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <div>
          <label for="repeat-password">Repeat Password</label>
          <input type="password" id="repeat-password" name="password" required />
        </div>
        <button type="submit">Register</button>
        <p>Already have an account?</p>
        <button type="button" @click="$router.push('/login')">Login</button>
      </form>
    </section>
  </section>
</template>
