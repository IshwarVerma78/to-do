import { useState } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from "uuid";

function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])

  const handleEdit = (e, id) => {

  }

  const handleDelete = (e, id) => {
    let newTodos = todos.filter(item => {
      return item.id !== id
    })

    setTodos(newTodos)
  }

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
    setTodo("")
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
  }

  return (
    <>
      <Navbar />

      <div className="container mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh]">

        <div className="addtodo m-5">
          <h2 className='text-lg font-bold mb-3'>Add a Todo</h2>

          <input
            onChange={handleChange}
            value={todo}
            type="text"
            className='w-1/2 px-2 py-1'
          />

          <button
            onClick={handleAdd}
            className='bg-violet-800 hover:bg-violet-950 p-3 py-1 text-sm font-bold text-white rounded-md mx-6'
          >
            Save
          </button>
        </div>

        <h2 className='text-lg font-bold m-5'>Your Todos</h2>

        <div className="todos">

          {todos.length === 0 && (
            <div className="m-5">No todos to display</div>
          )}

          {todos.map(item => {
            return (
              <div
                key={item.id}
                className="todo flex justify-between items-center my-3"
              >
                <div className='flex gap-5'>
                  <input
                    name={item.id}
                    onChange={handleCheckbox}
                    type="checkbox"
                    checked={item.isCompleted}
                  />

                  <div className={item.isCompleted ? "line-through" : ""}>
                    {item.todo}
                  </div>
                </div>

                <div className="buttons flex gap-2">
                  <button
                    onClick={(e) => handleEdit(e, item.id)}
                    className='bg-violet-800 hover:bg-violet-950 p-3 py-1 text-sm font-bold text-white rounded-md'
                  >
                    Edit
                  </button>

                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className='bg-violet-800 hover:bg-violet-950 p-3 py-1 text-sm font-bold text-white rounded-md'
                  >
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </>
  )
}

export default App