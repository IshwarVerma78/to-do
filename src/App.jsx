import { useState } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from "uuid"

const defaultTasks = [
  { id: '1', text: 'Complete React assignment', cat: 'Study', pri: 'High', done: false, dueDate: '2026-06-18', createdAt: '2026-06-12T10:00:00.000Z' },
  { id: '2', text: 'Prepare weekly status report', cat: 'Work', pri: 'Medium', done: false, dueDate: '2026-06-11', createdAt: '2026-06-11T09:00:00.000Z' },
  { id: '3', text: 'Buy groceries', cat: 'Shopping', pri: 'Low', done: true, dueDate: '2026-06-12', createdAt: '2026-06-10T08:00:00.000Z' },
  { id: '4', text: 'Call parents', cat: 'Personal', pri: 'Medium', done: false, dueDate: '2026-06-15', createdAt: '2026-06-12T12:00:00.000Z' }
]

function App() {
  const [text, setText] = useState("")
  const [newCat, setNewCat] = useState("")
  const [newPri, setNewPri] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  
  // To-dos state
  const [todos, setTodos] = useState(() => {
    const todoString = localStorage.getItem("todos")
    if (todoString) {
      try {
        return JSON.parse(todoString)
      } catch {
        return defaultTasks
      }
    }
    return defaultTasks
  })

  const [activeFilter, setActiveFilter] = useState("All")
  const [editingTask, setEditingTask] = useState(null)

  // Sync to local storage
  const saveToLS = (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos))
  }

  const addTask = () => {
    if (!text.trim() || !newCat || !newPri) return
    const newTodos = [
      {
        id: uuidv4(),
        text: text.trim(),
        cat: newCat,
        pri: newPri,
        done: false,
        dueDate: dueDate || null,
        createdAt: new Date().toISOString()
      },
      ...todos
    ]
    setTodos(newTodos)
    setText("")
    setNewCat("")
    setNewPri("")
    setDueDate("")
    saveToLS(newTodos)
  }

  const toggleDone = (id) => {
    const newTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, done: !todo.done }
      }
      return todo
    })
    setTodos(newTodos)
    saveToLS(newTodos)
  }

  const deleteTask = (id) => {
    const newTodos = todos.filter(todo => todo.id !== id)
    setTodos(newTodos)
    saveToLS(newTodos)
  }

  const openEdit = (todo) => {
    setEditingTask({ ...todo, dueDate: todo.dueDate || "" })
  }

  const closeEdit = () => {
    setEditingTask(null)
  }

  const saveEdit = () => {
    if (!editingTask || !editingTask.text.trim()) return
    const newTodos = todos.map(todo => {
      if (todo.id === editingTask.id) {
        return {
          ...todo,
          text: editingTask.text.trim(),
          cat: editingTask.cat,
          pri: editingTask.pri,
          dueDate: editingTask.dueDate || null
        }
      }
      return todo
    })
    setTodos(newTodos)
    saveToLS(newTodos)
    closeEdit()
  }

  const clearCompleted = () => {
    const newTodos = todos.filter(todo => !todo.done)
    setTodos(newTodos)
    saveToLS(newTodos)
  }

  const resetApp = () => {
    setTodos(defaultTasks)
    saveToLS(defaultTasks)
    setActiveFilter("All")
    setSearchQuery("")
    setSortBy("createdAt")
  }

  // Check date conditions
  const isOverdue = (todo) => {
    if (todo.done || !todo.dueDate) return false
    const todayStr = new Date().toISOString().split('T')[0]
    return todo.dueDate < todayStr
  }

  const isDueToday = (todo) => {
    if (todo.done || !todo.dueDate) return false
    const todayStr = new Date().toISOString().split('T')[0]
    return todo.dueDate === todayStr
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ""
    const date = new Date(dateStr)
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  // Filter tasks
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchQuery.toLowerCase())
    if (!matchesSearch) return false

    if (activeFilter === "All") return true
    if (activeFilter === "done") return todo.done
    return todo.cat === activeFilter
  })

  // Sort tasks
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    if (sortBy === "dueDate") {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    if (sortBy === "priority") {
      const weight = { High: 3, Medium: 2, Low: 1 }
      return weight[b.pri] - weight[a.pri]
    }
    return 0
  })

  // Calculate statistics
  const total = todos.length
  const done = todos.filter(t => t.done).length
  const pending = total - done

  const filterValues = [
    { label: 'All', value: 'All' },
    { label: 'Study', value: 'Study' },
    { label: 'Work', value: 'Work' },
    { label: 'Personal', value: 'Personal' },
    { label: 'Shopping', value: 'Shopping' },
    { label: 'Done', value: 'done' }
  ]

  return (
    <div className="w-full min-h-screen py-8 flex items-center justify-center">
      <h2 className="sr-only">Let's Do — fully interactive todo app with categories, priority, edit and delete</h2>

      {/* Centered Application Card */}
      <div className="mx-auto bg-white border border-slate-200/80 rounded-2xl shadow-xl w-[92%] max-w-[460px] overflow-hidden">
        {/* Navbar Card Header */}
        <Navbar total={total} done={done} pending={pending} />

        <div className="p-4 sm:p-5 flex flex-col gap-4">
          
          {/* Edit Modal Overlay */}
          {editingTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 w-full max-w-[360px] shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="text-sm font-bold text-slate-800 mb-3.5 flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4 text-indigo-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                  Edit Task Details
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Task Title</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs sm:text-sm text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                      value={editingTask.text}
                      onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                      onKeyDown={(e) => { if(e.key === 'Enter') saveEdit(); }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Category</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                        value={editingTask.cat}
                        onChange={(e) => setEditingTask({ ...editingTask, cat: e.target.value })}
                      >
                        <option value="Study">Study</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Shopping">Shopping</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Priority</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 text-xs text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                        value={editingTask.pri}
                        onChange={(e) => setEditingTask({ ...editingTask, pri: e.target.value })}
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Due Date</label>
                    <input 
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                      value={editingTask.dueDate || ""}
                      onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-2.5 mt-5">
                  <button 
                    onClick={closeEdit} 
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveEdit} 
                    disabled={!editingTask.text.trim()}
                    className="flex-1 bg-indigo-650 hover:bg-indigo-700 disabled:bg-indigo-500/50 text-white rounded-xl py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer text-center"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Section */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col gap-3 shadow-xs">
            <div className="flex gap-2">
              <input 
                type="text"
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-800 outline-none placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Type your task here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter') addTask(); }}
              />
              <button 
                onClick={addTask}
                disabled={!text.trim() || !newCat || !newPri}
                className="bg-indigo-650 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-semibold flex items-center gap-1 transition-colors cursor-pointer select-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <select 
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
              >
                <option value="" disabled>Category</option>
                <option value="Study">Study</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Shopping">Shopping</option>
              </select>
              <select 
                className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                value={newPri}
                onChange={(e) => setNewPri(e.target.value)}
              >
                <option value="" disabled>Priority</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
              <input 
                type="date"
                className="bg-white border border-slate-200 rounded-lg px-1.5 py-1 text-[11px] text-slate-650 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Compact Search & Sort Panel */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-7 pr-3 text-[11px] sm:text-xs text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3 text-slate-400 absolute left-2.5 top-2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
              </svg>
            </div>
            <select
              className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] sm:text-xs text-slate-650 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="createdAt">Created</option>
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
            </select>
          </div>

          {/* Filter Chips */}
          <div className="filters flex flex-wrap gap-1">
            {filterValues.map(chip => (
              <button
                key={chip.value}
                onClick={() => setActiveFilter(chip.value)}
                className={`px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold rounded-full cursor-pointer transition-all border select-none ${
                  activeFilter === chip.value 
                    ? 'bg-[#534AB7] border-[#534AB7] text-white' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="tasks flex flex-col gap-2 max-h-[42vh] overflow-y-auto pr-0.5">
            {sortedTodos.length === 0 ? (
              <div className="empty text-center py-10 text-slate-405 text-xs sm:text-sm flex flex-col items-center gap-1.5 select-none">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-slate-350">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 2.24a.75.75 0 0 1-1.077-.107 48.535 48.535 0 0 1-1.077-1.402M6 21.75h12c1.242 0 2.25-1.008 2.25-2.25V6.108m-16.5 0v13.392c0 1.242 1.008 2.25 2.25 2.25h12.5" />
                </svg>
                <span className="text-slate-400">No tasks here yet</span>
              </div>
            ) : (
              sortedTodos.map(todo => {
                let catClass = ""
                if (todo.cat === "Study") catClass = "bg-sky-50 text-sky-700 border border-sky-100"
                else if (todo.cat === "Work") catClass = "bg-indigo-50 text-indigo-705 border border-indigo-100"
                else if (todo.cat === "Personal") catClass = "bg-emerald-50 text-emerald-700 border border-emerald-100"
                else if (todo.cat === "Shopping") catClass = "bg-amber-50 text-amber-700 border border-amber-100"

                let priClass = ""
                if (todo.pri === "High") priClass = "bg-rose-50 text-rose-700 border border-rose-100"
                else if (todo.pri === "Medium") priClass = "bg-amber-50 text-amber-700 border border-amber-100"
                else if (todo.pri === "Low") priClass = "bg-emerald-50 text-emerald-700 border border-emerald-100"

                const overdue = isOverdue(todo)
                const dueToday = isDueToday(todo)

                return (
                  <div 
                    key={todo.id} 
                    className={`task-card bg-white rounded-xl border p-2.5 flex items-start gap-2.5 transition-all shadow-xs ${
                      todo.done 
                        ? 'opacity-55 border-slate-150' 
                        : overdue
                          ? 'border-rose-300 shadow-sm shadow-rose-500/5'
                          : dueToday
                            ? 'border-amber-300 shadow-sm shadow-amber-500/5'
                            : 'border-slate-200/80 hover:border-indigo-200'
                    }`}
                  >
                    {/* Checkbox */}
                    <button 
                      onClick={() => toggleDone(todo.id)}
                      className={`w-[18px] h-[18px] rounded border flex-shrink-0 mt-0.5 cursor-pointer flex items-center justify-center transition-all ${
                        todo.done 
                          ? 'bg-indigo-600 border-indigo-600' 
                          : overdue
                            ? 'border-rose-400 bg-white hover:bg-rose-50'
                            : 'border-slate-300 bg-white hover:border-indigo-600'
                      }`}
                      aria-checked={todo.done}
                      role="checkbox"
                    >
                      {todo.done && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3.2" stroke="currentColor" className="w-2.5 h-2.5 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </button>

                    {/* Task Info */}
                    <div className="tinfo flex-1 min-w-0 select-none">
                      <div className={`ttitle text-xs sm:text-sm font-semibold text-slate-800 break-words ${todo.done ? 'line-through text-slate-400 font-normal' : ''}`}>
                        {todo.text}
                      </div>
                      <div className="tmeta flex gap-1.5 mt-1.5 flex-wrap items-center">
                        <span className={`badge text-[9px] px-2 py-0.5 rounded-lg font-bold tracking-wide select-none ${catClass}`}>
                          {todo.cat}
                        </span>
                        <span className={`badge text-[9px] px-2 py-0.5 rounded-lg font-bold tracking-wide select-none ${priClass}`}>
                          {todo.pri}
                        </span>
                        {todo.dueDate && (
                          <span className={`badge text-[9px] px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 select-none ${
                            todo.done 
                              ? 'bg-slate-100 text-slate-400' 
                              : overdue
                                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                : dueToday
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-slate-100 text-slate-650'
                          }`}>
                            {overdue && (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 text-rose-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                              </svg>
                            )}
                            <span>{overdue ? "Overdue: " : dueToday ? "Due Today" : "Due: "}{!dueToday && formatDate(todo.dueDate)}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="tactions flex gap-1 flex-shrink-0">
                      <button 
                        onClick={() => openEdit(todo)}
                        className="icon-btn text-slate-400 hover:text-indigo-600 p-1 rounded transition-colors cursor-pointer"
                        aria-label="Edit task"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => deleteTask(todo.id)}
                        className="icon-btn text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                        aria-label="Delete task"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer Batch actions */}
          <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-[10px] sm:text-xs">
            <button
              onClick={clearCompleted}
              disabled={todos.filter(t => t.done).length === 0}
              className="text-amber-600 hover:text-amber-700 disabled:text-slate-300 font-bold cursor-pointer transition-colors"
            >
              Clear Completed
            </button>
            <button
              onClick={resetApp}
              className="text-slate-400 hover:text-rose-500 font-bold cursor-pointer transition-colors"
            >
              Reset Application
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

export default App