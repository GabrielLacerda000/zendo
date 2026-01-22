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
  <div class="flex gap-3 items-start">
    <BaseInput
      v-model="todoInput"
      placeholder="What needs to be done?"
      class="flex-1"
      :isInvalid="isCreatingInvalidTodo"
      :error="validationError"
      @keyup.enter="handleCreate"
    />

    <button
      @click="handleCreate"
      class="p-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
    >
      <Plus class="w-5 h-5 text-white" />
    </button>
  </div>
</template>
