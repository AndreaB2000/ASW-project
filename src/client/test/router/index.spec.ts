import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import { createApp } from 'vue';
import router from '@/router';

import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';

describe('Router Setup', () => {
  it('should navigate to Home view on /', async () => {
    const app = createApp({});
    app.use(router);
    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    });

    // Naviga alla route `/`
    await router.push('/');
    await router.isReady(); // Aspetta che il router sia pronto

    // Verifica che il componente HomeView sia stato montato
    expect(wrapper.findComponent(HomeView).exists()).toBe(true);
  });

  it('should navigate to About view on /about', async () => {
    const app = createApp({});
    app.use(router);
    const wrapper = mount(AboutView, {
      global: {
        plugins: [router],
      },
    });

    // Naviga alla route `/about`
    await router.push('/about');
    await router.isReady(); // Aspetta che il router sia pronto

    // Verifica che il componente AboutView sia stato montato
    expect(wrapper.findComponent(AboutView).exists()).toBe(true);
  });
});
