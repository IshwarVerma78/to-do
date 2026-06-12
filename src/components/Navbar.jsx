
const Navbar = ({ total = 0, done = 0, pending = 0 }) => {
  const radius = 12
  const circumference = 2 * Math.PI * radius
  const percent = total > 0 ? Math.round((done / total) * 100) : 0
  const strokeDashoffset = circumference - (percent / 100) * circumference

  return (
    <nav className="bg-slate-50 border-b border-slate-200/80 px-4 sm:px-5 py-3 flex justify-between items-center rounded-t-2xl select-none">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center shadow-xs">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-4.5 h-4.5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 text-sm tracking-wide">Let's Do</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Simple Stats Summary (text-based for simplicity) */}
        <div className="flex gap-2 text-[10px] font-semibold text-slate-500">
          <div>T: <span className="text-slate-800">{total}</span></div>
          <div>D: <span className="text-indigo-600">{done}</span></div>
          <div>P: <span className="text-amber-600">{pending}</span></div>
        </div>

        {/* Dynamic Circular Progress */}
        <div className="flex items-center gap-1.5 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
          <span className="text-[10px] font-bold text-indigo-700">{percent}%</span>
          <svg className="w-6 h-6 transform -rotate-90">
            <circle cx="12" cy="12" r={radius} className="stroke-indigo-100 fill-none" strokeWidth="2.5" />
            <circle 
              cx="12" 
              cy="12" 
              r={radius} 
              className="stroke-indigo-600 fill-none transition-all duration-300 ease-out" 
              strokeWidth="2.5" 
              strokeDasharray={circumference} 
              strokeDashoffset={strokeDashoffset} 
              strokeLinecap="round" 
            />
          </svg>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

