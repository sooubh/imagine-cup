export function RegionalComparison() {
  return (
    <div className="lg:col-span-2 flex flex-col gap-4">
      <h3 className="text-xl font-bold tracking-tight text-neutral-dark dark:text-white">Regional Comparison</h3>
      <div className="bg-white dark:bg-[#23220f] p-1 rounded-[2rem] border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden h-96 relative">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <div className="bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-neutral-100 dark:border-neutral-700 flex items-center gap-2 text-neutral-dark dark:text-white">
            <span className="size-2 bg-primary rounded-full"></span> 5 Critical Zones
          </div>
          <div className="bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-neutral-100 dark:border-neutral-700 flex items-center gap-2 text-neutral-dark dark:text-white">
            <span className="size-2 bg-green-500 rounded-full"></span> 12 Stable Zones
          </div>
        </div>
        <div className="w-full h-full bg-cover bg-center rounded-[1.8rem]" data-alt="Map showing regional distribution of supplies with heatmap overlay" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBZIKSaUDjhjt8fNuo3Vb67mrP0Pe8pY3Fo8Y-Z7ZoPwLYRIRmcrqBSmJjv0gmE_ziy608eieoGSIyKiKQkKUA0Pq-PH2jkULSV0TyvKqL-NtCFpwD9WTMSIVjndZAThCnhXUmh-7utJyXZJqaeIqq7QBsjDOY_bpP5nu0Y3iCW3kwoo551vmWX2Lb-XNtbmUXqahlXodNqZno3rKq-MNShJPRo15U0IJ4T3axlAIKlvhzI7FE9CQ3zsBAhAUUcVJQQa3yjL6OgTX0')"}}></div>
        <button className="absolute bottom-4 right-4 bg-primary text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:brightness-95 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">map</span> Open Interactive Map
        </button>
      </div>
    </div>
  );
}
