import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { TodoList } from '../../../types/List';
import { useDatabase } from '../../../shared/composables/useDatabase';

export const useListStore = defineStore('lists', () => {
  const db = useDatabase();

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
    lists.value = await db.lists.getAll();
    activeListId.value = await db.settings.getActiveListId();
  }

  async function createList(name: string) {
    const newList: TodoList = {
      id: uuidv4(),
      name,
      order: lists.value.length,
    };

    await db.lists.create(newList);
    lists.value.push(newList);

    // Set as active if it's the first list
    if (lists.value.length === 1) {
      await setActiveList(newList.id);
    }

    return newList;
  }

  async function updateList(id: string, updates: Partial<TodoList>) {
    const index = lists.value.findIndex(list => list.id === id);
    if (index === -1) return;

    await db.lists.update(id, updates);
    lists.value[index] = { ...lists.value[index], ...updates };
  }

  async function deleteList(id: string) {
    const index = lists.value.findIndex(list => list.id === id);
    if (index === -1) return;

    await db.lists.delete(id);
    lists.value.splice(index, 1);

    // Reorder remaining lists
    const reorders = lists.value.map((list, idx) => {
      list.order = idx;
      return { id: list.id, order: idx };
    });
    await db.lists.updateOrders(reorders);

    // If deleted list was active, set first list as active
    if (activeListId.value === id) {
      const newActiveId = lists.value.length > 0 ? lists.value[0].id : null;
      await setActiveList(newActiveId);
    }
  }

  async function reorderLists(reorderedLists: TodoList[]) {
    const reorders = reorderedLists.map((list, idx) => {
      list.order = idx;
      return { id: list.id, order: idx };
    });
    await db.lists.updateOrders(reorders);
    lists.value = reorderedLists;
  }

  async function setActiveList(listId: string | null) {
    activeListId.value = listId;
    await db.settings.setActiveListId(listId);
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
