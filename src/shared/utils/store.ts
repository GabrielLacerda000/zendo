import { Store } from 'tauri-plugin-store-api';
import { Todo } from '../../types/Todo';
import { TodoList } from '../../types/List';

// Initialize the store with a specific filename
const store = new Store('zendo-data.json');

// Store keys as constants
const STORE_KEYS = {
  TODOS: 'todos',
  LISTS: 'lists',
  ACTIVE_LIST_ID: 'activeListId',
} as const;

// Type-safe getter functions
export async function getTodos(): Promise<Todo[]> {
  const todos = await store.get<Todo[]>(STORE_KEYS.TODOS);
  return todos || [];
}

export async function getLists(): Promise<TodoList[]> {
  const lists = await store.get<TodoList[]>(STORE_KEYS.LISTS);
  return lists || [];
}

export async function getActiveListId(): Promise<string | null> {
  return await store.get<string>(STORE_KEYS.ACTIVE_LIST_ID) || null;
}

// Type-safe setter functions
export async function saveTodos(todos: Todo[]): Promise<void> {
  await store.set(STORE_KEYS.TODOS, todos);
  await store.save();
}

export async function saveLists(lists: TodoList[]): Promise<void> {
  await store.set(STORE_KEYS.LISTS, lists);
  await store.save();
}

export async function saveActiveListId(listId: string | null): Promise<void> {
  await store.set(STORE_KEYS.ACTIVE_LIST_ID, listId);
  await store.save();
}

// Clear all data (useful for testing/reset)
export async function clearStore(): Promise<void> {
  await store.clear();
  await store.save();
}

export { store };
