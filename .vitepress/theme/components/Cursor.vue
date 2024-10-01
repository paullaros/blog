<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vitepress';
import gsap from 'gsap';

// Utility functions to determine if the user is on a mobile device
const isViewportMobile = () => window.innerWidth < 960;
const isUserAgentMobile = () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isMobileDevice = () => isViewportMobile() || isUserAgentMobile();

// Refs and route
const cursorRef = ref<HTMLDivElement | null>(null);
const currentRoute = useRoute();

// Cursor state management
const cursorState = ref({
  opacity: 1,
  size: 16,
  left: -8,
  top: -8
});

// Array to keep track of link elements
const interactiveElements: HTMLElement[] = [];

// Cursor animation handlers
const handleMouseOver = () => {
  gsap.to(cursorState.value, {
    opacity: 0.25,
    size: 48,
    duration: 0.3,
    ease: "power1.out"
  });
};

const handleMouseLeave = () => {
  gsap.to(cursorState.value, {
    opacity: 1,
    size: 16,
    duration: 0.3,
    ease: "power1.out"
  });
};

// Initialize cursor event listeners
const initializeCursor = () => {
  setTimeout(() => {
    const currentLinks = document.querySelectorAll('a, button');
    currentLinks.forEach(element => {
      element.addEventListener('mouseover', handleMouseOver);
      element.addEventListener('mouseleave', handleMouseLeave);
      interactiveElements.push(element as HTMLElement);
    });
  }, 0);
};

// Animation frame ID for smoother cursor movement
let animationFrameId: number | null = null;

// Function to move the cursor
const moveCursor = (event: MouseEvent) => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  animationFrameId = requestAnimationFrame(() => {
    gsap.to(cursorState.value, {
      left: event.clientX,
      top: event.clientY,
      duration: 0.3,
      ease: "power1.out"
    });
  });
};

// Lifecycle hooks
onMounted(() => {
  if (!isMobileDevice()) {
    initializeCursor();
    document.addEventListener('mousemove', moveCursor);
    watch(currentRoute, initializeCursor);
  }
});

onBeforeUnmount(() => {
  if (!isMobileDevice()) {
    document.removeEventListener('mousemove', moveCursor);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }

    interactiveElements.forEach(element => {
      element.removeEventListener('mouseover', handleMouseOver);
      element.removeEventListener('mouseleave', handleMouseLeave);
    });
  }
});
</script>

<template>
  <teleport to="body">
    <div>
      <div 
        ref="cursorRef" 
        class="square" 
        :style="{ 
          left: `${cursorState.left}px`, 
          top: `${cursorState.top}px`, 
          opacity: cursorState.opacity, 
          width: `${cursorState.size}px`, 
          height: `${cursorState.size}px`
        }"
      ></div>
    </div>
  </teleport>
</template>

<style scoped>
.square {
  position: fixed;
  pointer-events: none;
  transform: translate(-50%, -50%);
  background-color: var(--vp-c-brand-1);
  z-index: 999;
  border-radius: 50%;
}
</style>
