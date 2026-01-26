<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { Motion } from "motion-v";
import { Todo } from "../../types/Todo";
import { useTodoStore } from "../../modules/todos/stores/todoStore";
import Btn from "./Btn.vue";
import BaseInput from "./BaseInput.vue";
import AnimatedCheckbox from "./AnimatedCheckbox.vue";

type Props = {
    todo: Todo;
};

const props = defineProps<Props>();
const emit = defineEmits<{
    close: [];
}>();

const todoStore = useTodoStore();

// Local state for title editing
const isEditingTitle = ref(false);
const localTitle = ref(props.todo.title);
const titleInputRef = ref<InstanceType<typeof BaseInput> | null>(null);

// Local state for description (for optimistic updates)
const localDescription = ref(props.todo.description || "");
const newChecklistItem = ref("");

// Computed
const completedCount = computed(() => {
    return props.todo.checklist.filter((item) => item.completed).length;
});

// Methods
const saveDescription = async () => {
    if (localDescription.value !== props.todo.description) {
        await todoStore.updateTodo(props.todo.id, {
            description: localDescription.value,
        });
    }
};

const addChecklistItem = async () => {
    if (!newChecklistItem.value.trim()) return;

    await todoStore.addChecklistItem(props.todo.id, newChecklistItem.value);
    newChecklistItem.value = "";
};

const toggleChecklistItem = async (itemId: string) => {
    await todoStore.toggleChecklistItem(props.todo.id, itemId);
};

const updateChecklistItem = async (itemId: string, text: string) => {
    await todoStore.updateChecklistItem(props.todo.id, itemId, text);
};

const deleteChecklistItem = async (itemId: string) => {
    await todoStore.deleteChecklistItem(props.todo.id, itemId);
};

// Title editing methods
const startEditingTitle = () => {
    localTitle.value = props.todo.title;
    isEditingTitle.value = true;
    nextTick(() => {
        titleInputRef.value?.focus();
    });
};

const saveTitle = async () => {
    const trimmedTitle = localTitle.value.trim();
    if (trimmedTitle && trimmedTitle !== props.todo.title) {
        await todoStore.updateTodo(props.todo.id, { title: trimmedTitle });
    } else if (!trimmedTitle) {
        // If empty, revert to original
        localTitle.value = props.todo.title;
    }
    isEditingTitle.value = false;
};

const cancelEditTitle = () => {
    localTitle.value = props.todo.title;
    isEditingTitle.value = false;
};
</script>

<template>
    <Teleport to="body">
        <!-- Modal overlay with backdrop fade -->
        <Motion
            :initial="{ opacity: 0 }"
            :animate="{ opacity: 1 }"
            :exit="{ opacity: 0 }"
            :transition="{ duration: 0.2 }"
        >
            <div
                class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                @click.self="emit('close')"
            >
                <!-- Modal content with scale + slide animation -->
                <Motion
                    :initial="{ opacity: 0, scale: 0.95, y: 20 }"
                    :animate="{ opacity: 1, scale: 1, y: 0 }"
                    :exit="{ opacity: 0, scale: 0.95, y: 20 }"
                    :transition="{ type: 'spring', stiffness: 300, damping: 25 }"
                    class="w-full max-w-4xl"
                >
                    <div
                        class="bg-white dark:bg-brand-background-secondary border border-gray-200 dark:border-brand-border rounded-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
                    >
                        <!-- Header -->
                        <div class="p-6 border-b border-gray-200 dark:border-brand-border">
                            <div class="flex items-start justify-between gap-4">
                                <!-- Title - click to edit -->
                                <h2
                                    v-if="!isEditingTitle"
                                    @click="startEditingTitle"
                                    class="text-xl font-semibold text-gray-800 dark:text-gray-100 cursor-pointer hover:bg-gray-100 dark:hover:bg-brand-background rounded-lg px-3 py-2 -ml-3 transition-colors"
                                >
                                    {{ todo.title }}
                                </h2>
                                <BaseInput
                                    v-else
                                    ref="titleInputRef"
                                    v-model="localTitle"
                                    @blur="saveTitle"
                                    @keyup.enter="saveTitle"
                                    @keyup.esc="cancelEditTitle"
                                    class="text-xl font-semibold flex-1"
                                />
                                <button
                                    @click="emit('close')"
                                    class="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 transition-colors flex-shrink-0"
                                    aria-label="Close modal"
                                >
                                    <svg
                                        class="w-6 h-6"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <!-- Scrollable content -->
                        <div class="flex-1 overflow-y-auto p-6 space-y-6">
                            <!-- Description section -->
                            <div>
                                <label
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                >
                                    Description
                                </label>
                                <textarea
                                    v-model="localDescription"
                                    @blur="saveDescription"
                                    placeholder="Add a description..."
                                    class="w-full px-3 py-2 bg-white dark:bg-brand-background border-2 border-gray-300 dark:border-brand-border rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:focus:ring-emerald-400/20 focus:border-emerald-500 dark:focus:border-emerald-400 min-h-[100px] resize-y transition-all"
                                />
                            </div>

                            <!-- Checklist section -->
                            <div>
                                <div class="flex items-center justify-between mb-3">
                                    <label
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        Checklist
                                    </label>
                                    <span class="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        {{ completedCount }}/{{ todo.checklist.length }}
                                        completed
                                    </span>
                                </div>

                                <!-- Checklist items with stagger -->
                                <div class="space-y-2 mb-3">
                                    <Motion
                                        v-for="(item, index) in todo.checklist"
                                        :key="item.id"
                                        :initial="{ opacity: 0, x: -10 }"
                                        :animate="{ opacity: 1, x: 0 }"
                                        :transition="{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 20 }"
                                    >
                                        <div
                                            class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-brand-background border border-gray-200 dark:border-brand-border rounded-xl hover:bg-gray-100 dark:hover:bg-brand-background-tertiary transition-colors"
                                        >
                                            <!-- Animated Checkbox -->
                                            <AnimatedCheckbox
                                                :model-value="item.completed"
                                                @update:model-value="toggleChecklistItem(item.id)"
                                            />

                                            <!-- Item text -->
                                            <input
                                                :value="item.text"
                                                @input="item.text = ($event.target as HTMLInputElement).value"
                                                @blur="updateChecklistItem(item.id, item.text)"
                                                class="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 transition-all"
                                                :class="{
                                                    'line-through text-gray-500 dark:text-gray-400':
                                                        item.completed,
                                                }"
                                            />

                                            <!-- Delete button -->
                                            <button
                                                @click="deleteChecklistItem(item.id)"
                                                class="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                                                aria-label="Delete item"
                                            >
                                                <svg
                                                    class="w-4 h-4"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    stroke-width="2"
                                                >
                                                    <line x1="18" y1="6" x2="6" y2="18" />
                                                    <line x1="6" y1="6" x2="18" y2="18" />
                                                </svg>
                                            </button>
                                        </div>
                                    </Motion>
                                </div>

                                <!-- Add checklist item -->
                                <div class="flex gap-2">
                                    <BaseInput
                                        v-model="newChecklistItem"
                                        @keyup.enter="addChecklistItem"
                                        placeholder="Add an item..."
                                        class="flex-1"
                                    />
                                    <Btn @click="addChecklistItem" label="Add" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Motion>
            </div>
        </Motion>
    </Teleport>
</template>
