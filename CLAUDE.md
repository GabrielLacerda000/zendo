# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Zendo is a local-first desktop to-do application built with Tauri v2 (Rust backend) + Vue 3 + TypeScript. It features system tray integration, drag-and-drop, and local JSON-based persistence.

## Development Commands

```bash
# Start development server (Vue frontend on port 1420)
bun run dev

# Type-check and build for production
bun run build

# Run Tauri desktop app in development
bun run tauri dev

# Build Tauri desktop app for distribution
bun run tauri build
```

## Architecture

### Frontend (Vue 3 + TypeScript)
- **Entry points**: `index.html` (main app), `quick-add.html` (tray quick-add window)
- **Modular structure**: Features organized in `src/modules/` with isolated stores
- **State management**: Pinia stores in `src/modules/*/stores/`
- **Shared components**: `src/shared/components/`

### Backend (Tauri/Rust)
- **Main logic**: `src-tauri/src/lib.rs` - system tray menu, window management
- **Configuration**: `src-tauri/tauri.conf.json`
- **Persistence**: Uses `tauri-plugin-store` for local JSON storage (`zendo-data.json`)

### Key Data Flow
1. UI triggers Pinia store action (e.g., `useTodoStore().createTodo()`)
2. Store updates state and calls persistence utilities
3. `src/shared/utils/store.ts` wraps Tauri Store API for type-safe reads/writes
4. Data persists to local JSON file managed by Tauri

### Data Models
- **Todo**: id, title, description, checklist[], completed, priority ('low'|'medium'|'high'), listId, order, timestamps
- **TodoList**: id, name, order
- **ChecklistItem**: id, text, completed

## Key Files

| Purpose | Path |
|---------|------|
| App root component | `src/App.vue` |
| Todo store (CRUD, filtering, reorder) | `src/modules/todos/stores/todoStore.ts` |
| List store (list management) | `src/modules/lists/stores/listStore.ts` |
| Tauri Store wrapper | `src/shared/utils/store.ts` |
| Type definitions | `src/types/Todo.ts`, `src/types/List.ts` |
| System tray & windows | `src-tauri/src/lib.rs` |

## Tech Stack

- **Frontend**: Vue 3 (Composition API + `<script setup>`), TypeScript, Vite, Tailwind CSS, Pinia
- **Desktop**: Tauri v2 (Rust)
- **Drag & Drop**: vuedraggable + sortablejs
- **Icons**: lucide-vue-next
- **Animations**: motion-v

## Tips
- for any unclear instruction, ask me