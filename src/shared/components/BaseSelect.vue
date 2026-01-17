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
        'border border-brand-border rounded-2xl',
        'px-6 py-4 text-gray-100',
        'focus:border-emerald-400 focus:outline-none',
        'transition-colors duration-200',
        'appearance-none cursor-pointer',
        'pr-12 w-full',
        props.class
      ]"
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
        class="bg-brand-background text-gray-200"
      >
        {{ option.label }}
      </option>
    </select>

    <!-- Down arrow icon -->
    <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
      <svg
        class="w-5 h-5 text-emerald-600"
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
