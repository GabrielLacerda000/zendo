<script setup lang="ts">
import { Motion } from 'motion-v'
import { Check } from 'lucide-vue-next'
import { SPRINGS } from '../constants/animations'

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
    <input
      type="checkbox"
      :checked="modelValue"
      @change="toggle"
      class="sr-only"
      :disabled="disabled"
      tabindex="-1"
    />

    <div
      @click="toggle"
      @keydown="handleKeydown"
      role="checkbox"
      :aria-checked="modelValue"
      :aria-disabled="disabled"
      tabindex="0"
      :class="[
        'w-6 h-6 border-2 rounded-full cursor-pointer flex items-center justify-center',
        'transition-all duration-200',
        modelValue
          ? 'bg-emerald-600 border-emerald-600 scale-110'
          : 'bg-transparent border-gray-300 dark:border-gray-600 scale-100',
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-emerald-500 dark:hover:border-emerald-400'
      ]"
    >
      <Motion
        :initial="{ scale: 0, opacity: 0 }"
        :animate="{
          scale: modelValue ? 1 : 0,
          opacity: modelValue ? 1 : 0
        }"
        :transition="SPRINGS.SNAPPY"
      >
        <Check class="w-4 h-4 text-white" />
      </Motion>
    </div>
  </div>
</template>
