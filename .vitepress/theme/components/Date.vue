<script setup lang="ts">
import { ref, computed, watchEffect, onMounted } from 'vue';
import { useData } from '../composables/data';

// Destructure page and language data from the composable
const { page, lang } = useData();

// Computed property to parse the date from frontmatter
const date = computed(() => new Date(page.value.frontmatter.date!));

// Computed property to get ISO string representation of the date
const isoDateTime = computed(() => date.value.toISOString());

// Ref to hold the formatted date string
const formattedDate = ref<string>('');

// Set formatted date on mounted hook to avoid hydration mismatch due to
// potential differences in timezones between server and clients
onMounted(() => {
  watchEffect(() => {
    formattedDate.value = date.value.toLocaleDateString(lang.value, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  });
});
</script>

<template>
  <p class="VPDate" v-if="page.frontmatter.date">
    <time :datetime="isoDateTime">{{ formattedDate }}</time>
  </p>
</template>

<style scoped>
.VPDate {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

@media (min-width: 640px) {
  .VPDate {
    line-height: 32px;
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
