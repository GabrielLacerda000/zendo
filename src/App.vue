<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BaseInput from './shared/components/BaseInput.vue'
import BaseSelect from './shared/components/BaseSelect.vue'
import TodoItem from './modules/todo/components/TodoItem.vue'
import ListContainer from './modules/list/components/ListContainer.vue'
import { initializeApp } from './shared/utils/init'
import { useListStore } from './modules/lists/stores/listStore'
import { useTodoStore } from './modules/todos/stores/todoStore'

const listStore = useListStore()
const todoStore = useTodoStore()

// App initialization state
const isLoading = ref(true)

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
      <button
        @click="handleCreateList"
        class="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
      >
        Add List
      </button>
    </div>

    <!-- Two-column lists section -->
    <div class="grid grid-cols-2 gap-8">
      <!-- Left list with todos -->
      <ListContainer title="list title">
        <TodoItem text="todo" />
        <TodoItem text="todo" />
        <TodoItem text="todo" />
      </ListContainer>

      <!-- Right list with input -->
      <ListContainer title="list title">
        <BaseInput placeholder="" />
      </ListContainer>
    </div>
  </div>
</template>
