<script setup lang="ts">
interface Props {
  text: string
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div
    :class="[
      'bg-brand-background border border-brand-border rounded-xl',
      'px-6 py-4 text-gray-200',
      props.class
    ]"
  >
    {{ text }}
  </div>
</template>
