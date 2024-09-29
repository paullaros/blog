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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vitepress';

const rotation = ref(0);
const route = useRoute();
const titleElement = ref(null);

const rotateLogo = () => {
  rotation.value += 45;
};

const animateLogoTwice = () => {
  rotateLogo();
  setTimeout(rotateLogo, 500);
};

onMounted(() => {
  // Start the rotation animation after a brief delay
  setTimeout(animateLogoTwice, 250);

  // Watch for route changes to trigger the rotation animation
  watch(route, animateLogoTwice);

  titleElement.value = document.querySelector('a.title');

  if (titleElement.value) {
    // Add event listeners for mouse enter and leave events to rotate the logo
    titleElement.value.addEventListener('mouseenter', rotateLogo);
    titleElement.value.addEventListener('mouseleave', rotateLogo);
  }
});

onBeforeUnmount(() => {
  if (titleElement.value) {
    titleElement.value.removeEventListener('mouseenter', rotateLogo);
    titleElement.value.removeEventListener('mouseleave', rotateLogo);
  }
});
</script>
