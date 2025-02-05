import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '@/App.vue';
import HelloWorld from '@/components/HelloWorld.vue';

describe('App.vue', () => {
  it('renders HelloWorld component', () => {
    const wrapper = mount(App, {
      global: {
        stubs: {
          RouterLink: true,
          RouterView: true,
        },
      },
    });
    expect(wrapper.findComponent(HelloWorld).exists()).toBe(true);
  });
});
