export function ItemProfileCard() {
  return (
    <div className="bg-white dark:bg-[#1a190b] rounded-xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-700 flex flex-col gap-6">
      <div className="relative">
        <div className="w-full bg-center bg-no-repeat aspect-[4/3] bg-cover rounded-xl" data-alt="Box of Amoxicillin medicine on a clean surface" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCiQQiYuwfEMF1htfR8381jmUTKQ9Ggi2mmDssX7B1J1xKPyYCEu5DL6prBcw37JfAM2SFaKYmsd1wUB2wM1XeR_OZyY2hK0ykDh_n3fsH7Ordpg9nAs1fk2fesyZon3xo6dX02M0YIniCBNQrDdVx3GEze3Z0VABVBIseQL3i3bP3bbFD2uU4NwSjpxELMftbkHuhMwBfoHzJEETrEzdQsB7IISyDqIqlOfsTIcdbrjBRpM0RHIMmCaf1_lpKcZKMblD9Rz6c36HI')"}}></div>
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
          <span className="material-symbols-outlined text-[14px]">warning</span>
          Critical
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-start border-b border-neutral-100 dark:border-neutral-700 pb-4">
          <div>
            <p className="text-neutral-500 text-xs uppercase tracking-wider font-bold mb-1">SKU</p>
            <p className="font-mono text-sm font-medium text-neutral-dark dark:text-white">AMX-500-GEN-01</p>
          </div>
          <div className="text-right">
            <p className="text-neutral-500 text-xs uppercase tracking-wider font-bold mb-1">Shelf Life</p>
            <p className="font-medium text-sm text-neutral-dark dark:text-white">18 Months</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background-light dark:bg-[#23220f] p-3 rounded-xl">
            <p className="text-neutral-500 text-xs mb-1">Lead Time</p>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-neutral-500 text-[16px]">local_shipping</span>
              <span className="font-bold text-neutral-dark dark:text-white">3 Days</span>
            </div>
          </div>
          <div className="bg-background-light dark:bg-[#23220f] p-3 rounded-xl">
            <p className="text-neutral-500 text-xs mb-1">Daily Usage</p>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-neutral-500 text-[16px]">trending_up</span>
              <span className="font-bold text-neutral-dark dark:text-white">~42 units</span>
            </div>
          </div>
        </div>
        <div className="pt-2">
          <p className="text-neutral-500 text-xs uppercase tracking-wider font-bold mb-2">Storage Location</p>
          <div className="flex items-center gap-3 p-3 border border-neutral-100 dark:border-neutral-700 rounded-xl">
            <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center text-primary-dark">
              <span className="material-symbols-outlined text-[18px] text-neutral-800">location_on</span>
            </div>
            <div>
              <p className="text-sm font-bold text-neutral-dark dark:text-white">Zone B, Shelf 4</p>
              <p className="text-xs text-neutral-500">Central Warehouse</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
