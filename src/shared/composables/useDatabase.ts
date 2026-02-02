import * as listsDb from '../database/queries/lists';
import * as todosDb from '../database/queries/todos';
import * as checklistDb from '../database/queries/checklist';
import * as settingsDb from '../database/queries/settings';
import { getDatabase } from '../database/connection';

export function useDatabase() {
  return {
    // Initialize database connection
    init: getDatabase,

    lists: {
      getAll: listsDb.getAllLists,
      create: listsDb.createList,
      update: listsDb.updateList,
      delete: listsDb.deleteList,
      updateOrders: listsDb.updateListOrders,
    },

    todos: {
      getAll: todosDb.getAllTodos,
      getByList: todosDb.getTodosByList,
      create: todosDb.createTodo,
      update: todosDb.updateTodo,
      delete: todosDb.deleteTodo,
      updateOrders: todosDb.updateTodoOrders,
    },

    checklist: {
      add: checklistDb.addChecklistItem,
      update: checklistDb.updateChecklistItem,
      delete: checklistDb.deleteChecklistItem,
      getCount: checklistDb.getChecklistCountForTodo,
    },

    settings: {
      get: settingsDb.getSetting,
      set: settingsDb.setSetting,
      getActiveListId: settingsDb.getActiveListId,
      setActiveListId: settingsDb.setActiveListId,
    },
  };
}
