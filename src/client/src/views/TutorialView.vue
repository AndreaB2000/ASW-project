<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { MDBContainer, MDBRow } from 'mdb-vue-ui-kit';
</script>

<template>
  <NavBar />
  <div
    class="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center px-3 mt-md-3"
  >
    <div class="d-flex flex-column flex-md-row align-items-center mt-4 mt-md-0">
      <h1 class="display-3 fw-bold text-uppercase mt-2 mt-md-0 ms-md-3 mb-4">tutorial</h1>
    </div>
  </div>
  <MDBContainer>
    <p class="text-center">Welcome to the tutorial for Sandpiles!</p>
    <p class="text-start">
      In this brief tutorial you will learn the basic rules of the sandpiles game.<br />Sandpiles is
      a two player game where each player takes turns placing sand grains on a 9x9 grid. The goal is
      to gain control of all of your opponent's piles.<br />Every turn you place a grain of sand on
      one of your piles. Your piles are rappresented by the blue or green colored squares on the
      board.
    </p>
    <figure class="figure">
      <img
        src="../assets/tutorial/blue topple before.png"
        class="img-fluid"
        alt="Example of a blue piles on the grid"
        style="max-width: 50%"
      />
      <figcaption class="figure-caption">
        The board shows 4 piles belonging to the blue player.
      </figcaption>
    </figure>
    <p class="text-start">
      The number of dots on the square rapresent the number of grains of sand in that pile.<br />In
      the previous example your pile has 3 grains of sand.<br />If you place a grain of sand on a
      pile that has 3 or more grains, it will collapse and distribute its grains to the adjacent
      piles.<br />If the adiacent piles where empty, they will become new piles belonging to you,
      with one grain of sand each.
    </p>
    <figure class="figure">
      <img
        src="../assets/tutorial/blue topple after.png"
        class="img-fluid"
        alt="Example of a collapsing pile with no neighboars"
        style="max-width: 50%"
      />
      <figcaption class="figure-caption">
        After placing a grain in the pile with 3 grains showed in the previous image, it would
        topple causing this new board state.
      </figcaption>
    </figure>
    <p class="text-start">
      If the neighboring piles are not empty they each get added a grain.<br />Also if a neighboring
      pile belongs to your opponent, aka it is green, then it is conquered by you, turning it
      blue.<br />This is how you gain control of your opponent's piles, and eventually win the game!
    </p>
    <MDBRow>
      <figure class="figure">
        <img
          src="../assets/tutorial/green topple before.png"
          class="img-fluid"
          alt="Example of a collapsing pile with neighboars, before"
          style="max-width: 50%"
        />
        <figcaption class="figure-caption">
          A green pile is about to topple over, notice how it has blue and green neighbors.
        </figcaption>
      </figure>
      <figure class="figure">
        <img
          src="../assets/tutorial/green topple after.png"
          class="img-fluid"
          alt="Example of a collapsing pile with neighboars, after"
          style="max-width: 50%"
        />
        <figcaption class="figure-caption">
          As the center pile has toppled over every neighbor gains an additional grain. Also all
          blue neighbors turn green.
        </figcaption>
      </figure>
    </MDBRow>
    <p class="text-start">
      Keep in mind that a pile toppling over can cause a chain reaction, where multiple piles
      collapse in a single turn, so be careful when placing your grains of sand!
    </p>
    <MDBRow>
      <figure class="figure">
        <img
          src="../assets/tutorial/chain before.png"
          class="img-fluid"
          alt="Example of a chain reaction, before"
          style="max-width: 50%"
        />
        <figcaption class="figure-caption">
          If the blue player places a grain on the center pile, it will topple over and cause a
          chain reaction.
        </figcaption>
      </figure>
      <figure class="figure">
        <img
          src="../assets/tutorial/chain after.png"
          class="img-fluid"
          alt="Example of a chain reaction, after"
          style="max-width: 50%"
        />
        <figcaption class="figure-caption">
          Now the board has completely changed with a single move!
        </figcaption>
      </figure>
    </MDBRow>
    <p class="text-start">
      The board behaves like a torus (packman style), meaning that the edges are connected to each
      other, so if you topple a pile on the top edge, it will affect the bottom edge pile as well,
      and the same goes for the left and right edges.<br />This means that you can use the edges to
      your advantage, for example by toppling a pile on the top edge to affect the bottom edge, or
      by placing a grain on the left edge to affect the right edge.<br />This can be useful to
      create chain reactions or to gain control of your opponent's piles.
    </p>
    <MDBRow>
      <figure class="figure">
        <img
          src="../assets/tutorial/tor before.png"
          class="img-fluid"
          alt="Example of toroidal effect, before"
          style="max-width: 50%"
        />
        <figcaption class="figure-caption">
          An edge pile is about to topple over, notice how it has a neighbor on the opposite edge.
        </figcaption>
      </figure>
      <figure class="figure">
        <img
          src="../assets/tutorial/tor after.png"
          class="img-fluid"
          alt="Example of toroidal effect, after"
          style="max-width: 50%"
        />
        <figcaption class="figure-caption">
          After the edge pile has toppled over, the opposite edge pile has been affected as well.
        </figcaption>
      </figure>
    </MDBRow>
  </MDBContainer>
</template>
