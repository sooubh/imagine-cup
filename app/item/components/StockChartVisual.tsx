export function StockChartVisual() {
  return (
    <div className="relative flex-1 w-full min-h-[300px] bg-background-light dark:bg-[#23220f] rounded-xl p-4 md:p-8 overflow-hidden">
      {/* Grid Lines */}
      <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none opacity-10">
        <div className="w-full h-px bg-current text-neutral-dark dark:text-white"></div>
        <div className="w-full h-px bg-current text-neutral-dark dark:text-white"></div>
        <div className="w-full h-px bg-current text-neutral-dark dark:text-white"></div>
        <div className="w-full h-px bg-current text-neutral-dark dark:text-white"></div>
        <div className="w-full h-px bg-current text-neutral-dark dark:text-white"></div>
      </div>
      {/* Labels Y-Axis */}
      <div className="absolute left-2 top-8 bottom-8 flex flex-col justify-between text-[10px] text-neutral-500 font-mono">
        <span>200</span>
        <span>150</span>
        <span>100</span>
        <span>50</span>
        <span>0</span>
      </div>
      {/* Safety Stock Line */}
      <div className="absolute left-8 right-8 bottom-[25%] h-px bg-red-500 border-t border-dashed border-red-500 opacity-50 z-10">
        <span className="absolute right-0 -top-5 text-[10px] text-red-500 font-bold bg-white dark:bg-[#1a190b] px-1 rounded">Safety Stock (40)</span>
      </div>
      {/* Chart Content Container */}
      <div className="relative h-full w-full ml-4 flex items-end gap-1 md:gap-2">
        {/* Historical Bars/Line Area (Simplified as bars for CSS purity) */}
        <div className="h-[60%] w-[5%] bg-neutral-300 dark:bg-neutral-700 rounded-t-sm opacity-50"></div>
        <div className="h-[55%] w-[5%] bg-neutral-300 dark:bg-neutral-700 rounded-t-sm opacity-50"></div>
        <div className="h-[65%] w-[5%] bg-neutral-300 dark:bg-neutral-700 rounded-t-sm opacity-50"></div>
        <div className="h-[70%] w-[5%] bg-neutral-300 dark:bg-neutral-700 rounded-t-sm opacity-50"></div>
        <div className="h-[58%] w-[5%] bg-neutral-300 dark:bg-neutral-700 rounded-t-sm opacity-50"></div>
        {/* Current Day Marker */}
        <div className="h-full w-px border-l-2 border-dotted border-neutral-400 relative mx-2">
          <div className="absolute -top-6 -left-6 bg-neutral-500 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">Today</div>
        </div>
        {/* Prediction Line SVG overlay */}
        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
          {/* Confidence Band */}
          <path d="M 30% 42% L 40% 55% L 50% 65% L 60% 75% L 70% 85% L 70% 35% L 60% 30% L 50% 25% L 40% 20% L 30% 42%" fill="rgba(249, 245, 6, 0.1)" stroke="none"></path>
          {/* Predicted Line */}
          <path d="M 30% 42% Q 50% 50% 70% 85%" fill="none" stroke="#f9f506" strokeDasharray="8 4" strokeLinecap="round" strokeWidth="4"></path>
          {/* End Dot */}
          <circle cx="70%" cy="85%" fill="#f9f506" r="6" stroke="white" strokeWidth="2"></circle>
        </svg>
      </div>
      {/* X-Axis Labels */}
      <div className="absolute bottom-2 left-8 right-8 flex justify-between text-[10px] text-neutral-500 font-mono">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat (Proj)</span>
        <span>Sun (Proj)</span>
      </div>
    </div>
  );
}
