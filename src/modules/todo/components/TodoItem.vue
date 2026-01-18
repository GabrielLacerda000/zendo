<script setup lang="ts">
import type { Todo } from '@/types/Todo'
import { computed } from 'vue'
import { cn } from '@/shared/utils/cn'

interface Props {
  todo: Todo
  class?: string
}

const props = defineProps<Props>()

const completedChecklistCount = computed(() => {
  return props.todo.checklist.filter(item => item.completed).length
})
</script>

<template>
  <div
    :class="cn(
      'p-3 bg-brand-background border border-brand-border rounded-lg cursor-pointer hover:bg-brand-background-secondary transition-colors',
      props.class
    )"
  >
    <!-- Todo title -->
    <div class="text-brand-text">{{ todo.title }}</div>

    <!-- Indicators row -->
    <div v-if="todo.description || todo.checklist.length > 0" class="flex gap-2 mt-2 items-center">
      <!-- Description indicator (Trello-style lines icon) -->
      <div v-if="todo.description" class="flex items-center gap-1 text-brand-text-secondary text-xs">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="4" y1="6" x2="20" y2="6"/>
          <line x1="4" y1="12" x2="20" y2="12"/>
          <line x1="4" y1="18" x2="12" y2="18"/>
        </svg>
      </div>

      <!-- Checklist count -->
      <div v-if="todo.checklist.length > 0" class="flex items-center gap-1 text-brand-text-secondary text-xs">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 11l3 3L22 4"/>
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
        </svg>
        <span>{{ completedChecklistCount }}/{{ todo.checklist.length }}</span>
      </div>
    </div>
  </div>
</template>
