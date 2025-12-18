export function StickyActionFooter() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 lg:pb-8 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-[#23220f] dark:bg-black text-white rounded-full shadow-2xl shadow-black/20 flex items-center justify-between px-2 py-2 pl-6 gap-6 max-w-4xl w-full border border-gray-700/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-black text-xs font-bold">1</span>
            <span className="text-sm font-medium whitespace-nowrap hidden sm:inline">Item selected</span>
          </div>
          <div className="h-4 w-px bg-gray-600 hidden sm:block"></div>
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white group relative" title="Export to PDF">
              <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
            </button>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white" title="Export to CSV">
              <span className="material-symbols-outlined text-xl">csv</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors border border-white/10 whitespace-nowrap">
            Mark Ordered
          </button>
          <button className="px-6 py-2.5 rounded-full bg-primary hover:bg-[#eae605] text-black text-sm font-bold shadow-lg shadow-yellow-400/20 transition-all transform active:scale-95 flex items-center gap-2 whitespace-nowrap">
            Send to Procurement
            <span className="material-symbols-outlined text-lg">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
