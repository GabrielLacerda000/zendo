<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BaseInput from './shared/components/BaseInput.vue'
import BaseSelect from './shared/components/BaseSelect.vue'
import TodoItem from './modules/todo/components/TodoItem.vue'
import ListContainer from './modules/list/components/ListContainer.vue'
import TodoDetailModal from './shared/components/TodoDetailModal.vue'
import { initializeApp } from './shared/utils/init'
import { useListStore } from './modules/lists/stores/listStore'
import { useTodoStore } from './modules/todos/stores/todoStore'
import Btn from './shared/components/Btn.vue'
import { Todo } from './types/Todo'

const listStore = useListStore()
const todoStore = useTodoStore()

// App initialization state
const isLoading = ref(true)

// Modal state
const selectedTodo = ref<Todo | null>(null)
const isTodoModalOpen = ref(false)

// Static prototype - refs not really used but show v-model structure
const todoInput = ref('')
const priority = ref('low')
const selectedList = ref('')

const priorityOptions = [
  { value: 'low', label: 'low' },
  { value: 'medium', label: 'medium' },
  { value: 'high', label: 'high' }
]

const listOptions = computed(() =>
  listStore.sortedLists.map(list => ({
    value: list.id,
    label: list.name
  }))
)

// Todo creation handler
const handleCreateTodo = async () => {
  if (!todoInput.value.trim() || !selectedList.value) return

  await todoStore.createTodo({
    title: todoInput.value,
    priority: priority.value as 'low' | 'medium' | 'high',
    listId: selectedList.value,
    completed: false,
    checklist: [],
    description: ''
  })

  todoInput.value = ''
}

// List creation handler
const handleCreateList = async () => {
  const listName = prompt('Enter new list name:')
  if (!listName?.trim()) return

  const newList = await listStore.createList(listName)
  // Optionally set as selected
  selectedList.value = newList.id
}

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
    // Set the initial selected list to the active one
    selectedList.value = listStore.activeListId || ''
  } catch (error) {
    console.error('Failed to initialize app:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div v-if="isLoading" class="min-h-screen bg-brand-background flex items-center justify-center">
    <div class="text-brand-text">Loading...</div>
  </div>
  <div v-else class="min-h-screen bg-brand-background p-8">
    <!-- Top controls section -->
    <div class="flex gap-4 mb-8 items-center">
      <BaseInput
        v-model="todoInput"
        placeholder="placeholder"
        class="flex-1"
        @keyup.enter="handleCreateTodo"
      />
      <BaseSelect
        v-model="priority"
        :options="priorityOptions"
        class="w-48"
      />
      <BaseSelect
        v-model="selectedList"
        :options="listOptions"
        class="w-48"
      />
      <Btn label="Add todo" @click="handleCreateTodo" />
      <Btn label="Add List" @click="handleCreateList" />
    </div>

    <!-- Two-column lists section -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <ListContainer
        v-for="list in listStore.sortedLists"
        :key="list.id"
        :title="list.name"
      >
        <TodoItem
          v-for="todo in todoStore.todosByList(list.id)"
          :key="todo.id"
          :todo="todo"
          @click="openTodoModal(todo)"
        />
        <div
          v-if="todoStore.todosByList(list.id).length === 0"
          class="text-brand-text-secondary text-sm"
        >
          No todos yet
        </div>
      </ListContainer>

      <div
        v-if="listStore.sortedLists.length === 0"
        class="col-span-2 text-center text-brand-text-secondary"
      >
        No lists yet. Click "Add List" to get started.
      </div>
    </div>

    <!-- Todo Detail Modal -->
    <TodoDetailModal
      v-if="isTodoModalOpen && selectedTodo"
      :todo="selectedTodo"
      @close="closeTodoModal"
    />
  </div>
</template>
