import { useEffect, useRef, useState } from 'react'
import type { Todo } from '../types'

interface Props {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (id: string, text: string) => void
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: Props) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(todo.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [isEditing])

  const commitEdit = () => {
    const trimmed = draft.trim()
    if (trimmed) {
      onEdit(todo.id, trimmed)
    } else {
      setDraft(todo.text)
    }
    setIsEditing(false)
  }

  return (
    <li className="group flex items-center gap-3 border-b border-gray-200 px-1 py-3 last:border-b-0 dark:border-gray-800">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="h-5 w-5 shrink-0 cursor-pointer accent-purple-500"
        aria-label={`${todo.text} を完了にする`}
      />

      {isEditing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitEdit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitEdit()
            if (e.key === 'Escape') {
              setDraft(todo.text)
              setIsEditing(false)
            }
          }}
          className="min-w-0 flex-1 rounded border border-purple-400 bg-transparent px-2 py-1 text-sm outline-none"
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          className={`min-w-0 flex-1 truncate text-sm ${
            todo.completed
              ? 'text-gray-400 line-through dark:text-gray-600'
              : 'text-gray-900 dark:text-gray-100'
          }`}
        >
          {todo.text}
        </span>
      )}

      <button
        onClick={() => onDelete(todo.id)}
        className="shrink-0 rounded px-2 py-1 text-xs text-gray-400 opacity-0 transition hover:text-red-500 group-hover:opacity-100 focus:opacity-100"
        aria-label={`${todo.text} を削除`}
      >
        削除
      </button>
    </li>
  )
}
