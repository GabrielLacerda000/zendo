<script setup lang="ts">
import { Motion } from 'motion-v'
import { SPRINGS } from '../constants/animations'

interface Props {
  listName: string
  completedCount: number
  totalCount: number
  completionPercentage: number
}

defineProps<Props>()
</script>

<template>
  <div>
    <!-- Title -->
    <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
      {{ listName }}
    </h1>

    <!-- Subtitle -->
    <p class="text-gray-500 dark:text-gray-400 mt-2">
      {{ completedCount }} of {{ totalCount }} tasks completed
    </p>

    <!-- Progress Bar -->
    <div class="mt-4 h-2 bg-[var(--color-progress-bg)] rounded-full overflow-hidden">
      <Motion
        :initial="{ width: '0%' }"
        :animate="{ width: `${completionPercentage}%` }"
        :transition="SPRINGS.DEFAULT"
      >
        <div class="h-full bg-[var(--color-progress-fill)] rounded-full" />
      </Motion>
    </div>
  </div>
</template>
