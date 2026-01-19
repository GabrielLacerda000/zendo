<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getCurrentWindow } from '@tauri-apps/api/window'
import BaseInput from '../../shared/components/BaseInput.vue'
import BaseSelect from '../../shared/components/BaseSelect.vue'
import Btn from '../../shared/components/Btn.vue'
import { useListStore } from '../lists/stores/listStore'
import { useTodoStore } from '../todos/stores/todoStore'

const listStore = useListStore()
const todoStore = useTodoStore()
const appWindow = getCurrentWindow()

const isLoading = ref(true)
const title = ref('')
const selectedList = ref('')
const priority = ref<'low' | 'medium' | 'high'>('medium')

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

const listOptions = computed(() =>
  listStore.sortedLists.map(list => ({
    value: list.id,
    label: list.name
  }))
)

const handleAdd = async () => {
  if (!title.value.trim() || !selectedList.value) {
    return
  }

  try {
    await todoStore.createTodo({
      title: title.value,
      priority: priority.value,
      listId: selectedList.value,
      completed: false,
      checklist: [],
      description: ''
    })
    await appWindow.close()
  } catch (error) {
    console.error('Failed to create todo:', error)
  }
}

const handleCancel = async () => {
  await appWindow.close()
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleCancel()
  } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    handleAdd()
  }
}

onMounted(async () => {
  try {
    await listStore.loadLists()
    await todoStore.loadTodos()

    if (listStore.activeListId) {
      selectedList.value = listStore.activeListId
    } else if (listStore.lists.length > 0) {
      selectedList.value = listStore.lists[0].id
    }

    setTimeout(() => {
      const input = document.querySelector('input[type="text"]') as HTMLInputElement
      input?.focus()
    }, 100)
  } catch (error) {
    console.error('Failed to initialize quick-add window:', error)
  } finally {
    isLoading.value = false
  }

  window.addEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div
    v-if="isLoading"
    class="h-screen bg-brand-background flex items-center justify-center"
  >
    <div class="text-brand-text">Loading...</div>
  </div>
  <div
    v-else
    class="h-screen bg-brand-background p-6 flex flex-col"
  >
    <h2 class="text-xl font-semibold text-brand-text mb-4">Quick Add Todo</h2>

    <div class="flex-1 flex flex-col gap-4">
      <div>
        <label class="block text-sm text-brand-text-secondary mb-2">
          Title
        </label>
        <BaseInput
          v-model="title"
          placeholder="What needs to be done?"
          class="w-full"
          @keyup.enter="handleAdd"
        />
      </div>

      <div>
        <label class="block text-sm text-brand-text-secondary mb-2">
          List
        </label>
        <BaseSelect
          v-model="selectedList"
          :options="listOptions"
          class="w-full"
        />
      </div>

      <div>
        <label class="block text-sm text-brand-text-secondary mb-2">
          Priority
        </label>
        <BaseSelect
          v-model="priority"
          :options="priorityOptions"
          class="w-full"
        />
      </div>
    </div>

    <div class="flex gap-3 justify-end mt-4">
      <button
        @click="handleCancel"
        class="px-4 py-2 bg-brand border border-brand-border text-gray-200 rounded-xl hover:bg-brand-hover cursor-pointer transition-colors"
      >
        Cancel (Esc)
      </button>
      <Btn
        label="Add Todo (Ctrl+Enter)"
        @click="handleAdd"
        class="px-4 py-2"
      />
    </div>
  </div>
</template>
