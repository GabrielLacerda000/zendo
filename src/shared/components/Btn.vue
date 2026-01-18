<script setup lang="ts">
type Props = {
  label: string
}

const props = defineProps<Props>()
</script>

<template>
    <button
        class="px-3 py-2 bg-emerald-600 text-gray-200 rounded-xl hover:bg-emerald-700 cursor-pointer"
    >
        {{ props.label }}
    </button>
</template>
