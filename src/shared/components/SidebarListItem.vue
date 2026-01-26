<script setup lang="ts">
import { computed, ref } from 'vue'
import { Motion } from 'motion-v'
import { Trash2 } from 'lucide-vue-next'
import { SPRINGS, STAGGER_DELAY } from '../constants/animations'
import { useListStore } from '../../modules/lists/stores/listStore'
import { useTodoStore } from '../../modules/todos/stores/todoStore'
import type { TodoList } from '../../types/List'
import ConfirmModal from './ConfirmModal.vue'

interface Props {
  list: TodoList
  isActive: boolean
  index: number
}

const props = defineProps<Props>()
const listStore = useListStore()
const todoStore = useTodoStore()

const isDeleting = ref(false)
const showDeleteModal = ref(false)

const todoCount = computed(() => {
  return todoStore.todosByList(props.list.id).length
})

const deleteMessage = computed(() => {
  const todoCountText = todoCount.value === 1 ? '1 todo' : `${todoCount.value} todos`
  return `Are you sure you want to delete "${props.list.name}" with ${todoCountText}?`
})

const animateState = computed(() => {
  if (isDeleting.value) {
    return { opacity: 0, scale: 0.95, x: -10 }
  }
  return { opacity: 1, x: 0 }
})

const handleClick = () => {
  listStore.setActiveList(props.list.id)
}

const handleDeleteClick = (event: Event) => {
  event.stopPropagation()
  showDeleteModal.value = true
}

const handleConfirmDelete = () => {
  showDeleteModal.value = false
  isDeleting.value = true
  setTimeout(async () => {
    await listStore.deleteList(props.list.id)
  }, 200)
}

const handleCancelDelete = () => {
  showDeleteModal.value = false
}
</script>

<template>
  <Motion
    :initial="{ opacity: 0, x: -10 }"
    :animate="animateState"
    :transition="{
      duration: isDeleting ? 0.2 : undefined,
      type: isDeleting ? undefined : 'spring',
      ...(!isDeleting && SPRINGS.DEFAULT),
      delay: isDeleting ? 0 : index * STAGGER_DELAY
    }"
  >
    <div class="group flex items-center gap-1 w-full">
      <button
        @click="handleClick"
        :class="[
          'flex-1 px-3 py-2 rounded-lg text-left transition-all',
          isActive
            ? 'bg-[var(--color-sidebar-item-active)] text-emerald-700 dark:text-emerald-400 font-medium'
            : 'hover:bg-[var(--color-sidebar-item-hover)] text-gray-700 dark:text-gray-300'
        ]"
      >
        {{ list.name }}
        <span class="text-xs ml-2 opacity-70">({{ todoCount }})</span>
      </button>

      <!-- Delete button (appears on hover) -->
      <button
        @click="handleDeleteClick"
        class="opacity-0 group-hover:opacity-100 transition-opacity self-center p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
        aria-label="Delete list"
      >
        <Trash2 class="w-4 h-4 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300" />
      </button>
    </div>
  </Motion>

  <!-- Delete confirmation modal -->
  <ConfirmModal
    :is-open="showDeleteModal"
    title="Delete List"
    :message="deleteMessage"
    confirm-text="Delete"
    cancel-text="Cancel"
    variant="danger"
    @confirm="handleConfirmDelete"
    @cancel="handleCancelDelete"
  />
</template>
