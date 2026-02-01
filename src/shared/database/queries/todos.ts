import { getDatabase } from '../connection';
import type { TodoRow, ChecklistItemRow } from '../types';
import type { Todo, ChecklistItem } from '../../../types/Todo';

// Convert database row to app model
function rowToTodo(row: TodoRow, checklistItems: ChecklistItem[]): Todo {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    checklist: checklistItems,
    completed: row.completed === 1,
    priority: row.priority as 'low' | 'medium' | 'high',
    listId: row.list_id,
    order: row.order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToChecklistItem(row: ChecklistItemRow): ChecklistItem {
  return {
    id: row.id,
    text: row.text,
    completed: row.completed === 1,
  };
}

export async function getAllTodos(): Promise<Todo[]> {
  const db = await getDatabase();

  const todoRows = await db.select<TodoRow[]>(
    'SELECT id, title, description, completed, priority, list_id, "order", created_at, updated_at FROM todos ORDER BY "order" ASC'
  );

  const checklistRows = await db.select<ChecklistItemRow[]>(
    'SELECT id, todo_id, text, completed, "order" FROM checklist_items ORDER BY "order" ASC'
  );

  // Group checklist items by todo_id
  const checklistByTodoId = new Map<string, ChecklistItem[]>();
  for (const row of checklistRows) {
    const items = checklistByTodoId.get(row.todo_id) || [];
    items.push(rowToChecklistItem(row));
    checklistByTodoId.set(row.todo_id, items);
  }

  return todoRows.map(row => rowToTodo(row, checklistByTodoId.get(row.id) || []));
}

export async function getTodosByList(listId: string): Promise<Todo[]> {
  const db = await getDatabase();

  const todoRows = await db.select<TodoRow[]>(
    'SELECT id, title, description, completed, priority, list_id, "order", created_at, updated_at FROM todos WHERE list_id = $1 ORDER BY "order" ASC',
    [listId]
  );

  if (todoRows.length === 0) return [];

  const todoIds = todoRows.map(t => t.id);
  const placeholders = todoIds.map((_, i) => `$${i + 1}`).join(', ');

  const checklistRows = await db.select<ChecklistItemRow[]>(
    `SELECT id, todo_id, text, completed, "order" FROM checklist_items WHERE todo_id IN (${placeholders}) ORDER BY "order" ASC`,
    todoIds
  );

  // Group checklist items by todo_id
  const checklistByTodoId = new Map<string, ChecklistItem[]>();
  for (const row of checklistRows) {
    const items = checklistByTodoId.get(row.todo_id) || [];
    items.push(rowToChecklistItem(row));
    checklistByTodoId.set(row.todo_id, items);
  }

  return todoRows.map(row => rowToTodo(row, checklistByTodoId.get(row.id) || []));
}

export async function createTodo(todo: Todo): Promise<void> {
  const db = await getDatabase();
  await db.execute(
    'INSERT INTO todos (id, title, description, completed, priority, list_id, "order", created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    [
      todo.id,
      todo.title,
      todo.description ?? null,
      todo.completed ? 1 : 0,
      todo.priority,
      todo.listId,
      todo.order,
      todo.createdAt,
      todo.updatedAt,
    ]
  );

  // Insert checklist items
  for (let i = 0; i < todo.checklist.length; i++) {
    const item = todo.checklist[i];
    await db.execute(
      'INSERT INTO checklist_items (id, todo_id, text, completed, "order") VALUES ($1, $2, $3, $4, $5)',
      [item.id, todo.id, item.text, item.completed ? 1 : 0, i]
    );
  }
}

export async function updateTodo(id: string, updates: Partial<Todo>): Promise<void> {
  const db = await getDatabase();
  const setClauses: string[] = [];
  const values: (string | number | null)[] = [];
  let paramIndex = 1;

  if (updates.title !== undefined) {
    setClauses.push(`title = $${paramIndex++}`);
    values.push(updates.title);
  }
  if (updates.description !== undefined) {
    setClauses.push(`description = $${paramIndex++}`);
    values.push(updates.description ?? null);
  }
  if (updates.completed !== undefined) {
    setClauses.push(`completed = $${paramIndex++}`);
    values.push(updates.completed ? 1 : 0);
  }
  if (updates.priority !== undefined) {
    setClauses.push(`priority = $${paramIndex++}`);
    values.push(updates.priority);
  }
  if (updates.listId !== undefined) {
    setClauses.push(`list_id = $${paramIndex++}`);
    values.push(updates.listId);
  }
  if (updates.order !== undefined) {
    setClauses.push(`"order" = $${paramIndex++}`);
    values.push(updates.order);
  }
  if (updates.updatedAt !== undefined) {
    setClauses.push(`updated_at = $${paramIndex++}`);
    values.push(updates.updatedAt);
  }

  if (setClauses.length === 0) return;

  values.push(id);
  await db.execute(
    `UPDATE todos SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`,
    values
  );
}

export async function deleteTodo(id: string): Promise<void> {
  const db = await getDatabase();
  // Checklist items will be deleted by ON DELETE CASCADE
  await db.execute('DELETE FROM todos WHERE id = $1', [id]);
}

export async function updateTodoOrders(todos: { id: string; order: number; updatedAt: number }[]): Promise<void> {
  const db = await getDatabase();
  for (const todo of todos) {
    await db.execute(
      'UPDATE todos SET "order" = $1, updated_at = $2 WHERE id = $3',
      [todo.order, todo.updatedAt, todo.id]
    );
  }
}
