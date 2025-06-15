import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '../views/LandingView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('../views/RegistrationView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/play',
      name: 'play',
      component: () => import('../views/PlayView.vue'),
    },
    {
      path: '/match',
      name: 'match',
      component: () => import('../views/MatchView.vue'),
    },
    {
      path: '/matchmaking',
      name: 'matchmaking',
      component: () => import('../views/MatchmakingView.vue'),
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import('../views/LeaderboardView.vue'),
    },
    {
      path: '/tutorial',
      name: 'tutorial',
      component: () => import('../views/TutorialView.vue'),
    },
  ],
});

export default router;
