import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { ChecklistItem, Todo } from '../../../types/Todo';
import { useDatabase } from '../../../shared/composables/useDatabase';

export const useTodoStore = defineStore('todos', () => {
  const db = useDatabase();

  // State
  const todos = ref<Todo[]>([]);

  // Getters
  const todosByList = computed(() => {
    return (listId: string) => {
      return todos.value
        .filter(todo => todo.listId === listId)
        .sort((a, b) => a.order - b.order);
    };
  });

  const completedTodos = computed(() => {
    return todos.value.filter(todo => todo.completed);
  });

  const activeTodos = computed(() => {
    return todos.value.filter(todo => !todo.completed);
  });

  // Actions
  async function loadTodos() {
    todos.value = await db.todos.getAll();
  }

  async function createTodo(todoData: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'order'>) {
    const listTodos = todos.value.filter(t => t.listId === todoData.listId);

    const newTodo: Todo = {
      id: uuidv4(),
      ...todoData,
      order: listTodos.length,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await db.todos.create(newTodo);
    todos.value.push(newTodo);

    return newTodo;
  }

  async function updateTodo(id: string, updates: Partial<Todo>) {
    const index = todos.value.findIndex(todo => todo.id === id);
    if (index === -1) return;

    const updatedAt = Date.now();
    await db.todos.update(id, { ...updates, updatedAt });

    todos.value[index] = {
      ...todos.value[index],
      ...updates,
      updatedAt,
    };
  }

  async function deleteTodo(id: string) {
    const todo = todos.value.find(t => t.id === id);
    if (!todo) return;

    const listId = todo.listId;

    await db.todos.delete(id);

    // Remove the todo from local state
    const index = todos.value.findIndex(t => t.id === id);
    todos.value.splice(index, 1);

    // Reorder remaining todos in the same list
    const listTodos = todos.value.filter(t => t.listId === listId);
    const now = Date.now();
    const reorders = listTodos.map((t, idx) => {
      t.order = idx;
      t.updatedAt = now;
      return { id: t.id, order: idx, updatedAt: now };
    });
    await db.todos.updateOrders(reorders);
  }

  async function toggleTodo(id: string) {
    const todo = todos.value.find(t => t.id === id);
    if (!todo) return;

    const completed = !todo.completed;
    const updatedAt = Date.now();

    await db.todos.update(id, { completed, updatedAt });

    todo.completed = completed;
    todo.updatedAt = updatedAt;
  }

  async function reorderTodos(listId: string, reorderedTodos: Todo[]) {
    const now = Date.now();
    const reorders = reorderedTodos.map((todo, idx) => {
      todo.order = idx;
      todo.updatedAt = now;
      return { id: todo.id, order: idx, updatedAt: now };
    });

    await db.todos.updateOrders(reorders);

    // Replace todos for this list
    const otherTodos = todos.value.filter(t => t.listId !== listId);
    todos.value = [...otherTodos, ...reorderedTodos];
  }

  async function moveTodo(todoId: string, newListId: string) {
    const todo = todos.value.find(t => t.id === todoId);
    if (!todo) return;

    const oldListId = todo.listId;
    const now = Date.now();

    // Update todo's listId
    todo.listId = newListId;
    todo.updatedAt = now;

    // Reorder old list
    const oldListTodos = todos.value.filter(t => t.listId === oldListId);
    const oldReorders = oldListTodos.map((t, idx) => {
      t.order = idx;
      return { id: t.id, order: idx, updatedAt: now };
    });

    // Set new order in new list (add to end)
    const newListTodos = todos.value.filter(t => t.listId === newListId);
    todo.order = newListTodos.length - 1;

    await db.todos.update(todoId, { listId: newListId, order: todo.order, updatedAt: now });
    await db.todos.updateOrders(oldReorders);
  }

  // Checklist operations
  async function addChecklistItem(todoId: string, text: string) {
    const todo = todos.value.find(t => t.id === todoId);
    if (!todo) return;

    const newItem: ChecklistItem = {
      id: uuidv4(),
      text,
      completed: false,
    };

    const order = todo.checklist.length;
    await db.checklist.add(todoId, newItem, order);

    todo.checklist.push(newItem);
    todo.updatedAt = Date.now();
    await db.todos.update(todoId, { updatedAt: todo.updatedAt });

    return newItem;
  }

  async function toggleChecklistItem(todoId: string, itemId: string) {
    const todo = todos.value.find(t => t.id === todoId);
    if (!todo) return;

    const item = todo.checklist.find(i => i.id === itemId);
    if (!item) return;

    const completed = !item.completed;
    await db.checklist.update(itemId, { completed });

    item.completed = completed;
    todo.updatedAt = Date.now();
    await db.todos.update(todoId, { updatedAt: todo.updatedAt });
  }

  async function updateChecklistItem(todoId: string, itemId: string, text: string) {
    const todo = todos.value.find(t => t.id === todoId);
    if (!todo) return;

    const item = todo.checklist.find(i => i.id === itemId);
    if (!item) return;

    await db.checklist.update(itemId, { text });

    item.text = text;
    todo.updatedAt = Date.now();
    await db.todos.update(todoId, { updatedAt: todo.updatedAt });
  }

  async function deleteChecklistItem(todoId: string, itemId: string) {
    const todo = todos.value.find(t => t.id === todoId);
    if (!todo) return;

    const index = todo.checklist.findIndex(i => i.id === itemId);
    if (index === -1) return;

    await db.checklist.delete(itemId);

    todo.checklist.splice(index, 1);
    todo.updatedAt = Date.now();
    await db.todos.update(todoId, { updatedAt: todo.updatedAt });
  }

  return {
    // State
    todos,

    // Getters
    todosByList,
    completedTodos,
    activeTodos,

    // Actions
    loadTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reorderTodos,
    moveTodo,

    // Checklist actions
    addChecklistItem,
    toggleChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
  };
});
