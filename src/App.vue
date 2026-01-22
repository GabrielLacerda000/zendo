<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Sidebar from './shared/components/Sidebar.vue'
import MainContent from './shared/components/MainContent.vue'
import TodoDetailModal from './shared/components/TodoDetailModal.vue'
import ThemeToggle from './shared/components/ThemeToggle.vue'
import { initializeApp } from './shared/utils/init'
import { useListStore } from './modules/lists/stores/listStore'
import type { Todo } from './types/Todo'

// App initialization state
const isLoading = ref(true)

// Modal state
const selectedTodo = ref<Todo | null>(null)
const isTodoModalOpen = ref(false)

// Modal handlers
const openTodoModal = (todo: Todo) => {
  selectedTodo.value = todo
  isTodoModalOpen.value = true
}

const closeTodoModal = () => {
  isTodoModalOpen.value = false
  selectedTodo.value = null
}

// Initialize app on mount
onMounted(async () => {
  try {
    await initializeApp()
  } catch (error) {
    console.error('Failed to initialize app:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading" class="h-screen `bg-(--color-main-bg)flex items-center justify-center">
    <div class="text-gray-800 dark:text-gray-100">Loading...</div>
  </div>
  <div v-else class="flex h-screen `bg-(--color-main-bg)relative transition-colors">
    <!-- Theme toggle -->
    <div class="absolute top-6 right-6 z-10">
      <ThemeToggle />
    </div>

    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <MainContent @openTodoModal="openTodoModal" />

    <!-- Todo Detail Modal -->
    <TodoDetailModal
      v-if="isTodoModalOpen && selectedTodo"
      :todo="selectedTodo"
      @close="closeTodoModal"
    />
  </div>
</template>
