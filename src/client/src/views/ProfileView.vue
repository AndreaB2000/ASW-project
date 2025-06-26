<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { socket, server } from '@/services/server-connections';
import NavBar from '@/components/NavBar.vue';
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
} from 'mdb-vue-ui-kit';
import DialogModal from '@/components/DialogModal.vue';
import { getMatchHistory, type Match } from '@/services/match-history';

const user = useUserStore();
const dialog = ref({
  visible: false,
  text: '',
});

const reactiveEmail = ref<string>('');
const isEditing = ref(false);
const matches = ref<Match[]>([]);

function changeProfile() {
  isEditing.value = true;
}

function saveProfile() {
  socket.emit(
    'change email',
    reactiveEmail.value,
    (result: { success: boolean; message: string }) => {
      if (!result.success) {
        console.error('Failed to change email:', result.message);
        dialog.value.text = result.message || 'Failed to change email. Please try again.';
        dialog.value.visible = true;
        reactiveEmail.value = user.email; // Reset to original email
        return;
      }
      isEditing.value = false;
      user.setEmail(reactiveEmail.value);
    },
  );
}

function exitChange() {
  isEditing.value = false;
  reactiveEmail.value = user.email;
}

onMounted(() => {
  server
    .get('/account/me')
    .then(async response => {
      user.setUsername(response.data.username);
      user.setEmail(response.data.email);

      matches.value = (await getMatchHistory(user.username)).reverse();

      socket.emit('getAccountInfo', (response: string) => {
        try {
          const data = JSON.parse(response);
          user.rank = data.position;
          user.eloPoints = data.rating;
        } catch (e) {
          console.error('Error parsing account info:', e);
        }
      });
    })
    .catch((error: Error) => {
      console.error('Failed to fetch user data:', error);
      dialog.value.text = 'Failed to fetch user data. Refresh the page.';
      dialog.value.visible = true;
    });
  reactiveEmail.value = user.email;
});
</script>

<template>
  <NavBar />
  <div
    class="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-center px-3 mt-md-5"
  >
    <div class="d-flex flex-column flex-md-row align-items-center mt-4 mt-md-0">
      <h1 class="display-1 fw-bold text-uppercase mt-2 mt-md-0 ms-md-3">profile</h1>
    </div>
  </div>
  <MDBContainer class="mt-4">
    <MDBRow class="justify-content-center text-center text-md-start align-items-center">
      <MDBCol
        cols="12"
        md="auto"
        class="d-flex justify-content-center justify-content-md-end mb-3 mb-md-0"
      >
        <figure class="profile-image figure mb-0">
          <img
            src="../assets/noProfileImage.webp"
            class="figure-img img-fluid rounded shadow-3 darker-bg"
            alt="Profile"
          />
        </figure>
      </MDBCol>
      <MDBCol cols="12" md="auto" class="mb-3 mb-md-0 ms-md-5">
        <p class="fs-1 fw-bold">{{ user.username }}</p>
        <MDBRow>
          <MDBCol>
            <p class="fs-2" v-if="!isEditing">{{ user.email }}</p>
            <MDBInput
              v-else
              v-model="reactiveEmail"
              label="Email"
              type="email"
              class="fs-4"
              white
            />
          </MDBCol>
          <MDBCol class="d-flex flex-column justify-content-center mb-3">
            <MDBBtn color="secondary" @click="changeProfile" v-if="!isEditing">Edit</MDBBtn>
            <MDBRow v-else>
              <MDBCol>
                <MDBBtn color="secondary" @click="saveProfile">Save</MDBBtn>
              </MDBCol>
              <MDBCol>
                <MDBBtn color="danger" @click="exitChange">Exit</MDBBtn>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
        <p class="text-uppercase fs-3">current ranking: {{ user.rank }}</p>
        <p class="text-uppercase fs-3">current elo: {{ user.eloPoints }}</p>
      </MDBCol>
      <div class="divider mt-4"></div>
      <h2 class="fw-bold text-uppercase mt-md-3">match history</h2>
      <MDBCard v-for="(match, i) in matches" :key="i" class="mt-4 mb-4">
        <MDBCardBody>
          <MDBRow>
            <MDBCol>
              <MDBCardTitle>Date: {{ match.creationDate }}</MDBCardTitle>
              <MDBCardText v-if="match.winner != null">
                {{ match.creationDate }} - You
                <span v-if="match.winner == user.username" class="fw-bold text-success"> won</span>
                <span v-else class="fw-bold text-danger"> lost</span>
                against
                <span class="fw-bold">{{ match.opponent }}</span>
                (<span class="fw-bold">{{
                  match.ratingDelta * (match.winner != user.username ? -1 : 1)
                }}</span
                >)
              </MDBCardText>
              <MDBCardText v-else>
                A match against <span class="fw-bold">{{ match.opponent }}</span> is
                <span class="fw-bold text-warning">in progress</span>.
              </MDBCardText>
            </MDBCol>
          </MDBRow>
        </MDBCardBody>
      </MDBCard>
    </MDBRow>
  </MDBContainer>
  <DialogModal v-model="dialog.visible" :text="dialog.text" @close="dialog.visible = false" />
</template>

<style scoped>
.profile-image {
  max-width: 200px;
}

.darker-bg {
  background-color: rgb(30, 30, 30);
}

.divider {
  width: 80vw;
  height: 1px;
  background-color: var(--mdb-body-color);
}
</style>
