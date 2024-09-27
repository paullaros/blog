<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter } from 'vitepress';
import gsap from 'gsap';

const isMobileViewport = () => {
  // Breakpoint inherited from Vitepress
  return window.innerWidth < 960;
};

const isMobileUserAgent = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

const isMobile = () => {
  return isMobileViewport() || isMobileUserAgent();
};

const square = ref<HTMLDivElement | null>(null);
const router = useRouter();

const cursorState = ref({
  opacity: 1,
  size: 16,
  left: 0,
  top: 0,
});

const initializeCursor = () => {
  // Use debounce to ensure all other JS is ready
  setTimeout(() => {
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

    document.querySelectorAll('a, button').forEach(link => {
      link.addEventListener('mouseover', handleMouseOver);
      link.addEventListener('mouseleave', handleMouseLeave);
    });

    onBeforeUnmount(() => {
      document.querySelectorAll('a, button').forEach(link => {
        link.removeEventListener('mouseover', handleMouseOver);
        link.removeEventListener('mouseleave', handleMouseLeave);
      });
    });
  }, 0);
};

let animationFrameId: number | null = null;

const moveCursor = (e: MouseEvent) => {
  // Cancel the previous frame if it's still queued
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  // Use requestAnimationFrame to update cursor position
  animationFrameId = requestAnimationFrame(() => {
    // Use GSAP to animate the cursor movement
    gsap.to(cursorState.value, {
      left: e.clientX,
      top: e.clientY,
      duration: 0.3,
      ease: "power1.out"
    });
  });
};

onMounted(() => {
  if (!isMobile()) {
    initializeCursor();
    document.addEventListener('mousemove', moveCursor);

    watch(
      () => router.route.data.relativePath,
      () => {
        initializeCursor();
      },
      { immediate: true }
    );
  }
});

onBeforeUnmount(() => {
  if (!isMobile()) {
    document.removeEventListener('mousemove', moveCursor);
  
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  }
});
</script>

<template>
  <teleport to="body">
    <div>
      <div 
        ref="square" 
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
}
</style>
