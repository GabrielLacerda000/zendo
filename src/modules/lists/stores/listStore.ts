import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { TodoList } from '../../../types/List';
// import { store } from '../../../shared/utils/store';
// import type { TodoList } from '@/types/List';
import { getLists, saveLists, getActiveListId, saveActiveListId } from '../../../shared/utils/store';

export const useListStore = defineStore('lists', () => {
  // State
  const lists = ref<TodoList[]>([]);
  const activeListId = ref<string | null>(null);

  // Getters
  const sortedLists = computed(() => {
    return [...lists.value].sort((a, b) => a.order - b.order);
  });

  const activeList = computed(() => {
    if (!activeListId.value) return null;
    return lists.value.find(list => list.id === activeListId.value) || null;
  });

  // Actions
  async function loadLists() {
    lists.value = await getLists();
    activeListId.value = await getActiveListId();
  }

  async function createList(name: string) {
    const newList: TodoList = {
      id: uuidv4(),
      name,
      order: lists.value.length,
    };

    lists.value.push(newList);
    await saveLists(lists.value);

    // Set as active if it's the first list
    if (lists.value.length === 1) {
      await setActiveList(newList.id);
    }

    return newList;
  }

  async function updateList(id: string, updates: Partial<TodoList>) {
    const index = lists.value.findIndex(list => list.id === id);
    if (index === -1) return;

    lists.value[index] = { ...lists.value[index], ...updates };
    await saveLists(lists.value);
  }

  async function deleteList(id: string) {
    const index = lists.value.findIndex(list => list.id === id);
    if (index === -1) return;

    lists.value.splice(index, 1);

    // Reorder remaining lists
    lists.value.forEach((list, idx) => {
      list.order = idx;
    });

    await saveLists(lists.value);

    // If deleted list was active, set first list as active
    if (activeListId.value === id) {
      const newActiveId = lists.value.length > 0 ? lists.value[0].id : null;
      await setActiveList(newActiveId);
    }
  }

  async function reorderLists(reorderedLists: TodoList[]) {
    reorderedLists.forEach((list, idx) => {
      list.order = idx;
    });
    lists.value = reorderedLists;
    await saveLists(lists.value);
  }

  async function setActiveList(listId: string | null) {
    activeListId.value = listId;
    await saveActiveListId(listId);
  }

  return {
    // State
    lists,
    activeListId,

    // Getters
    sortedLists,
    activeList,

    // Actions
    loadLists,
    createList,
    updateList,
    deleteList,
    reorderLists,
    setActiveList,
  };
});
