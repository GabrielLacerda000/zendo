# Zendo To-Do App - Development Milestones & Checkpoints

## Project Overview
Building a local-first desktop to-do app using Tauri + Vue 3 + TypeScript with system tray integration.

**Current Status:** Project initialized with Tauri v2 + Vue 3 + TypeScript. Clean slate ready for feature development.

---

## 🎯 Milestone 1: Foundation & Dependencies (Week 1)

### Goal
Set up the complete development foundation with all required dependencies and project structure.

### Tasks

#### 1.1 Install Missing Dependencies
**Dependencies to add:**
```bash
# Frontend
bun add pinia
bun add @vueuse/core
bun add uuid
bun add -D @types/uuid

# Drag & Drop (for v1.1)
bun add @vueuse/integrations
bun add sortablejs
bun add -D @types/sortablejs

# Tauri Plugins
cd src-tauri
cargo add tauri-plugin-store
```

**Checkpoint:** ✅ All dependencies installed without errors, `bun dev` runs successfully

#### 1.2 Create Project Structure
**Folders to create:**
```
src/
├── app/
│   ├── layouts/
│   └── router/
├── modules/
│   ├── todos/
│   │   ├── components/
│   │   ├── composables/
│   │   └── stores/
│   ├── lists/
│   │   ├── components/
│   │   ├── composables/
│   │   └── stores/
│   └── filters/
│       ├── components/
│       └── stores/
├── shared/
│   ├── components/
│   ├── composables/
│   ├── types/
│   └── utils/
└── assets/
    └── styles/
```

**Checkpoint:** ✅ Folder structure matches PRD recommendations

#### 1.3 Setup TypeScript Types
**Files to create:**
- `src/shared/types/todo.ts` - Todo, ChecklistItem interfaces
- `src/shared/types/list.ts` - TodoList interface
- `src/shared/types/index.ts` - Centralized exports

**Content:**
```typescript
// todo.ts
export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Todo {
  id: string
  title: string
  description?: string
  checklist: ChecklistItem[]
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  listId: string
  order: number
  createdAt: number
  updatedAt: number
}

// list.ts
export interface TodoList {
  id: string
  name: string
  order: number
}
```

**Checkpoint:** ✅ Types compile without errors, can import from `@/shared/types`

#### 1.4 Setup Pinia Store
**Files to create:**
- `src/stores/index.ts` - Pinia initialization
- Update `src/main.ts` to use Pinia

**Checkpoint:** ✅ Pinia integrated, devtools visible in browser

**Total Duration:** 2-3 days
**Success Criteria:** All dependencies installed, folder structure created, types defined, Pinia working

---

## 🎯 Milestone 2: Data Persistence Layer (Week 1-2)

### Goal
Implement the Rust backend persistence layer using tauri-plugin-store for local data storage.

### Tasks

#### 2.1 Configure Tauri Store Plugin
**File:** `src-tauri/src/lib.rs`

**Implementation:**
```rust
use tauri_plugin_store::StoreBuilder;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            // Commands to be added
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

**Checkpoint:** ✅ Store plugin initialized, app runs without errors

#### 2.2 Create Store Utilities (Frontend)
**File:** `src/shared/utils/store.ts`

**Implementation:**
- Initialize Tauri Store connection
- Create helper functions for CRUD operations
- Type-safe wrappers for store methods

**Checkpoint:** ✅ Can read/write to store from frontend

#### 2.3 Implement Lists Store (Pinia)
**File:** `src/modules/lists/stores/lists.ts`

**Features:**
- State: `lists: TodoList[]`, `activeListId: string | null`
- Actions: `createList()`, `updateList()`, `deleteList()`, `reorderLists()`, `setActiveList()`
- Getters: `sortedLists`, `activeList`
- Persist to Tauri Store

**Checkpoint:** ✅ Can create, read, update, delete lists with persistence

#### 2.4 Implement Todos Store (Pinia)
**File:** `src/modules/todos/stores/todos.ts`

**Features:**
- State: `todos: Todo[]`
- Actions: `createTodo()`, `updateTodo()`, `deleteTodo()`, `toggleTodo()`, `reorderTodos()`, `moveTodo()`
- Getters: `todosByList()`, `completedTodos`, `activeTodos`
- Persist to Tauri Store

**Checkpoint:** ✅ Can create, read, update, delete todos with persistence

#### 2.5 Data Initialization & Migration
**File:** `src/shared/utils/init.ts`

**Features:**
- Load data on app start
- Create default "Personal" list if empty
- Handle data migration (future)

**Checkpoint:** ✅ App starts with default data, persists changes across restarts

**Total Duration:** 3-4 days
**Success Criteria:** Complete CRUD for lists & todos with reliable persistence, data survives app restart

---

## 🎯 Milestone 3: Core UI & Layout (Week 2-3)

### Goal
Build the main application UI with sidebar, header, and content area.

### Tasks

#### 3.1 Create Base Layout
**File:** `src/app/layouts/MainLayout.vue`

**Structure:**
```
┌─────────────────────────────────┐
│ Header (Filters + Actions)     │
├──────┬──────────────────────────┤
│      │                          │
│ Side │   Main Content          │
│ bar  │   (Todo List)           │
│      │                          │
└──────┴──────────────────────────┘
```

**Components:**
- Sidebar (200px fixed width)
- Header (60px fixed height)
- Main content area (flex grow)

**Checkpoint:** ✅ Layout renders, responsive to window resize

#### 3.2 Build List Sidebar
**Files:**
- `src/modules/lists/components/ListSidebar.vue`
- `src/modules/lists/components/ListItem.vue`
- `src/modules/lists/components/ListForm.vue`

**Features:**
- Display all lists
- Highlight active list
- Click to switch lists
- Add new list button
- Inline rename
- Delete list (with confirmation)

**Checkpoint:** ✅ Can view, create, rename, delete lists from UI

#### 3.3 Create Header Component
**File:** `src/app/layouts/AppHeader.vue`

**Features:**
- App title/logo
- "New Todo" button
- Filter dropdown (placeholder for now)

**Checkpoint:** ✅ Header displays, button triggers todo creation modal

#### 3.4 Setup Basic Styles
**File:** `src/assets/styles/main.css`

**Includes:**
- CSS reset/normalize
- CSS variables for theme
- Layout utilities
- Typography scale

**Checkpoint:** ✅ Consistent styling across components

**Total Duration:** 4-5 days
**Success Criteria:** Complete layout with sidebar navigation, can switch between lists

---

## 🎯 Milestone 4: Todo CRUD Interface (Week 3-4)

### Goal
Implement the complete todo creation, editing, and display interface.

### Tasks

#### 4.1 Todo List Display
**File:** `src/modules/todos/components/TodoList.vue`

**Features:**
- Display todos for active list
- Group by completion status
- Empty state when no todos
- Loading state

**Checkpoint:** ✅ Todos render correctly for selected list

#### 4.2 Todo Item Component
**File:** `src/modules/todos/components/TodoItem.vue`

**Features:**
- Checkbox to toggle completion
- Display title
- Show priority indicator (color/icon)
- Show checklist progress (e.g., "2/5")
- Click to expand details
- Quick actions (edit, delete)

**Checkpoint:** ✅ Can toggle completion, see basic todo info

#### 4.3 Todo Creation Form
**File:** `src/modules/todos/components/TodoForm.vue`

**Features:**
- Modal/slide-over design
- Fields: title (required), description, priority
- "Create" button
- Cancel/close button
- Form validation

**Checkpoint:** ✅ Can create new todos with all fields

#### 4.4 Todo Details View
**File:** `src/modules/todos/components/TodoDetails.vue`

**Features:**
- Expandable/collapsible view
- Edit mode toggle
- Display all fields
- Show created/updated dates
- Delete button with confirmation

**Checkpoint:** ✅ Can view and edit all todo properties

#### 4.5 Todo Editing
**Integration:**
- Reuse TodoForm component
- Pre-populate with existing data
- Update instead of create

**Checkpoint:** ✅ Can edit existing todos

**Total Duration:** 5-6 days
**Success Criteria:** Complete todo CRUD from UI, validation working, can create/edit/delete todos

---

## 🎯 Milestone 5: Checklist Feature (Week 4)

### Goal
Implement the internal checklist system for each todo.

### Tasks

#### 5.1 Checklist Component
**File:** `src/modules/todos/components/TodoChecklist.vue`

**Features:**
- List all checklist items
- Add new item (inline input)
- Toggle item completion
- Delete item
- Show progress (X/Y completed)

**Checkpoint:** ✅ Can manage checklist items within a todo

#### 5.2 Checklist in Todo Form
**Update:** `TodoForm.vue`

**Features:**
- Checklist section in create/edit form
- Add/remove items before saving
- Validation (no empty items)

**Checkpoint:** ✅ Can create todos with initial checklist items

#### 5.3 Checklist Store Integration
**Update:** `src/modules/todos/stores/todos.ts`

**Actions:**
- `addChecklistItem(todoId, text)`
- `toggleChecklistItem(todoId, itemId)`
- `deleteChecklistItem(todoId, itemId)`
- `updateChecklistItem(todoId, itemId, text)`

**Checkpoint:** ✅ Checklist changes persist correctly

**Total Duration:** 2-3 days
**Success Criteria:** Full checklist CRUD, progress tracking, persistence working

---

## 🎯 Milestone 6: Priority & Visual Polish (Week 5)

### Goal
Implement priority system and improve visual design.

### Tasks

#### 6.1 Priority Indicators
**Files:** Update `TodoItem.vue`, `TodoForm.vue`

**Features:**
- Color coding (low=gray, medium=yellow, high=red)
- Priority selector in form (radio/dropdown)
- Visual badge/icon on todo item
- Priority in todo details

**Checkpoint:** ✅ Priority visually distinct, can set/change priority

#### 6.2 Design System Implementation
**File:** `src/shared/components/`

**Components to create:**
- `BaseButton.vue`
- `BaseInput.vue`
- `BaseSelect.vue`
- `BaseModal.vue`
- `BaseCheckbox.vue`

**Checkpoint:** ✅ Consistent component library, all forms use base components

#### 6.3 Styling Refinements
**Updates across components:**
- Hover states
- Focus states
- Transitions
- Spacing consistency
- Typography hierarchy

**Checkpoint:** ✅ App feels polished, interactions smooth

**Total Duration:** 3-4 days
**Success Criteria:** Priority system functional, UI polished and consistent

---

## 🎯 Milestone 7: System Tray Integration (Week 5-6)

### Goal
Implement system tray functionality for quick access.

### Tasks

#### 7.1 Install Window Plugin
**Rust dependency:**
```bash
cd src-tauri
cargo add tauri-plugin-window-state
```

**Checkpoint:** ✅ Plugin installed successfully

#### 7.2 Configure Tauri for System Tray
**File:** `src-tauri/tauri.conf.json`

**Changes:**
```json
{
  "app": {
    "windows": [
      {
        "title": "Zendo",
        "width": 800,
        "height": 600,
        "visible": false,
        "skipTaskbar": false
      }
    ],
    "tray": {
      "iconPath": "icons/tray-icon.png",
      "menuOnLeftClick": false
    }
  }
}
```

**Checkpoint:** ✅ App starts with tray icon visible

#### 7.3 Implement Tray Menu
**File:** `src-tauri/src/lib.rs`

**Menu items:**
1. "Open Zendo" - shows main window
2. "Quick Add Todo" - opens quick add window
3. "---" (separator)
4. "Quit" - exits app

**Checkpoint:** ✅ Tray menu appears with all items

#### 7.4 Window Show/Hide Logic
**Implementation:**
- Click tray icon → toggle window visibility
- Close button → hide to tray (don't quit)
- Quit only from tray menu

**Checkpoint:** ✅ Window hides to tray, can restore from tray

#### 7.5 Quick Add Window
**New window configuration:**
- Small window (400x200)
- Just title + list selector + priority
- "Add" button creates todo and closes window

**Checkpoint:** ✅ Can quick-add todos from tray without opening main window

**Total Duration:** 4-5 days
**Success Criteria:** System tray fully functional, quick add working, window hide/show working

---

## 🎯 Milestone 8: Filters (Week 6)

### Goal
Implement filtering system for todos.

### Tasks

#### 8.1 Filter Store
**File:** `src/modules/filters/stores/filters.ts`

**State:**
```typescript
{
  completionFilter: 'all' | 'completed' | 'active',
  priorityFilter: 'all' | 'low' | 'medium' | 'high',
  searchQuery: string
}
```

**Checkpoint:** ✅ Filter state management working

#### 8.2 Filter UI
**File:** `src/modules/filters/components/FilterBar.vue`

**Components:**
- Completion filter (tabs/buttons)
- Priority filter (dropdown)
- Search input
- Clear filters button

**Checkpoint:** ✅ Filter UI renders in header

#### 8.3 Filter Logic Integration
**Update:** `src/modules/todos/stores/todos.ts`

**Getter:**
```typescript
filteredTodos: (state) => {
  // Apply completion filter
  // Apply priority filter
  // Apply search query
  // Return filtered array
}
```

**Checkpoint:** ✅ TodoList displays filtered results

#### 8.4 Filter Persistence
**Feature:** Remember last filter selection

**Checkpoint:** ✅ Filters persist across app restarts

**Total Duration:** 3-4 days
**Success Criteria:** All filters functional, can combine filters, results update instantly

---

## 🎯 Milestone 9: Drag & Drop (Week 7)

### Goal
Implement drag and drop for reordering and moving todos.

### Tasks

#### 9.1 Install Drag & Drop Library
**Already added in Milestone 1:**
- `@vueuse/integrations` + `sortablejs`

**Checkpoint:** ✅ Dependencies ready

#### 9.2 Todo Reordering (Same List)
**File:** `src/modules/todos/components/TodoList.vue`

**Features:**
- Drag handle on each todo item
- Visual feedback while dragging
- Update `order` field on drop
- Persist new order

**Checkpoint:** ✅ Can reorder todos within a list

#### 9.3 Move Todo Between Lists
**Feature:**
- Drag todo to different list in sidebar
- Update `listId` and `order`
- Optimistic UI update

**Checkpoint:** ✅ Can drag todos between lists

#### 9.4 List Reordering
**File:** `src/modules/lists/components/ListSidebar.vue`

**Features:**
- Drag lists to reorder in sidebar
- Update `order` field
- Persist order

**Checkpoint:** ✅ Can reorder lists

**Total Duration:** 4-5 days
**Success Criteria:** Smooth drag & drop for todos and lists, order persists

---

## 🎯 Milestone 10: Performance & Polish (Week 7-8)

### Goal
Optimize performance and add final polish.

### Tasks

#### 10.1 Performance Optimization
**Targets:**
- App startup < 300ms (PRD requirement)
- Smooth 60fps interactions
- Lazy load components
- Virtualize long lists (if needed)

**Checkpoint:** ✅ Startup time measured and meets target

#### 10.2 Error Handling
**Implement:**
- Toast notifications for errors
- Graceful fallbacks
- Offline detection
- Data backup/export

**Checkpoint:** ✅ App handles errors gracefully

#### 10.3 Keyboard Shortcuts
**Shortcuts to add:**
- `Ctrl/Cmd + N` - New todo
- `Ctrl/Cmd + F` - Focus search
- `Ctrl/Cmd + ,` - Settings (future)
- `Escape` - Close modals

**Checkpoint:** ✅ Keyboard navigation works

#### 10.4 Accessibility
**Tasks:**
- ARIA labels on interactive elements
- Keyboard navigation
- Focus management
- Screen reader testing

**Checkpoint:** ✅ Passes basic accessibility audit

#### 10.5 Final UI Polish
**Tasks:**
- Animations/transitions
- Loading states
- Empty states
- Consistent spacing
- Icon system

**Checkpoint:** ✅ UI feels polished and professional

**Total Duration:** 5-6 days
**Success Criteria:** <300ms startup, no errors in console, smooth UX, accessible

---

## 🎯 Milestone 11: Testing & Release Prep (Week 8)

### Goal
Test thoroughly and prepare for initial release.

### Tasks

#### 11.1 Manual Testing
**Test scenarios:**
- Create/edit/delete todos and lists
- Checklist operations
- Filters and search
- Drag and drop
- System tray behavior
- Data persistence across restarts
- Window management

**Checkpoint:** ✅ All features working as expected

#### 11.2 Cross-Platform Testing
**Platforms:**
- Windows 11
- macOS (if available)
- Linux (if available)

**Checkpoint:** ✅ App works on all target platforms

#### 11.3 Build Configuration
**File:** `src-tauri/tauri.conf.json`

**Configure:**
- App metadata
- Bundle settings
- Icons (all sizes)
- Auto-updater (future)

**Checkpoint:** ✅ Production builds successfully

#### 11.4 Documentation
**Create:**
- User guide (basic usage)
- Keyboard shortcuts reference
- Update README with screenshots

**Checkpoint:** ✅ Documentation complete

#### 11.5 Release v1.0
**Tasks:**
- Create installers for Windows
- Git tag v1.0.0
- GitHub release with notes

**Checkpoint:** ✅ v1.0 released

**Total Duration:** 3-4 days
**Success Criteria:** Stable v1.0 release, installers ready, documentation complete

---

## 📊 Overall Timeline Summary

| Milestone | Duration | Cumulative |
|-----------|----------|------------|
| 1. Foundation & Dependencies | 2-3 days | Days 1-3 |
| 2. Data Persistence Layer | 3-4 days | Days 4-7 |
| 3. Core UI & Layout | 4-5 days | Days 8-12 |
| 4. Todo CRUD Interface | 5-6 days | Days 13-18 |
| 5. Checklist Feature | 2-3 days | Days 19-21 |
| 6. Priority & Visual Polish | 3-4 days | Days 22-25 |
| 7. System Tray Integration | 4-5 days | Days 26-30 |
| 8. Filters | 3-4 days | Days 31-34 |
| 9. Drag & Drop | 4-5 days | Days 35-39 |
| 10. Performance & Polish | 5-6 days | Days 40-45 |
| 11. Testing & Release Prep | 3-4 days | Days 46-49 |

**Total Estimated Time:** 7-8 weeks (49 working days)

---

## 🔍 Verification Strategy

### After Each Milestone
1. **Functional Test:** Manually verify all features work
2. **Data Persistence Test:** Restart app, verify data intact
3. **Console Check:** No errors in browser/Rust console
4. **Git Commit:** Commit working milestone with descriptive message

### End-to-End Verification Flow
```
1. Open app from system tray
2. Create new list "Work"
3. Create todo "Review PRs" in Work list
   - Set priority: high
   - Add checklist: ["Check CI", "Test locally", "Approve"]
4. Create another todo "Update docs"
5. Filter by "high priority"
6. Toggle checklist items
7. Drag todos to reorder
8. Move todo to different list
9. Close app
10. Reopen app
11. Verify all data persisted correctly
```

---

## 🎯 Success Criteria (MVP Complete)

- [ ] All CRUD operations for todos and lists functional
- [ ] Checklist system working
- [ ] Priority system implemented
- [ ] Filters functional
- [ ] Drag & drop working
- [ ] System tray integrated
- [ ] Quick add from tray working
- [ ] Data persists reliably
- [ ] Startup time < 300ms
- [ ] No critical bugs
- [ ] UI polished and consistent
- [ ] Cross-platform compatibility
- [ ] Documentation complete

---

## 🚀 Post-MVP Roadmap (v1.1+)

### v1.1 Features
- Advanced filter combinations
- Bulk operations (select multiple todos)
- Export data (JSON, CSV)
- Dark mode theme
- Custom list colors

### v2.0 Features
- Mobile app (reusing core logic)
- Cloud sync (optional)
- Recurring todos
- Tags system
- Due dates & reminders

---

## 📁 Critical Files Reference

### Types
- `src/shared/types/todo.ts` - Todo & ChecklistItem interfaces
- `src/shared/types/list.ts` - TodoList interface

### Stores
- `src/modules/todos/stores/todos.ts` - Todo state management
- `src/modules/lists/stores/lists.ts` - List state management
- `src/modules/filters/stores/filters.ts` - Filter state

### Components
- `src/app/layouts/MainLayout.vue` - App layout
- `src/modules/todos/components/TodoList.vue` - Main todo display
- `src/modules/todos/components/TodoItem.vue` - Individual todo
- `src/modules/todos/components/TodoForm.vue` - Create/edit form
- `src/modules/lists/components/ListSidebar.vue` - Sidebar navigation

### Rust
- `src-tauri/src/lib.rs` - Tauri app initialization
- `src-tauri/tauri.conf.json` - App configuration

### Config
- `package.json` - Frontend dependencies
- `src-tauri/Cargo.toml` - Rust dependencies
- `vite.config.ts` - Build configuration
