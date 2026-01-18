import { useListStore } from "../../modules/lists/stores/listStore";
import { useTodoStore } from "../../modules/todos/stores/todoStore";

export async function initializeApp() {
  const listStore = useListStore();
  const todoStore = useTodoStore();

  // Load existing data
  await listStore.loadLists();
  await todoStore.loadTodos();

  // Create default "Personal" list if no lists exist
  if (listStore.lists.length === 0) {
    await listStore.createList('Personal');
  }

  // Ensure there's an active list
  if (!listStore.activeListId && listStore.lists.length > 0) {
    await listStore.setActiveList(listStore.lists[0].id);
  }
}

// Future migration function (for SQLite migration)
export async function migrateData() {
  // Placeholder for future JSON -> SQLite migration
  // Will be implemented when migrating to SQLite
}
