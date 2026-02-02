import { getDatabase } from '../connection';
import type { AppSettingRow } from '../types';

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDatabase();
  const rows = await db.select<AppSettingRow[]>(
    'SELECT key, value FROM app_settings WHERE key = $1',
    [key]
  );
  return rows[0]?.value ?? null;
}

export async function setSetting(key: string, value: string | null): Promise<void> {
  const db = await getDatabase();
  await db.execute(
    'INSERT OR REPLACE INTO app_settings (key, value) VALUES ($1, $2)',
    [key, value]
  );
}

export async function getActiveListId(): Promise<string | null> {
  return getSetting('activeListId');
}

export async function setActiveListId(listId: string | null): Promise<void> {
  await setSetting('activeListId', listId);
}
