export function ImpactMapWidget() {
  return (
    <div className="bg-white dark:bg-[#23220f] rounded-2xl border border-neutral-200 dark:border-neutral-700 p-4 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base text-neutral-dark dark:text-white">Impact Map</h3>
        <button className="text-primary hover:text-[#c4c105]">
          <span className="material-symbols-outlined">open_in_full</span>
        </button>
      </div>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100">
        <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD4ljwks1wYl2OKb5aHDEgmfKnT6oIlQNGBkOlP7bSu5dHDisveh8VJ2s5pI7JLGJzxpf8VB-IbJLS1sGWFLbJ1OPDhflz4QeSs05PlEXXxUYqXdaU2YEtbROoATyKPi8QsyC1JWg0YHi8YwONfr7nbcBT04bgYQirn0GmBanzvAqMt44Lo0ziQEgviVkssTNsEOLzFfoR4Ldm3nRuwfun5cI4xeXvafDfWhmaozCCBaPVzZ13KfGEUo0KMctqdXNTwzznlyEHKxCo')", filter: "grayscale(100%)", opacity: 0.6}}></div>
        {/* Map Pins */}
        <div className="absolute top-1/2 left-1/3 size-3 bg-red-500 rounded-full border-2 border-white shadow-lg animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 size-3 bg-orange-400 rounded-full border-2 border-white shadow-lg"></div>
      </div>
      <div className="flex justify-between text-xs text-neutral-500">
        <span>2 Locations Critical</span>
        <span>Updated 5m ago</span>
      </div>
    </div>
  );
}
