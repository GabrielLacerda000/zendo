import { getDatabase } from '../connection';
import type { ChecklistItem } from '../../../types/Todo';

export async function addChecklistItem(todoId: string, item: ChecklistItem, order: number): Promise<void> {
  const db = await getDatabase();
  await db.execute(
    'INSERT INTO checklist_items (id, todo_id, text, completed, "order") VALUES ($1, $2, $3, $4, $5)',
    [item.id, todoId, item.text, item.completed ? 1 : 0, order]
  );
}

export async function updateChecklistItem(itemId: string, updates: { text?: string; completed?: boolean }): Promise<void> {
  const db = await getDatabase();
  const setClauses: string[] = [];
  const values: (string | number)[] = [];
  let paramIndex = 1;

  if (updates.text !== undefined) {
    setClauses.push(`text = $${paramIndex++}`);
    values.push(updates.text);
  }
  if (updates.completed !== undefined) {
    setClauses.push(`completed = $${paramIndex++}`);
    values.push(updates.completed ? 1 : 0);
  }

  if (setClauses.length === 0) return;

  values.push(itemId);
  await db.execute(
    `UPDATE checklist_items SET ${setClauses.join(', ')} WHERE id = $${paramIndex}`,
    values
  );
}

export async function deleteChecklistItem(itemId: string): Promise<void> {
  const db = await getDatabase();
  await db.execute('DELETE FROM checklist_items WHERE id = $1', [itemId]);
}

export async function getChecklistCountForTodo(todoId: string): Promise<number> {
  const db = await getDatabase();
  const result = await db.select<{ count: number }[]>(
    'SELECT COUNT(*) as count FROM checklist_items WHERE todo_id = $1',
    [todoId]
  );
  return result[0]?.count ?? 0;
}
