<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import { useTodoStore } from '../../todos/stores/todoStore';
import { cn } from '../../../shared/utils/cn';
import { Todo } from '../../../types/Todo';

interface Props {
  todo: Todo
  class?: string
}

const props = defineProps<Props>()
const todoStore = useTodoStore()

// Local state for title editing
const isEditingTitle = ref(false)
const localTitle = ref(props.todo.title)
const titleInputRef = ref<HTMLInputElement | null>(null)

const completedChecklistCount = computed(() => {
  return props.todo.checklist.filter(item => item.completed).length
})

const handleDelete = (event: Event) => {
  event.stopPropagation()
  todoStore.deleteTodo(props.todo.id)
}

// Title editing methods
const startEditingTitle = (event: Event) => {
  event.stopPropagation() // Prevent modal from opening
  localTitle.value = props.todo.title
  isEditingTitle.value = true
  nextTick(() => {
    titleInputRef.value?.focus()
    titleInputRef.value?.select()
  })
}

const saveTitle = async () => {
  const trimmedTitle = localTitle.value.trim()
  if (trimmedTitle && trimmedTitle !== props.todo.title) {
    await todoStore.updateTodo(props.todo.id, { title: trimmedTitle })
  } else if (!trimmedTitle) {
    // If empty, revert to original
    localTitle.value = props.todo.title
  }
  isEditingTitle.value = false
}

const cancelEditTitle = () => {
  localTitle.value = props.todo.title
  isEditingTitle.value = false
}
</script>

<template>
  <div
    :class="cn(
      'group relative p-3 bg-brand-background border border-brand-border rounded-lg cursor-pointer hover:bg-brand-background-secondary transition-colors',
      props.class
    )"
  >
    <!-- Delete button - appears on hover -->
    <button
      @click="handleDelete"
      class="absolute top-2 right-2 p-1.5 bg-red-200 hover:bg-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity transition-colors z-10 cursor-pointer"
      aria-label="Delete todo"
    >
      <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>

    <!-- Todo title - double-click to edit -->
    <div
      v-if="!isEditingTitle"
      @dblclick="startEditingTitle"
      class="text-brand-text cursor-text select-none"
    >
      {{ todo.title }}
    </div>
    <baseIpun
      v-else
      ref="titleInputRef"
      v-model="localTitle"
      @blur="saveTitle"
      @keyup.enter="saveTitle"
      @keyup.esc="cancelEditTitle"
      @click.stop
      class="w-full bg-brand-background border border-blue-500 rounded px-2 py-1 text-brand-text focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

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
