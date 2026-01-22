<script setup lang="ts">
import { computed } from 'vue'
import { Motion } from 'motion-v'
import { SPRINGS, STAGGER_DELAY } from '../constants/animations'
import { useListStore } from '../../modules/lists/stores/listStore'
import { useTodoStore } from '../../modules/todos/stores/todoStore'
import type { TodoList } from '../../types/List'

interface Props {
  list: TodoList
  isActive: boolean
  index: number
}

const props = defineProps<Props>()
const listStore = useListStore()
const todoStore = useTodoStore()

const todoCount = computed(() => {
  return todoStore.todosByList(props.list.id).length
})

const handleClick = () => {
  listStore.setActiveList(props.list.id)
}
</script>

<template>
  <Motion
    :initial="{ opacity: 0, x: -10 }"
    :animate="{ opacity: 1, x: 0 }"
    :transition="{ ...SPRINGS.DEFAULT, delay: index * STAGGER_DELAY }"
  >
    <button
      @click="handleClick"
      :class="[
        'w-full px-3 py-2 rounded-lg text-left transition-all',
        isActive
          ? 'bg-[var(--color-sidebar-item-active)] text-emerald-700 dark:text-emerald-400 font-medium'
          : 'hover:bg-[var(--color-sidebar-item-hover)] text-gray-700 dark:text-gray-300'
      ]"
    >
      {{ list.name }}
      <span class="text-xs ml-2 opacity-70">({{ todoCount }})</span>
    </button>
  </Motion>
</template>
