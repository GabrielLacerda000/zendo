<script setup lang="ts">
interface Props {
  title: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div :class="['flex flex-col bg-brand-background-secondary p-3 rounded-2xl', props.class]">
    <h2 class="text-gray-200 text-lg font-medium mb-4">
      {{ title }}
    </h2>
    <div class="flex flex-col gap-3">
      <slot />
    </div>
  </div>
</template>
