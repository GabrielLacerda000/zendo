<script setup lang="ts">
interface Props {
  title: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div :class="['flex flex-col bg-white dark:bg-brand-background-secondary p-4 rounded-2xl shadow-sm border border-gray-200 dark:border-brand-border transition-colors', props.class]">
    <h2 class="text-gray-800 dark:text-gray-100 text-lg font-semibold mb-4">
      {{ title }}
    </h2>
    <div class="flex flex-col gap-3">
      <slot />
    </div>
  </div>
</template>
