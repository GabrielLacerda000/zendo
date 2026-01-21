<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue?: string
  placeholder?: string
  class?: any
  isInvalid?: boolean
  error?: string
}

const props = defineProps<Props>()

const inputRef = ref<HTMLInputElement | null>(null);

const focus = () => {
  inputRef.value?.focus();
};

defineExpose({
  focus
});

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div :class="props.class">
    <input
      ref="inputRef"
      type="text"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :class="[
        'w-full rounded-xl px-3 py-2 transition-all duration-200',
        'bg-white dark:bg-brand-background-secondary',
        'text-gray-800 dark:text-gray-100',
        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
        props.isInvalid
          ? 'border-2 border-red-500 dark:border-red-400 focus:border-red-600 dark:focus:border-red-300'
          : 'border-2 border-gray-300 dark:border-brand-border focus:border-emerald-500 dark:focus:border-emerald-400',
        'focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20'
      ]"
    />
    <div v-if="error" class="text-red-600 dark:text-red-400 text-sm mt-1.5 ml-1">
      {{ error }}
    </div>
  </div>
</template>
