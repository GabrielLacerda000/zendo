<script setup lang="ts">
interface Props {
  modelValue?: string
  options: Array<{ value: string; label: string }>
  class?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="relative">
    <select
      :value="modelValue"
      @change="handleChange"
      :class="[
        'border-2 border-gray-300 dark:border-brand-border rounded-xl',
        'px-3 py-2 pr-12 w-full',
        'bg-white dark:bg-brand-background-secondary',
        'text-gray-800 dark:text-gray-100',
        'focus:border-emerald-500 dark:focus:border-emerald-400',
        'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20',
        'transition-all duration-200',
        'appearance-none cursor-pointer',
        props.class
      ]"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        class="bg-white dark:bg-brand-background-secondary text-gray-800 dark:text-gray-100"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Down arrow icon -->
    <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg
        class="w-5 h-5 text-emerald-600 dark:text-emerald-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>
</template>
