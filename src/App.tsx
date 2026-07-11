import { useMemo, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { TodoItem } from './components/TodoItem'
import type { Filter, Todo } from './types'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'active', label: '未完了' },
  { key: 'completed', label: '完了' },
]

function App() {
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', [])
  const [filter, setFilter] = useState<Filter>('all')
  const [text, setText] = useState('')

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    setTodos([
      { id: crypto.randomUUID(), text: trimmed, completed: false, createdAt: Date.now() },
      ...todos,
    ])
    setText('')
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id))
  }

  const editTodo = (id: string, newText: string) => {
    setTodos(todos.map((t) => (t.id === id ? { ...t, text: newText } : t)))
  }

  const clearCompleted = () => {
    setTodos(todos.filter((t) => !t.completed))
  }

  const filteredTodos = useMemo(() => {
    if (filter === 'active') return todos.filter((t) => !t.completed)
    if (filter === 'completed') return todos.filter((t) => t.completed)
    return todos
  }, [todos, filter])

  const remainingCount = useMemo(() => todos.filter((t) => !t.completed).length, [todos])
  const hasCompleted = todos.some((t) => t.completed)

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 dark:bg-gray-950">
      <main className="mx-auto w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-semibold text-gray-900 dark:text-gray-100">
          TODO
        </h1>

        <form onSubmit={addTodo} className="mb-4 flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="新しいタスクを入力..."
            className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-purple-900"
          />
          <button
            type="submit"
            className="shrink-0 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!text.trim()}
          >
            追加
          </button>
        </form>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          {filteredTodos.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-gray-400">
              {todos.length === 0 ? 'タスクはまだありません' : '該当するタスクがありません'}
            </p>
          ) : (
            <ul className="px-4">
              {filteredTodos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={editTodo}
                />
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>残り {remainingCount} 件</span>

          <div className="flex gap-1 rounded-lg border border-gray-200 p-1 dark:border-gray-800">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                  filter === key
                    ? 'bg-purple-500 text-white'
                    : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={clearCompleted}
            disabled={!hasCompleted}
            className="text-xs text-gray-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            完了済みを削除
          </button>
        </div>
      </main>
    </div>
  )
}

export default App
