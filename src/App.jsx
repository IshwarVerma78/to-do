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
  
  // Default values to keep it simple and easy to add tasks
  const [newCat, setNewCat] = useState("Work")
  const [newPri, setNewPri] = useState("Medium")
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
    setNewCat("Work")
    setNewPri("Medium")
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
    setNewCat("Work")
    setNewPri("Medium")
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

  // Clean, lightweight SVG icons for Categories
  const getCatIcon = (cat) => {
    switch (cat) {
      case 'Study':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
        )
      case 'Work':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 .621-.504 1.125-1.125 1.125H4.875A1.125 1.125 0 0 1 3.75 18.4v-4.25m16.5 0a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25m16.5 0V7.5A2.25 2.25 0 0 0 17.25 5.25h-3.75m-3 0H6a2.25 2.25 0 0 0-2.25 7.5v6.65m10.5-8.9v-1.125A1.125 1.125 0 0 0 13.125 3h-2.25a1.125 1.125 0 0 0-1.125 1.125V5.25M12 10.5h.008v.008H12V10.5Zm0 3.75h.008v.008H12v-.008Z" />
          </svg>
        )
      case 'Personal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        )
      case 'Shopping':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getPriIcon = (pri) => {
    switch (pri) {
      case 'High':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 18.75 7.5-7.5 7.5 7.5m-15-6 7.5-7.5 7.5 7.5" />
          </svg>
        )
      case 'Medium':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        )
      case 'Low':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="w-full min-h-screen py-8 sm:py-12 flex items-center justify-center">
      <h2 className="sr-only">Let's Do — interactive todo app</h2>

      {/* Clean White Card layout */}
      <div className="mx-auto bg-white border border-slate-200/90 rounded-2xl shadow-xl w-[92%] max-w-[480px] overflow-hidden transition-all">
        {/* Navbar Header */}
        <Navbar total={total} done={done} pending={pending} />

        <div className="p-4 sm:p-5 flex flex-col gap-4">
          
          {/* Edit Modal Overlay */}
          {editingTask && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 transition-all">
              <div className="bg-white rounded-2xl border border-slate-200 p-5.5 w-full max-w-[360px] shadow-2xl flex flex-col gap-4">
                <div className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-indigo-50 text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </div>
                  Edit Task Details
                </div>
                <div className="flex flex-col gap-3.5">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Task Title</label>
                    <input 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      value={editingTask.text}
                      onChange={(e) => setEditingTask({ ...editingTask, text: e.target.value })}
                      onKeyDown={(e) => { if(e.key === 'Enter') saveEdit(); }}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
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
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Priority</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
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
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">Due Date</label>
                    <input 
                      type="date"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                      value={editingTask.dueDate || ""}
                      onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button 
                    onClick={closeEdit} 
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveEdit} 
                    disabled={!editingTask.text.trim()}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-550/50 disabled:text-slate-400 text-white rounded-xl py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer text-center"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add Section */}
          <div className="bg-slate-50/60 border border-slate-200/85 rounded-xl p-3.5 flex flex-col gap-3">
            <div className="flex gap-2.5">
              <input 
                type="text"
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 outline-none placeholder-slate-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                placeholder="Write your task here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter') addTask(); }}
              />
              <button 
                onClick={addTask}
                disabled={!text.trim() || !newCat || !newPri}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-lg px-4 py-2 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer select-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1">Category</span>
                <select 
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                >
                  <option value="Study">Study</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Shopping">Shopping</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1">Priority</span>
                <select 
                  className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] text-slate-700 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                  value={newPri}
                  onChange={(e) => setNewPri(e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider pl-1">Due Date</span>
                <input 
                  type="date"
                  className="bg-white border border-slate-200 rounded-lg px-1.5 py-1 text-[11px] text-slate-600 outline-none cursor-pointer focus:ring-1 focus:ring-indigo-500"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Search & Sort Panel */}
          <div className="flex gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-8 pr-3 text-[11px] sm:text-xs text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500 placeholder-slate-400 transition-all"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:inline">Sort By</span>
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
          </div>

          {/* Filter Chips */}
          <div className="filters flex flex-wrap gap-1.5">
            {filterValues.map(chip => (
              <button
                key={chip.value}
                onClick={() => setActiveFilter(chip.value)}
                className={`px-3 py-1 text-[10px] sm:text-[11px] font-bold rounded-full cursor-pointer transition-all border select-none ${
                  activeFilter === chip.value 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Task List */}
          <div className="tasks flex flex-col gap-2.5 max-h-[42vh] overflow-y-auto pr-0.5">
            {sortedTodos.length === 0 ? (
              <div className="empty text-center py-12 text-slate-400 text-xs sm:text-sm flex flex-col items-center gap-2 select-none">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.03 0 1.9.693 2.166 1.638m-7.377 2.24a.75.75 0 0 1-1.077-.107 48.535 48.535 0 0 1-1.077-1.402M6 21.75h12c1.242 0 2.25-1.008 2.25-2.25V6.108m-16.5 0v13.392c0 1.242 1.008 2.25 2.25 2.25h12.5" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-450">No tasks found</span>
              </div>
            ) : (
              sortedTodos.map(todo => {
                let catClass = ""
                if (todo.cat === "Study") catClass = "bg-sky-50 text-sky-700 border border-sky-100"
                else if (todo.cat === "Work") catClass = "bg-indigo-50 text-indigo-700 border border-indigo-100"
                else if (todo.cat === "Personal") catClass = "bg-emerald-50 text-emerald-700 border border-emerald-100"
                else if (todo.cat === "Shopping") catClass = "bg-amber-50 text-amber-700 border border-amber-100"

                let priClass = ""
                if (todo.pri === "High") priClass = "bg-rose-50 text-rose-700 border border-rose-100"
                else if (todo.pri === "Medium") priClass = "bg-amber-50 text-amber-705 border border-amber-100"
                else if (todo.pri === "Low") priClass = "bg-emerald-50 text-emerald-700 border border-emerald-100"

                const overdue = isOverdue(todo)
                const dueToday = isDueToday(todo)

                return (
                  <div 
                    key={todo.id} 
                    className={`task-card bg-white rounded-xl border p-3 flex items-start gap-3 transition-all duration-200 ${
                      todo.done 
                        ? 'opacity-60 border-slate-150 bg-slate-50/50' 
                        : overdue
                          ? 'border-rose-200 bg-rose-50/10 shadow-xs hover:border-rose-350'
                          : dueToday
                            ? 'border-amber-200 bg-amber-50/10 shadow-xs hover:border-amber-350'
                            : 'border-slate-200/90 hover:border-indigo-200 hover:bg-slate-50/20'
                    }`}
                  >
                    {/* Checkbox */}
                    <button 
                      onClick={() => toggleDone(todo.id)}
                      className={`w-[19px] h-[19px] rounded-lg border flex-shrink-0 mt-0.5 cursor-pointer flex items-center justify-center transition-all duration-200 ${
                        todo.done 
                          ? 'bg-indigo-600 border-indigo-600' 
                          : overdue
                            ? 'border-rose-400 bg-white hover:bg-rose-50'
                            : 'border-slate-300 bg-white hover:border-indigo-600 hover:bg-indigo-50/30'
                      }`}
                      aria-checked={todo.done}
                      role="checkbox"
                    >
                      {todo.done && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3.5" stroke="currentColor" className="w-2.5 h-2.5 text-white">
                           <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </button>

                    {/* Task Info */}
                    <div className="tinfo flex-1 min-w-0 select-none">
                      <div className={`ttitle text-xs sm:text-sm font-semibold text-slate-800 break-words leading-relaxed ${todo.done ? 'line-through text-slate-400 font-normal' : ''}`}>
                        {todo.text}
                      </div>
                      <div className="tmeta flex gap-2 mt-2 flex-wrap items-center">
                        <span className={`badge text-[9px] px-2 py-0.5 rounded-lg font-bold tracking-wide select-none flex items-center gap-1.5 ${catClass}`}>
                          {getCatIcon(todo.cat)}
                          {todo.cat}
                        </span>
                        <span className={`badge text-[9px] px-2 py-0.5 rounded-lg font-bold tracking-wide select-none flex items-center gap-1.5 ${priClass}`}>
                          {getPriIcon(todo.pri)}
                          {todo.pri}
                        </span>
                        {todo.dueDate && (
                          <span className={`badge text-[9px] px-2 py-0.5 rounded-lg font-bold flex items-center gap-1.5 select-none ${
                            todo.done 
                              ? 'bg-slate-100 text-slate-400 border border-slate-100' 
                              : overdue
                                ? 'bg-rose-50 text-rose-600 border border-rose-100'
                                : dueToday
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-slate-100 text-slate-600 border border-slate-100'
                          }`}>
                            {overdue ? (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-3.5 h-3.5 text-rose-600">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
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
                        className="icon-btn text-slate-400 hover:text-indigo-600 hover:bg-slate-100 p-1.5 rounded-lg transition-all cursor-pointer"
                        aria-label="Edit task"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-3.5 h-3.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => deleteTask(todo.id)}
                        className="icon-btn text-slate-400 hover:text-rose-600 hover:bg-slate-100 p-1.5 rounded-lg transition-all cursor-pointer"
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