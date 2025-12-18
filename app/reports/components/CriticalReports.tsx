export function CriticalReports() {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold tracking-tight text-neutral-dark dark:text-white">Critical Reports</h3>
        <button className="text-sm font-bold text-neutral-500 hover:text-neutral-dark dark:hover:text-white flex items-center gap-1">
          View all history
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Stock-out Prevention */}
        <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-[2rem] bg-white dark:bg-[#23220f] shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold mb-2">
                <span className="size-2 rounded-full bg-red-600 animate-pulse"></span>
                High Priority
              </div>
              <h4 className="text-lg font-bold text-neutral-dark dark:text-white mb-1">Stock-out Prevention</h4>
              <p className="text-neutral-500 text-sm leading-relaxed">Forecasts potential shortages for next 30 days. <br/><span className="font-semibold text-neutral-dark dark:text-white">Confidence: 94%</span></p>
            </div>
            <div className="flex gap-3 mt-2">
              <button className="flex-1 h-9 rounded-full bg-background-light dark:bg-black/20 text-neutral-dark dark:text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 dark:hover:bg-black/40 transition-colors">
                <span className="material-symbols-outlined text-[16px]">visibility</span> Preview
              </button>
              <button className="flex-1 h-9 rounded-full bg-primary text-black text-xs font-bold flex items-center justify-center gap-2 hover:brightness-95 transition-colors">
                <span className="material-symbols-outlined text-[16px]">download</span> PDF
              </button>
            </div>
          </div>
          <div className="w-full sm:w-40 aspect-video sm:aspect-square bg-cover bg-center rounded-2xl" data-alt="Abstract line chart showing stock levels dipping below a critical threshold" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCZt14DoI4725sG9ch5xEHngnnVz3Hfa4W-TXvccJFD1LLOCm8lB-Z4wkQXN41uZustRtXNdBjUhloeK0HhifUBpD42Z-G5pnKZkMSM7xmMretWvHT5pYRH82uyUt-GVMeistgFiQVvwWFcp98bJYNQdr0hCduMI1QhPguU_TnCpR7p4lD83lnS8tydqfq5EolIg1o6qhi32lnh0MApkE9UKw8uufBVTqyyOtaBJFx6qyWvXSfAuUQmdswgWgXS1Kz62yoKyG30I-g')"}}></div>
        </div>
        {/* Card 2: Waste Reduction */}
        <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-[2rem] bg-white dark:bg-[#23220f] shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold mb-2">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                Optimization
              </div>
              <h4 className="text-lg font-bold text-neutral-dark dark:text-white mb-1">Waste Reduction Summary</h4>
              <p className="text-neutral-500 text-sm leading-relaxed">Expiring stock analysis and redistribution opportunities.</p>
            </div>
            <div className="flex gap-3 mt-2">
              <button className="flex-1 h-9 rounded-full bg-background-light dark:bg-black/20 text-neutral-dark dark:text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 dark:hover:bg-black/40 transition-colors">
                <span className="material-symbols-outlined text-[16px]">visibility</span> Preview
              </button>
              <button className="flex-1 h-9 rounded-full bg-primary text-black text-xs font-bold flex items-center justify-center gap-2 hover:brightness-95 transition-colors">
                <span className="material-symbols-outlined text-[16px]">download</span> XLS
              </button>
            </div>
          </div>
          <div className="w-full sm:w-40 aspect-video sm:aspect-square bg-cover bg-center rounded-2xl" data-alt="Pie chart visualization of waste categories" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBA1EysNfUbZIvZTJEULR6fcrtQoavuY96gEnYR9NrTO0Fvgeijxh538--YuMshBXKHiFlVqlWEbNcgcbNc15wEIsC4kGFwzbS8Luo1Z9-LuRgo83blm3TC0-nBtnAEcoaJnh3kc1R-5jZSeiS2QWlMtg-SOdoNASDuf-4CNJwxILkL97WEyNSHBTgYQwAF3pG39DngJ5BX5tfaulWuxrldw0kYSC4qEt9rhqURv0g9Gy3nybtWUnxARxv1MAsG9ERmkknnKeto1LY')"}}></div>
        </div>
      </div>
    </section>
  );
}
