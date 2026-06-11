import React from 'react'

const Navbar = ({ currentTab, setCurrentTab }) => {
  return (
    <nav className='flex justify-between bg-indigo-900 text-white py-3 px-6 md:px-12 items-center shadow-md'>
      <div className="logo cursor-pointer" onClick={() => setCurrentTab("home")}>
        <span className='font-bold text-xl'>Let's Do</span>
      </div>
      <ul className="flex gap-8">
        <li 
          onClick={() => setCurrentTab("home")} 
          className={`cursor-pointer hover:font-bold transition-all ${currentTab === 'home' ? 'font-bold underline underline-offset-4' : ''}`}
        >
          Home
        </li>
        <li 
          onClick={() => setCurrentTab('tasks')} 
          className={`cursor-pointer hover:font-bold transition-all ${currentTab === 'tasks' ? 'font-bold underline underline-offset-4' : ''}`}
        >
          Your Tasks
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
