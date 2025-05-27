import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useViewport() {
  const isMobile = ref(false);
  const isSmallWindow = ref(false);

  const update = () => {
    isMobile.value = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    isSmallWindow.value = window.innerWidth < 1250;
  };

  onMounted(() => {
    update();
    window.addEventListener('resize', update);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', update);
  });

  return { isMobile, isSmallWindow };
}
