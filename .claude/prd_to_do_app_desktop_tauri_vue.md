# 📋 PRD – To‑Do App Desktop (Tauri + Vue)

## 1. Visão Geral

Aplicativo **To‑Do List local-first**, rápido e leve, focado em **uso diário**, **sem conta**, **sem backend** e com **acesso rápido pela bandeja do sistema (system tray)**.

- Plataforma inicial: **Desktop (Windows, macOS, Linux)**
- Stack: **Tauri + Vue 3 + TypeScript**
- Armazenamento: **local (no próprio PC)**
- Futuro: **Mobile (reaproveitando lógica e UI)**

---

## 2. Objetivos do Produto

- Criar, organizar e concluir tarefas rapidamente
- Funcionar offline
- Abrir rapidamente pela barra de tarefas
- Interface simples e extremamente responsiva
- Código escalável e reutilizável (desktop → mobile)

---

## 3. Escopo

### Dentro do escopo
- CRUD completo de todos
- Listas (Work, Personal, etc)
- Prioridades
- Checklist interno por todo
- Drag and drop
- Filtros
- Persistência local
- System tray

### Fora do escopo (por enquanto)
- Login / contas
- Sync na nuvem
- Colaboração
- Notificações push

---

## 4. Personas

**Dev / Profissional**
- Precisa anotar tarefas rapidamente
- Não quer abrir apps pesados
- Usa o app várias vezes ao dia

---

## 5. Funcionalidades

### 5.1 Todos (Tarefas)

#### Estrutura de um Todo

```ts
Todo {
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

ChecklistItem {
  id: string
  text: string
  completed: boolean
}
```

#### Ações
- Criar todo
- Editar todo
- Excluir todo
- Marcar como completo / incompleto
- Reordenar via drag and drop

---

### 5.2 Listas

Permite organizar todos por contexto.

```ts
TodoList {
  id: string
  name: string
  order: number
}
```

#### Ações
- Criar lista
- Renomear lista
- Excluir lista
- Arrastar listas para reordenar

---

### 5.3 Checklist por Todo

- Cada todo pode conter múltiplos itens
- Cada item pode ser marcado individualmente
- Todo não é automaticamente concluído ao finalizar checklist (decisão de UX)

---

### 5.4 Prioridades

| Prioridade | Uso |
|----------|----|
| Baixa | Tarefas sem urgência |
| Média | Padrão |
| Alta | Urgente / Importante |

- Visualmente destacadas
- Usadas para ordenação futura

---

### 5.5 Filtros

- Todos
- Completos
- Não completos
- Por prioridade
- Por lista

Filtros combináveis.

---

### 5.6 Drag and Drop

- Reordenar todos dentro da mesma lista
- Mover todo entre listas
- Ordem persistida localmente

Tecnologia sugerida:
- `@dnd-kit/core` ou `Vue Draggable`

---

## 6. Persistência de Dados

### Estratégia

**Local-first**, sem backend.

Opções:
1. **Tauri Store (recomendado)**
2. SQLite via plugin Tauri (futuro)

### Estrutura de armazenamento

```json
{
  "lists": [...],
  "todos": [...]
}
```

---

## 7. System Tray (Essencial)

### Comportamento

- App inicia minimizado
- Ícone na bandeja do sistema
- Clique no ícone:
  - Abre / fecha janela
- Menu do tray:
  - Abrir app
  - Criar novo todo
  - Sair

---

## 8. UX / UI

### Layout Base

- Sidebar: listas
- Main: todos
- Header:
  - Filtros
  - Botão `+`

### Abertura rápida

- Janela pequena (tipo Spotlight)
- Atalho de teclado (futuro)

---

## 9. Arquitetura Técnica

### Frontend

- Vue 3
- Composition API
- Pinia (estado global)
- Vite

### Backend (Tauri)

- Rust (mínimo possível)
- Plugins:
  - `tauri-plugin-store`
  - `tauri-plugin-window`

---

## 10. Estrutura de Pastas (Sugestão)

```txt
src/
 ├─ app/
 │   ├─ App.vue
 │   ├─ layouts/
 │   ├─ routes/
 ├─ modules/
 │   ├─ todos/
 │   │   ├─ components/
 │   │   ├─ store.ts
 │   │   ├─ types.ts
 │   ├─ lists/
 │   └─ filters/
 ├─ shared/
 │   ├─ ui/
 │   ├─ composables/
 │   └─ utils/
```

---

## 11. Requisitos Não Funcionais

- Abrir em < 300ms
- Persistência confiável
- Offline
- Baixo consumo de memória

---

## 12. Roadmap

### MVP
- CRUD de todos
- Listas
- Persistência local
- System tray

### v1.1
- Drag and drop
- Filtros avançados

### v2 (Mobile)
- Reaproveitar core de lógica
- UI adaptada

---

## 13. Métricas de Sucesso

- Tempo médio para criar um todo
- Número de interações diárias
- Uso contínuo após 7 dias

---

## 14. Próximos Passos Técnicos

1. Criar projeto Tauri + Vue
2. Implementar store local
3. Implementar system tray
4. Criar UI base
5. Adicionar drag and drop

---

Se quiser, no próximo passo posso:
- Criar a **arquitetura de stores (Pinia/Zustand-like)**
- Montar o **schema final dos dados**
- Criar o **setup inicial do Tauri**
- Desenhar o **fluxo UX passo a passo**

