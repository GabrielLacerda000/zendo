<script setup lang="ts">
import { computed, ref } from 'vue'
import { Motion } from 'motion-v'
import { AlignLeft, CheckSquare, Trash2, GripVertical } from 'lucide-vue-next'
import CircularCheckbox from './CircularCheckbox.vue'
import { SPRINGS, STAGGER_DELAY } from '../constants/animations'
import { useTodoStore } from '../../modules/todos/stores/todoStore'
import type { Todo } from '../../types/Todo'

interface Props {
  todo: Todo
  index: number
}

const props = defineProps<Props>()
const emit = defineEmits<{ click: [] }>()
const todoStore = useTodoStore()

const isDeleting = ref(false)

const checklistCompleted = computed(() => {
  return props.todo.checklist.filter(item => item.completed).length
})

const animateState = computed(() => {
  if (isDeleting.value) {
    return { opacity: 0, x: -20, scale: 0.95 }
  }
  return { opacity: 1, y: 0 }
})

const handleToggle = async () => {
  await todoStore.updateTodo(props.todo.id, {
    completed: !props.todo.completed
  })
}

const handleDelete = () => {
  isDeleting.value = true
  // Actual deletion happens after a short delay to allow animation
  setTimeout(async () => {
    await todoStore.deleteTodo(props.todo.id)
  }, 200) // Match TRANSITIONS.FAST duration
}
</script>

<template>
  <Motion
    :initial="{ opacity: 0, y: 10 }"
    :animate="animateState"
    :whileHover="!isDeleting && { scale: 1.01 }"
    :transition="{ duration: 0.2, delay: isDeleting ? 0 : index * STAGGER_DELAY }"
  >
    <div
      @click="emit('click')"
      :class="[
        'group flex items-start gap-3 p-4 rounded-xl bg-[var(--color-card-bg)]',
        'border border-[var(--color-card-border)] shadow-sm hover:shadow-md',
        'transition-all cursor-pointer'
      ]"
    >
      <!-- Drag Handle -->
      <div class="drag-handle cursor-grab active:cursor-grabbing self-center mr-1" @click.stop>
        <GripVertical class="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <!-- Circular Checkbox -->
      <div @click.stop>
        <CircularCheckbox
          :modelValue="todo.completed"
          @update:modelValue="handleToggle"
        />
      </div>

      <!-- Todo Content -->
      <div class="flex-1 min-w-0">
        <p :class="[
          'text-gray-800 dark:text-gray-100 break-words',
          todo.completed && 'line-through text-gray-400 dark:text-gray-600'
        ]">
          {{ todo.title }}
        </p>

        <!-- Indicators (description, checklist) -->
        <div v-if="todo.description || todo.checklist.length" class="flex gap-3 mt-2">
          <AlignLeft v-if="todo.description" class="w-4 h-4 text-gray-400" />
          <div v-if="todo.checklist.length" class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <CheckSquare class="w-4 h-4" />
            <span>{{ checklistCompleted }}/{{ todo.checklist.length }}</span>
          </div>
        </div>
      </div>

      <!-- Delete Button (on hover) -->
      <button
        @click.stop="handleDelete"
        class="opacity-0 group-hover:opacity-100 transition-opacity self-center"
      >
        <Trash2 class="w-4 h-4 text-red-500 hover:text-red-600" />
      </button>
    </div>
  </Motion>
</template>
