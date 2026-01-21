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
        'w-full bg-brand rounded-xl px-3 py-2 text-gray-200 placeholder:text-brand-secondary',
        props.isInvalid
          ? 'border border-red-700 focus:border-red-700'
          : 'border border-brand-border focus:border-emerald-400',
        'focus:outline-none transition-colors duration-200'
      ]"
    />
    <div v-if="error" class="text-red-600 text-sm mt-1">
      {{ error }}
    </div>
  </div>
</template>
