import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { ChecklistItem, Todo } from '../../../types/Todo';
import { getTodos, saveTodos } from '../../../shared/utils/store';

export const useTodoStore = defineStore('todos', () => {
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
    todos.value = await getTodos();
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

    todos.value.push(newTodo);
    await saveTodos(todos.value);

    return newTodo;
  }

  async function updateTodo(id: string, updates: Partial<Todo>) {
    const index = todos.value.findIndex(todo => todo.id === id);
    if (index === -1) return;

    todos.value[index] = {
      ...todos.value[index],
      ...updates,
      updatedAt: Date.now(),
    };

    await saveTodos(todos.value);
  }

  async function deleteTodo(id: string) {
    const todo = todos.value.find(t => t.id === id);
    if (!todo) return;

    const listId = todo.listId;

    // Remove the todo
    const index = todos.value.findIndex(t => t.id === id);
    todos.value.splice(index, 1);

    // Reorder remaining todos in the same list
    const listTodos = todos.value.filter(t => t.listId === listId);
    listTodos.forEach((t, idx) => {
      t.order = idx;
    });

    await saveTodos(todos.value);
  }

  async function toggleTodo(id: string) {
    const todo = todos.value.find(t => t.id === id);
    if (!todo) return;

    todo.completed = !todo.completed;
    todo.updatedAt = Date.now();

    await saveTodos(todos.value);
  }

  async function reorderTodos(listId: string, reorderedTodos: Todo[]) {
    // Update order for reordered todos
    reorderedTodos.forEach((todo, idx) => {
      todo.order = idx;
      todo.updatedAt = Date.now();
    });

    // Replace todos for this list
    const otherTodos = todos.value.filter(t => t.listId !== listId);
    todos.value = [...otherTodos, ...reorderedTodos];

    await saveTodos(todos.value);
  }

  async function moveTodo(todoId: string, newListId: string) {
    const todo = todos.value.find(t => t.id === todoId);
    if (!todo) return;

    const oldListId = todo.listId;

    // Update todo's listId
    todo.listId = newListId;
    todo.updatedAt = Date.now();

    // Reorder old list
    const oldListTodos = todos.value.filter(t => t.listId === oldListId);
    oldListTodos.forEach((t, idx) => {
      t.order = idx;
    });

    // Set new order in new list (add to end)
    const newListTodos = todos.value.filter(t => t.listId === newListId);
    todo.order = newListTodos.length - 1;

    await saveTodos(todos.value);
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

    todo.checklist.push(newItem);
    todo.updatedAt = Date.now();

    await saveTodos(todos.value);

    return newItem;
  }

  async function toggleChecklistItem(todoId: string, itemId: string) {
    const todo = todos.value.find(t => t.id === todoId);
    if (!todo) return;

    const item = todo.checklist.find(i => i.id === itemId);
    if (!item) return;

    item.completed = !item.completed;
    todo.updatedAt = Date.now();

    await saveTodos(todos.value);
  }

  async function updateChecklistItem(todoId: string, itemId: string, text: string) {
    const todo = todos.value.find(t => t.id === todoId);
    if (!todo) return;

    const item = todo.checklist.find(i => i.id === itemId);
    if (!item) return;

    item.text = text;
    todo.updatedAt = Date.now();

    await saveTodos(todos.value);
  }

  async function deleteChecklistItem(todoId: string, itemId: string) {
    const todo = todos.value.find(t => t.id === todoId);
    if (!todo) return;

    const index = todo.checklist.findIndex(i => i.id === itemId);
    if (index === -1) return;

    todo.checklist.splice(index, 1);
    todo.updatedAt = Date.now();

    await saveTodos(todos.value);
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
