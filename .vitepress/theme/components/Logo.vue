<template>
  <svg
    :class="['transition-transform', 'duration-500', 'ml-1', 'mr-3']"
    :style="{ transform: `rotate(${rotation}deg)` }"
    width="16"
    height="16"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Logo"
  >
    <rect width="16" height="16" style="fill: var(--vp-c-brand-1);" />
  </svg>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vitepress';

const rotation = ref(0);
const route = useRoute();

const incrementRotation = () => {
  rotation.value += 45;
};

const animateOnLoad = () => {
  incrementRotation();

  setTimeout(() => {
    incrementRotation(); 
  }, 500); 
};

const handleRouteChange = () => {
  animateOnLoad();
};

onMounted(() => {
  setTimeout(() => {
    animateOnLoad();
  }, 250);

  watch(route, handleRouteChange);

  const titleElement = document.querySelector('a.title');

  if (titleElement) {
    titleElement.addEventListener('mouseenter', incrementRotation);
    titleElement.addEventListener('mouseleave', incrementRotation);
  }
});
</script>
