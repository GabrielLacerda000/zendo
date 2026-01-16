export type ChecklistItem =  {
  id: string
  text: string
  completed: boolean
}

export type Todo = {
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