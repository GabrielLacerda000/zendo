<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
    modelValue?: string;
    placeholder?: string;
    class?: any;
    isInvalid?: boolean;
    error?: string;
    variant?: "default" | "bare";
}

const props = withDefaults(defineProps<Props>(), {
    variant: "default",
});

const emit = defineEmits<{
    "update:modelValue": [value: string];
}>();

const inputClasses = computed(() => {
    const base = "w-full transition-all duration-200 focus:outline-none";
    const colors =
        "bg-transparent dark:text-gray-100 text-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-500";

    if (props.variant === "bare") {
        return [
            "w-full bg-transparent",
            "text-gray-800 dark:text-gray-100",
            "placeholder:text-gray-400 dark:placeholder:text-gray-500",

            "border-0 outline-none ring-0 shadow-none",
            "focus:border-0 focus:outline-none focus:ring-0 focus:shadow-none",
            "focus-visible:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none",

            "px-2 py-3",
        ].join(" ");
    }

    const borderStyle = props.isInvalid
        ? "border-red-500 dark:border-red-400 focus:border-red-600 dark:focus:border-red-300"
        : "border-gray-300 dark:border-brand-border ";

    return [
        base,
        colors,
        borderStyle,
        "rounded-xl border-2 px-3 py-2",
        "",
    ].join(" ");
});

// --- Actions ---
const inputRef = ref<HTMLInputElement | null>(null);
const focus = () => inputRef.value?.focus();
defineExpose({ focus });

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit("update:modelValue", target.value);
};
</script>

<template>
    <div :class="props.class">
        <input
            ref="inputRef"
            type="text"
            :value="modelValue"
            @input="handleInput"
            :placeholder="placeholder"
            :class="inputClasses"
        />

        <div
            v-if="error && props.variant === 'default'"
            class="text-red-600 dark:text-red-400 text-sm mt-1.5 ml-1"
        >
            {{ error }}
        </div>
    </div>
</template>
