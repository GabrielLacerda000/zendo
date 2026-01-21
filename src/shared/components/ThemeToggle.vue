<script setup lang="ts">
import { computed } from 'vue';
import { Motion } from 'motion-v';
import { useThemeStore } from '../../stores/themeStore';
import { SPRINGS } from '../constants/animations';

const themeStore = useThemeStore();

const isDark = computed(() => themeStore.theme === 'dark');

const handleToggle = () => {
  themeStore.toggleTheme();
};
</script>

<template>
  <button
    @click="handleToggle"
    :aria-label="`Switch to ${isDark ? 'light' : 'dark'} theme`"
    class="relative p-2 rounded-xl bg-gray-200 dark:bg-brand-background-tertiary border border-gray-300 dark:border-brand-border hover:bg-gray-300 dark:hover:bg-brand-border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400"
  >
    <div class="relative w-14 h-7 flex items-center">
      <!-- Track -->
      <div class="absolute inset-0 rounded-lg bg-gray-300 dark:bg-brand-background"></div>

      <!-- Slider -->
      <Motion
        :animate="{
          x: isDark ? 28 : 0,
          rotate: isDark ? 360 : 0
        }"
        :transition="{ type: 'spring', ...SPRINGS.SNAPPY }"
        class="relative z-10"
      >
        <div class="w-7 h-7 rounded-lg bg-white dark:bg-emerald-500 shadow-md flex items-center justify-center">
          <!-- Sun icon (light mode) -->
          <Motion
            :animate="{
              opacity: isDark ? 0 : 1,
              scale: isDark ? 0 : 1,
              rotate: isDark ? 180 : 0
            }"
            :transition="{ duration: 0.2 }"
            class="absolute"
          >
            <svg class="w-4 h-4 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
          </Motion>

          <!-- Moon icon (dark mode) -->
          <Motion
            :animate="{
              opacity: isDark ? 1 : 0,
              scale: isDark ? 1 : 0,
              rotate: isDark ? 0 : -180
            }"
            :transition="{ duration: 0.2 }"
            class="absolute"
          >
            <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </Motion>
        </div>
      </Motion>
    </div>
  </button>
</template>
