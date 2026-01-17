<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from './shared/components/BaseInput.vue'
import BaseSelect from './shared/components/BaseSelect.vue'
import TodoItem from './modules/todo/components/TodoItem.vue'
import ListContainer from './modules/list/components/ListContainer.vue'

// Static prototype - refs not really used but show v-model structure
const todoInput = ref('')
const priority = ref('low')
const selectedList = ref('lists')

const priorityOptions = [
  { value: 'low', label: 'low' },
  { value: 'medium', label: 'medium' },
  { value: 'high', label: 'high' }
]

const listOptions = [
  { value: 'lists', label: 'lists' },
  { value: 'personal', label: 'personal' },
  { value: 'work', label: 'work' }
]
</script>

<template>
  <div class="min-h-screen bg-brand-background p-8">
    <!-- Top controls section -->
    <div class="flex gap-4 mb-8 items-center">
      <BaseInput
        v-model="todoInput"
        placeholder="placeholder"
        class="flex-1"
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
