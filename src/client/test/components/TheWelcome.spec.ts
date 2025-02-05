import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import WelcomeSection from '../../src/components/TheWelcome.vue';
import WelcomeItem from '@/components/WelcomeItem.vue';
import DocumentationIcon from '@/components/icons/IconDocumentation.vue';
import ToolingIcon from '@/components/icons/IconTooling.vue';
import EcosystemIcon from '@/components/icons/IconEcosystem.vue';
import CommunityIcon from '@/components/icons/IconCommunity.vue';
import SupportIcon from '@/components/icons/IconSupport.vue';

describe('WelcomeSection.vue', () => {
  it('renders 5 WelcomeItem components', () => {
    const wrapper = mount(WelcomeSection);
    const items = wrapper.findAllComponents(WelcomeItem);
    expect(items.length).toBe(5);
  });

  it('renders correct icons in each WelcomeItem', () => {
    const wrapper = mount(WelcomeSection);
    const icons = [DocumentationIcon, ToolingIcon, EcosystemIcon, CommunityIcon, SupportIcon];

    const items = wrapper.findAllComponents(WelcomeItem);
    icons.forEach((icon, index) => {
      expect(items[index].findComponent(icon).exists()).toBe(true);
    });
  });

  it('renders correct headings for each WelcomeItem', () => {
    const wrapper = mount(WelcomeSection);
    const headings = ['Documentation', 'Tooling', 'Ecosystem', 'Community', 'Support Vue'];

    const items = wrapper.findAllComponents(WelcomeItem);
    headings.forEach((heading, index) => {
      expect(items[index].text()).toContain(heading);
    });
  });

  it('renders expected links inside WelcomeItems', () => {
    const wrapper = mount(WelcomeSection);
    const links = [
      'https://vuejs.org/',
      'https://vite.dev/guide/features.html',
      'https://pinia.vuejs.org/',
      'https://chat.vuejs.org',
      'https://vuejs.org/sponsor/',
    ];

    links.forEach(link => {
      expect(wrapper.find(`a[href="${link}"]`).exists()).toBe(true);
    });
  });

  it('triggers openReadmeInEditor when README.md link is clicked', async () => {
    const mockFetch = vi.fn();
    global.fetch = mockFetch; // Mock global fetch

    const wrapper = mount(WelcomeSection);
    const readmeLink = wrapper.find('a[href="javascript:void(0)"]');

    await readmeLink.trigger('click');

    expect(mockFetch).toHaveBeenCalledWith('/__open-in-editor?file=README.md');
  });
});
