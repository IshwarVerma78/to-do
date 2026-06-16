import React from 'react'

const Navbar = ({ total = 0, done = 0, pending = 0 }) => {
  const radius = 12
  const circumference = 2 * Math.PI * radius
  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <nav className="bg-white border-b border-slate-100 px-5 py-4 flex justify-between items-center rounded-t-2xl select-none">
      {/* Brand logo & name */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-4.5 h-4.5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-base tracking-wide">Let's Do</span>
          <span className="text-[10px] text-slate-400 font-medium tracking-tight">Your Task Planner</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Stats Summary */}
        <div className="flex gap-3 text-[11px] font-bold text-slate-500">
          <div className="flex flex-col items-center px-1.5 py-0.5 rounded-md hover:bg-slate-50 transition-colors">
            <span className="text-slate-400 text-[9px] uppercase tracking-wider">Total</span>
            <span className="text-slate-700 mt-0.5">{total}</span>
          </div>
          <div className="flex flex-col items-center px-1.5 py-0.5 rounded-md hover:bg-slate-50 transition-colors">
            <span className="text-indigo-600 text-[9px] uppercase tracking-wider">Done</span>
            <span className="text-indigo-600/90 mt-0.5">{done}</span>
          </div>
          <div className="flex flex-col items-center px-1.5 py-0.5 rounded-md hover:bg-slate-50 transition-colors">
            <span className="text-amber-600 text-[9px] uppercase tracking-wider">Pending</span>
            <span className="text-amber-600 mt-0.5">{pending}</span>
          </div>
        </div>

        {/* Dynamic Circular Progress */}
        <div className="flex items-center gap-2 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 transition-all">
          <span className="text-[11px] font-extrabold text-indigo-700">{percent}%</span>
          <div className="relative w-6.5 h-6.5 flex items-center justify-center">
            <svg className="w-6 h-6 transform -rotate-90">
              <circle cx="12" cy="12" r={radius} className="stroke-slate-100 fill-none" strokeWidth="2.5" />
              <circle 
                cx="12" 
                cy="12" 
                r={radius} 
                className="stroke-indigo-600 fill-none transition-all duration-550 ease-out" 
                strokeWidth="2.5" 
                strokeDasharray={circumference} 
                strokeDashoffset={strokeDashoffset} 
                strokeLinecap="round" 
              />
            </svg>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
