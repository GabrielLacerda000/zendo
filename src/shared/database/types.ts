// Database row types (snake_case to match SQL columns)

export interface TodoListRow {
  id: string;
  name: string;
  order: number;
}

export interface TodoRow {
  id: string;
  title: string;
  description: string | null;
  completed: number; // SQLite uses 0/1 for booleans
  priority: string;
  list_id: string;
  order: number;
  created_at: number;
  updated_at: number;
}

export interface ChecklistItemRow {
  id: string;
  todo_id: string;
  text: string;
  completed: number; // SQLite uses 0/1 for booleans
  order: number;
}

export interface AppSettingRow {
  key: string;
  value: string | null;
}
