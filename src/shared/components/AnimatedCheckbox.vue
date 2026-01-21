<script setup lang="ts">
import { Motion } from 'motion-v'

interface Props {
  modelValue: boolean
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const toggle = () => {
  if (!props.disabled) {
    emit('update:modelValue', !props.modelValue)
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault()
    toggle()
  }
}
</script>

<template>
  <div class="inline-flex items-center">
    <!-- Hidden native input for accessibility -->
    <input
      type="checkbox"
      :checked="modelValue"
      @change="toggle"
      class="sr-only"
      :disabled="disabled"
      tabindex="-1"
    />

    <!-- Animated checkbox with CSS transitions -->
    <div
      @click="toggle"
      @keydown="handleKeydown"
      role="checkbox"
      :aria-checked="modelValue"
      :aria-disabled="disabled"
      tabindex="0"
      :class="[
        'w-5 h-5 border-2 rounded cursor-pointer flex items-center justify-center',
        'transition-all duration-200',
        modelValue
          ? 'bg-emerald-600 border-emerald-600 scale-110'
          : 'bg-transparent border-gray-300 dark:border-brand-border scale-100',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-500 dark:hover:border-emerald-400'
      ]"
    >
      <!-- Checkmark with Motion component -->
      <Motion
        :initial="{ pathLength: 0, opacity: 0 }"
        :animate="{
          pathLength: modelValue ? 1 : 0,
          opacity: modelValue ? 1 : 0
        }"
        :transition="{ duration: 0.2 }"
      >
        <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12l5 5L20 7"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </Motion>
    </div>
  </div>
</template>
