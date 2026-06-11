import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setShowFinished] = useState(true)
  const [currentTab, setCurrentTab] = useState("home")

  // Load todos from local storage when component mounts
  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if (todoString) {
      let todos = JSON.parse(localStorage.getItem("todos"))
      setTodos(todos)
    }
  }, [])

  // Helper function to save todos to local storage
  const saveToLS = (newTodos) => {
    localStorage.setItem("todos", JSON.stringify(newTodos))
  }

  const toggleFinished = () => {
    setShowFinished(!showFinished)
  }

  const handleAdd = () => {
    let newTodos = [...todos, { id: uuidv4(), todo, isCompleted: false }]
    setTodos(newTodos)
    setTodo("")
    saveToLS(newTodos)
  }

  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id === id)
    setTodo(t[0].todo)
    let newTodos = todos.filter(item => {
      return item.id !== id
    })
    setTodos(newTodos)
    saveToLS(newTodos)
    setCurrentTab("home") // Automatically switch to Home tab to edit the todo text in the input box
  }

  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => {
      return item.id !== id
    })
    setTodos(newTodos)
    saveToLS(newTodos)
  }

  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleCheckbox = (e) => {
    let id = e.target.name
    let index = todos.findIndex(item => {
      return item.id === id
    })
    let newTodos = [...todos]
    newTodos[index].isCompleted = !newTodos[index].isCompleted
    setTodos(newTodos)
    saveToLS(newTodos)
  }

  return (
    <>
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      <div className="mx-3 md:container md:mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-[35%]">
        <h1 className='font-bold text-center text-xl mb-4'>Let's Do - Manage your todos at one place</h1>
        
        {/* Render Home Tab */}
        {currentTab === "home" && (
          <div className="home-view">
            <div className="addTodo my-5 flex flex-col gap-4">
              <h2 className='text-lg font-bold'>Add a Todo</h2>
              <input 
                onChange={handleChange} 
                value={todo} 
                type="text" 
                className='w-full rounded-full px-5 py-1 bg-white border border-gray-300' 
                placeholder="Type your task here..."
              />
              <button 
                onClick={handleAdd} 
                disabled={todo.length <= 3} 
                className='bg-violet-800 hover:bg-violet-950 disabled:bg-violet-500 p-2 py-1 text-sm font-bold text-white rounded-md cursor-pointer text-center'
              >
                Save
              </button>
            </div>

            <div className="summary bg-violet-200/50 p-4 rounded-xl mt-6 flex flex-col gap-2">
              <h2 className="text-md font-bold mb-1 text-violet-900">Task Summary</h2>
              <p className="text-sm text-gray-700">Total Tasks: {todos.length}</p>
              <p className="text-sm text-gray-700">Completed Tasks: {todos.filter(item => item.isCompleted).length}</p>
              <p className="text-sm text-gray-700 font-semibold text-violet-900">
                Pending Tasks: {todos.filter(item => !item.isCompleted).length}
              </p>
              <button 
                onClick={() => setCurrentTab("tasks")} 
                className="mt-2 bg-violet-800 hover:bg-violet-950 text-white font-bold py-1.5 px-4 rounded-md text-sm cursor-pointer text-center"
              >
                View Your Tasks
              </button>
            </div>
          </div>
        )}

        {/* Render Your Tasks Tab */}
        {currentTab === "tasks" && (
          <div className="tasks-view">
            <div className="flex gap-2 items-center my-4">
              <input 
                onChange={toggleFinished} 
                type="checkbox" 
                checked={showFinished} 
              /> 
              <span>Show Finished</span>
            </div>

            <h2 className='text-lg font-bold border-t border-violet-200 pt-4'>Your Todos</h2>
            <div className="todos">
              {todos.length === 0 && <div className='m-5 text-gray-500'>No todos to display</div>}
              
              {todos.map(item => {
                return (showFinished || !item.isCompleted) && (
                  <div key={item.id} className="todo flex my-3 justify-between items-center w-full">
                    <div className='flex gap-5 items-center'>
                      <input 
                        name={item.id} 
                        onChange={handleCheckbox} 
                        type="checkbox" 
                        checked={item.isCompleted} 
                      />
                      <div className={item.isCompleted ? "line-through text-gray-500" : ""}>
                        {item.todo}
                      </div>
                    </div>
                    
                    <div className="buttons flex h-full">
                      <button 
                        onClick={(e) => handleEdit(e, item.id)} 
                        className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1 flex items-center justify-center'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, item.id)} 
                        className='bg-violet-800 hover:bg-violet-950 p-2 py-1 text-sm font-bold text-white rounded-md mx-1 flex items-center justify-center'
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App