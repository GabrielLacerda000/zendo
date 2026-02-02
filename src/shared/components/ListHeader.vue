<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { Motion } from "motion-v";
import { SPRINGS } from "../constants/animations";
import BaseInput from "./BaseInput.vue"; // Certifique-se do caminho correto

interface Props {
    listName: string;
    completedCount: number;
    totalCount: number;
    completionPercentage: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    "update:listName": [newName: string];
}>();

// --- Estado de Edição ---
const isEditing = ref(false);
const localName = ref(props.listName);
const inputRef = ref<InstanceType<typeof BaseInput> | null>(null);

const startEditing = () => {
    localName.value = props.listName;
    isEditing.value = true;
    nextTick(() => {
        inputRef.value?.focus();
    });
};

const handleSave = () => {
    const trimmed = localName.value.trim();
    if (trimmed && trimmed !== props.listName) {
        emit("update:listName", trimmed);
    } else {
        localName.value = props.listName;
    }
    isEditing.value = false;
};

const handleCancel = () => {
    localName.value = props.listName;
    isEditing.value = false;
};

const containerClasses =
    "mt-4 h-2 bg-[var(--color-progress-bg)] rounded-full overflow-hidden";
const progressFillClasses =
    "h-full bg-[var(--color-progress-fill)] rounded-full";

const safePercentage = computed(() => {
    return Math.min(Math.max(props.completionPercentage, 0), 100);
});
</script>

<template>
    <div class="w-full">
        <div class="flex flex-col">
            <h1
                v-if="!isEditing"
                @click="startEditing"
                class="text-3xl font-bold text-gray-800 dark:text-gray-100 cursor-pointer hover:opacity-70 transition-opacity min-h-[40px] flex items-center"
            >
                {{ listName }}
            </h1>

            <BaseInput
                v-else
                ref="inputRef"
                v-model="localName"
                variant="bare"
                class="text-3xl font-bold text-gray-800 dark:text-gray-100"
                @blur="handleSave"
                @keyup.enter="handleSave"
                @keyup.esc="handleCancel"
            />

            <p class="text-gray-500 dark:text-gray-400 mt-2">
                {{ completedCount }} of {{ totalCount }} tasks completed
            </p>
        </div>

        <div :class="containerClasses">
            <Motion
                :initial="{ width: '0%' }"
                :animate="{ width: `${safePercentage}%` }"
                :transition="SPRINGS.DEFAULT"
                :class="progressFillClasses"
            />
        </div>
    </div>
</template>
