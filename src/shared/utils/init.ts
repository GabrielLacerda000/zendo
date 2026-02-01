import { useListStore } from "../../modules/lists/stores/listStore";
import { useTodoStore } from "../../modules/todos/stores/todoStore";
import { getDatabase } from "../database/connection";

export async function initializeApp() {
  // Initialize database connection first
  await getDatabase();

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
