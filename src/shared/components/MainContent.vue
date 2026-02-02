<script setup lang="ts">
import { computed } from 'vue'
import draggable from 'vuedraggable'
import ListHeader from './ListHeader.vue'
import TodoCard from './TodoCard.vue'
import AddTodoInput from './AddTodoInput.vue'
import { useListStore } from '../../modules/lists/stores/listStore'
import { useTodoStore } from '../../modules/todos/stores/todoStore'
import type { Todo } from '../../types/Todo'

const emit = defineEmits<{ openTodoModal: [todo: Todo] }>()

const listStore = useListStore()
const todoStore = useTodoStore()

const activeList = computed(() => listStore.activeList)

const activeTodos = computed(() => {
  if (!listStore.activeListId) return []
  return todoStore.todosByList(listStore.activeListId)
})

const dragTodos = computed({
  get: () => activeTodos.value,
  set: (value: Todo[]) => {
    if (listStore.activeListId) {
      todoStore.reorderTodos(listStore.activeListId, value)
    }
  }
})

const completedCount = computed(() => {
  return activeTodos.value.filter(todo => todo.completed).length
})

const totalCount = computed(() => {
  return activeTodos.value.length
})

const completionPercentage = computed(() => {
  if (totalCount.value === 0) return 0
  return Math.round((completedCount.value / totalCount.value) * 100)
})

const openTodoModal = (todo: Todo) => {
  emit('openTodoModal', todo)
}

const handleUpdateListName = async (newName: string) => {
  if (activeList.value) {
    await listStore.updateList(activeList.value.id, { name: newName })
  }
}
</script>

<template>
  <main class="flex-1 bg-[var(--color-main-bg)] overflow-y-auto transition-colors">
    <!-- No active list state -->
    <div v-if="!activeList" class="flex items-center justify-center h-full">
      <p class="text-gray-500 dark:text-gray-400">Select a list to get started</p>
    </div>

    <!-- Active list content -->
    <div v-else class="max-w-3xl mx-auto p-8">
      <!-- Header Section -->
      <ListHeader
        :listName="activeList.name"
        :completedCount="completedCount"
        :totalCount="totalCount"
        :completionPercentage="completionPercentage"
        @update:listName="handleUpdateListName"
      />

      <!-- Todos Section -->
      <div class="mt-8">
        <draggable
          v-model="dragTodos"
          item-key="id"
          handle=".drag-handle"
          :animation="200"
          ghost-class="opacity-50"
          class="space-y-3"
        >
          <template #item="{ element, index }">
            <TodoCard
              :todo="element"
              :index="index"
              @click="openTodoModal(element)"
            />
          </template>
        </draggable>

        <div v-if="activeTodos.length === 0" class="text-center py-8">
          <p class="text-gray-500 dark:text-gray-400">No todos yet</p>
        </div>
      </div>

      <!-- Add Todo Section (bottom) -->
      <div class="mt-8 sticky bottom-0 bg-(--color-main-bg) py-4">
        <AddTodoInput />
      </div>
    </div>
  </main>
</template>
