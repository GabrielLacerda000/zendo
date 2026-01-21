<script setup lang="ts">
import { Motion } from 'motion-v';

type Props = {
  label: string
}

const props = defineProps<Props>()
</script>

<template>
  <Motion
    :whileTap="{ scale: 0.98 }"
    :whileHover="{ scale: 1.02 }"
    :transition="{ type: 'spring', stiffness: 400, damping: 25 }"
  >
    <button
      class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md font-medium"
    >
      {{ props.label }}
    </button>
  </Motion>
</template>
