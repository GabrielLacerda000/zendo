<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import BaseInput from './BaseInput.vue'
import { useTodoStore } from '../../modules/todos/stores/todoStore'
import { useListStore } from '../../modules/lists/stores/listStore'

const todoStore = useTodoStore()
const listStore = useListStore()
const todoInput = ref('')
const isCreatingInvalidTodo = ref(false)
const validationError = ref('')

const handleCreate = async () => {
  isCreatingInvalidTodo.value = false
  validationError.value = ''

  if (!todoInput.value.trim()) {
    validationError.value = 'Enter a todo title'
    isCreatingInvalidTodo.value = true
    return
  }

  if (!listStore.activeListId) {
    validationError.value = 'No active list selected'
    isCreatingInvalidTodo.value = true
    return
  }

  await todoStore.createTodo({
    title: todoInput.value.trim(),
    priority: 'low',
    listId: listStore.activeListId,
    completed: false,
    checklist: [],
    description: ''
  })

  todoInput.value = ''
}
</script>

<template>
  <div
    class="flex items-center gap-2 p-1 border rounded-xl transition-all focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500"
    :class="isCreatingInvalidTodo ? 'border-red-500' : 'border-brand-border'"
  >
    <BaseInput
      v-model="todoInput"
      variant="bare"
      placeholder="What needs to be done?"
      @keyup.enter="handleCreate"
      class="flex-1 border-none focus:ring-0"
    />

    <button
      @click="handleCreate"
      class="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer m-2"
    >
      <Plus class="w-5 h-5 text-white" />
    </button>
  </div>

  <p v-if="isCreatingInvalidTodo" class="mt-1 text-xs text-red-500 ml-2">
    {{ validationError }}
  </p>
</template>
