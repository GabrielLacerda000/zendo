<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue?: string
  placeholder?: string
  class?: any
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
  <input
    type="text"
    :value="modelValue"
    @input="handleInput"
    :placeholder="placeholder"
    :class="[
      'bg-brand border border-brand-border rounded-xl',
      'px-3 py-2 text-gray-200 placeholder:text-brand-secondary',
      'focus:border-emerald-400 focus:outline-none',
      'transition-colors duration-200',
      props.class
    ]"
  />
</template>
