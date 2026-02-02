<script setup lang="ts">
import { ref, computed } from "vue";
import { CheckSquare, Plus } from "lucide-vue-next";
import BaseInput from "./BaseInput.vue";
import SidebarListItem from "./SidebarListItem.vue";
import { useListStore } from "../../modules/lists/stores/listStore";

const listStore = useListStore();
const newListName = ref("");
const isCreatingInvalidList = ref(false);
const validationError = ref("");

const inputContainerClasses = computed(() => {
    const base =
        "flex items-center gap-1 p-1 bg-white dark:bg-brand-background-secondary border-2 rounded-xl transition-all";

    const focusStyles =
        "focus-within:ring-2 focus-within:border-emerald-500 focus-within:ring-emerald-500/20";

    const stateStyles = isCreatingInvalidList.value
        ? "border-red-500 focus-within:ring-red-500/20"
        : "border-gray-300 dark:border-brand-border";

    return [base, focusStyles, stateStyles].join(" ");
});

const handleCreateList = async () => {
    isCreatingInvalidList.value = false;
    validationError.value = "";

    if (!newListName.value.trim()) {
        validationError.value = "Enter list name";
        isCreatingInvalidList.value = true;
        return;
    }

    const newList = await listStore.createList(newListName.value.trim());
    await listStore.setActiveList(newList.id);
    newListName.value = "";
};
</script>

<template>
    <aside
        class="w-64 bg-[var(--color-sidebar-bg)] border-r border-[var(--color-sidebar-border)] flex flex-col relative transition-colors"
    >
        <div class="p-6 border-b border-[var(--color-sidebar-border)]">
            <div class="flex items-center gap-2">
                <CheckSquare
                    class="w-6 h-6 text-emerald-600 dark:text-emerald-500"
                />
                <h1 class="text-xl font-bold text-[var(--color-sidebar-text)]">
                    Zendo
                </h1>
            </div>
        </div>

        <div class="flex-1 p-4 overflow-y-auto">
            <h2
                class="text-xs font-semibold uppercase mb-3 text-gray-500 dark:text-gray-400 tracking-wide"
            >
                MY LISTS
            </h2>
            <div class="space-y-1">
                <SidebarListItem
                    v-for="(list, index) in listStore.sortedLists"
                    :key="list.id"
                    :list="list"
                    :isActive="list.id === listStore.activeListId"
                    :index="index"
                />
                <div
                    v-if="listStore.sortedLists.length === 0"
                    class="text-gray-500 dark:text-gray-400 text-sm text-center py-4"
                >
                    Create your first list
                </div>
            </div>
        </div>

        <div class="p-4 border-t border-[var(--color-sidebar-border)]">
            <div class="flex flex-col gap-1.5">
                <div :class="inputContainerClasses">
                    <BaseInput
                        v-model="newListName"
                        variant="bare"
                        placeholder="New List..."
                        class="flex-1"
                        @keyup.enter="handleCreateList"
                    />

                    <button
                        @click="handleCreateList"
                        class="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors cursor-pointer group m-2"
                    >
                        <Plus
                            class="w-4 h-4 text-white group-hover:scale-110 transition-transform"
                        />
                    </button>
                </div>

                <p
                    v-if="isCreatingInvalidList"
                    class="text-red-500 text-[11px] ml-1 font-medium italic"
                >
                    {{ validationError }}
                </p>
            </div>
        </div>
    </aside>
</template>
