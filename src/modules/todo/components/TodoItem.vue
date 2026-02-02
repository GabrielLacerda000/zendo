<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import { Motion } from 'motion-v';
import { useTodoStore } from '../../todos/stores/todoStore';
import { cn } from '../../../shared/utils/cn';
import { Todo } from '../../../types/Todo';
import BaseInput from '../../../shared/components/BaseInput.vue';
import { STAGGER_DELAY } from '../../../shared/constants/animations';
import { notify } from '@/shared/utils/toast';

interface Props {
  todo: Todo
  class?: string
  index?: number
}

const props = withDefaults(defineProps<Props>(), {
  index: 0
})

const todoStore = useTodoStore()

// Local state for title editing
const isEditingTitle = ref(false)
const localTitle = ref(props.todo.title)
const titleInputRef = ref<InstanceType<typeof BaseInput> | null>(null)
const isDeleting = ref(false)

const completedChecklistCount = computed(() => {
  return props.todo.checklist.filter(item => item.completed).length
})

const animateState = computed(() => {
  if (isDeleting.value) {
    return { opacity: 0, scale: 0.9, y: 10 }
  }
  return { opacity: 1, x: 0 }
})

const handleDelete = (event: Event) => {
  event.stopPropagation()
  isDeleting.value = true
   notify.success('Todo deleted')
  setTimeout(() => {
    todoStore.deleteTodo(props.todo.id)
  }, 200)
}

// Title editing methods
const startEditingTitle = (event: Event) => {
  event.stopPropagation() // Prevent modal from opening
  localTitle.value = props.todo.title
  isEditingTitle.value = true
  nextTick(() => {
    titleInputRef.value?.focus()
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
  <Motion
    :initial="{ opacity: 0, x: -20 }"
    :animate="animateState"
    :whileHover="!isDeleting && { y: -2, scale: 1.01 }"
    :transition="{
      duration: isDeleting ? 0.2 : undefined,
      type: isDeleting ? undefined : 'spring',
      stiffness: 260,
      damping: 20,
      delay: isDeleting ? 0 : props.index * STAGGER_DELAY
    }"
  >
    <div
      :class="cn(
        'group relative p-4 rounded-xl cursor-pointer transition-all',
        'bg-white dark:bg-brand-background-secondary',
        'border border-gray-200 dark:border-brand-border',
        'hover:border-gray-300 dark:hover:border-emerald-600',
        'shadow-sm hover:shadow-md',
        props.class
      )"
    >
      <!-- Delete button - appears on hover -->
      <button
        @click="handleDelete"
        class="absolute top-3 right-3 p-1.5 bg-red-500 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10 cursor-pointer shadow-sm"
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
        class="text-gray-800 dark:text-gray-100 font-medium cursor-text select-none pr-8"
      >
        {{ todo.title }}
      </div>
      <BaseInput
        v-else
        ref="titleInputRef"
        v-model="localTitle"
        @blur="saveTitle"
        @keyup.enter="saveTitle"
        @keyup.esc="cancelEditTitle"
        @click.stop
      />

      <!-- Indicators row -->
      <div v-if="todo.description || todo.checklist.length > 0" class="flex gap-3 mt-3 items-center">
        <!-- Description indicator (Trello-style lines icon) -->
        <div v-if="todo.description" class="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="4" y1="6" x2="20" y2="6"/>
            <line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="12" y2="18"/>
          </svg>
        </div>

        <!-- Checklist count -->
        <div
          v-if="todo.checklist.length > 0"
          class="flex items-center gap-1.5 text-xs"
          :class="completedChecklistCount === todo.checklist.length ? 'text-emerald-600 dark:text-emerald-500' : 'text-gray-500 dark:text-gray-400'"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          <span class="font-medium">{{ completedChecklistCount }}/{{ todo.checklist.length }}</span>
        </div>
      </div>
    </div>
  </Motion>
</template>
