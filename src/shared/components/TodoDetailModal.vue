<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { Todo } from "../../types/Todo";
import { useTodoStore } from "../../modules/todos/stores/todoStore";
import Btn from "./Btn.vue";
import BaseInput from "./BaseInput.vue";

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
    <!-- Modal overlay -->
    <div
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        @click.self="emit('close')"
    >
        <!-- Modal content -->
        <div
            class="bg-brand-background-secondary border border-brand-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
            <!-- Header -->
            <div class="p-6 border-b border-brand-border">
                <div class="flex items-start justify-between">
                    <!-- Title - click to edit -->
                    <h2
                        v-if="!isEditingTitle"
                        @click="startEditingTitle"
                        class="text-xl font-semibold text-brand-text cursor-pointer hover:bg-brand-background rounded px-2 py-1 -ml-2 transition-colors"
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
                        class="text-xl font-semibold flex-1 mr-4"
                    />
                    <button
                        @click="emit('close')"
                        class="text-brand-text-secondary hover:text-brand-text"
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
                        class="block text-sm font-medium text-brand-text mb-2"
                    >
                        Description
                    </label>
                    <textarea
                        v-model="localDescription"
                        @blur="saveDescription"
                        placeholder="Add a description..."
                        class="w-full px-3 py-2 bg-brand-background border border-brand-border rounded-lg text-brand-text placeholder-brand-text-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-25 resize-y"
                    />
                </div>

                <!-- Checklist section -->
                <div>
                    <div class="flex items-center justify-between mb-3">
                        <label
                            class="block text-sm font-medium text-brand-text"
                        >
                            Checklist
                        </label>
                        <span class="text-xs text-brand-text-secondary">
                            {{ completedCount }}/{{ todo.checklist.length }}
                            completed
                        </span>
                    </div>

                    <!-- Checklist items -->
                    <div class="space-y-2 mb-3">
                        <div
                            v-for="item in todo.checklist"
                            :key="item.id"
                            class="flex items-center gap-2 p-2 bg-brand-background border border-brand-border rounded-lg"
                        >
                            <!-- Checkbox -->
                            <input
                                type="checkbox"
                                :checked="item.completed"
                                @change="toggleChecklistItem(item.id)"
                                class="w-4 h-4 rounded border-brand-border"
                            />

                            <!-- Item text -->
                            <BaseInput
                                :model-value="item.text"
                                @update:model-value="item.text = $event"
                                @blur="updateChecklistItem(item.id, item.text)"
                                class="flex-1 bg-transparent border-none focus:ring-0"
                                :class="{
                                    'line-through text-brand-text-secondary':
                                        item.completed,
                                }"
                            />

                            <!-- Delete button -->
                            <button
                                @click="deleteChecklistItem(item.id)"
                                class="text-brand-text-secondary hover:text-red-500"
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
    </div>
</template>
