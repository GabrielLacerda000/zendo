<script setup lang="ts">
import { computed } from 'vue'
import { Motion } from 'motion-v';

type Props = {
  label: string
  variant?: 'primary' | 'secondary' | 'danger'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-gray-200 hover:bg-gray-300 dark:bg-brand-background dark:hover:bg-brand-background-tertiary text-gray-700 dark:text-gray-300'
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white'
    default:
      return 'bg-emerald-600 hover:bg-emerald-700 text-white'
  }
})
</script>

<template>
  <Motion
    :whileTap="{ scale: 0.98 }"
    :whileHover="{ scale: 1.02 }"
    :transition="{ type: 'spring', stiffness: 400, damping: 25 }"
  >
    <button
      :class="[
        'px-4 py-2 rounded-xl transition-colors duration-200 cursor-pointer shadow-sm hover:shadow-md font-medium',
        variantClasses
      ]"
    >
      {{ props.label }}
    </button>
  </Motion>
</template>
