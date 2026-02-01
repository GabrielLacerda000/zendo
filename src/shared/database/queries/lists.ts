import { getDatabase } from '../connection';
import type { TodoListRow } from '../types';
import type { TodoList } from '../../../types/List';

// Convert database row to app model
function rowToList(row: TodoListRow): TodoList {
  return {
    id: row.id,
    name: row.name,
    order: row.order,
  };
}

export async function getAllLists(): Promise<TodoList[]> {
  const db = await getDatabase();
  const rows = await db.select<TodoListRow[]>(
    'SELECT id, name, "order" FROM todo_lists ORDER BY "order" ASC'
  );
  return rows.map(rowToList);
}

export async function createList(list: TodoList): Promise<void> {
  const db = await getDatabase();
  await db.execute(
    'INSERT INTO todo_lists (id, name, "order") VALUES ($1, $2, $3)',
    [list.id, list.name, list.order]
  );
}

export async function updateList(id: string, updates: Partial<TodoList>): Promise<void> {
  const db = await getDatabase();
  const setClauses: string[] = [];
  const values: (string | number)[] = [];
  let paramIndex = 1;

  if (updates.name !== undefined) {
    setClauses.push(`name = $${paramIndex++}`);
    values.push(updates.name);
  }
  if (updates.order !== undefined) {
    setClauses.push(`"order" = $${paramIndex++}`);
    values.push(updates.order);
  }

  if (setClauses.length === 0) return;

  values.push(id);
  await db.execute(
    `UPDATE todo_lists SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`,
    values
  );
}

export async function deleteList(id: string): Promise<void> {
  const db = await getDatabase();
  await db.execute('DELETE FROM todo_lists WHERE id = $1', [id]);
}

export async function updateListOrders(lists: { id: string; order: number }[]): Promise<void> {
  const db = await getDatabase();
  for (const list of lists) {
    await db.execute(
      'UPDATE todo_lists SET "order" = $1 WHERE id = $2',
      [list.order, list.id]
    );
  }
}
