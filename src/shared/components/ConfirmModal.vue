<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { Motion } from 'motion-v'
import Btn from './Btn.vue'

interface Props {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning'
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Delete',
  cancelText: 'Cancel',
  variant: 'danger'
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.isOpen) {
    emit('cancel')
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Motion
      v-if="isOpen"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="{ duration: 0.2 }"
    >
      <div
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="emit('cancel')"
      >
        <Motion
          :initial="{ opacity: 0, scale: 0.95, y: 20 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :exit="{ opacity: 0, scale: 0.95, y: 20 }"
          :transition="{ type: 'spring', stiffness: 300, damping: 25 }"
        >
          <div
            class="bg-white dark:bg-brand-background-secondary border border-gray-200 dark:border-brand-border rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
          >
            <!-- Header -->
            <div class="p-6 pb-4">
              <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {{ title }}
              </h2>
            </div>

            <!-- Content -->
            <div class="px-6 pb-6">
              <p class="text-gray-600 dark:text-gray-400">
                {{ message }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 px-6 pb-6">
              <Btn
                @click="emit('cancel')"
                :label="cancelText"
                variant="secondary"
              />
              <Btn
                @click="emit('confirm')"
                :label="confirmText"
                :variant="variant === 'danger' ? 'danger' : 'primary'"
              />
            </div>
          </div>
        </Motion>
      </div>
    </Motion>
  </Teleport>
</template>
