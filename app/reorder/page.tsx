import { ReorderStats } from './components/ReorderStats';
import { ReorderFilters } from './components/ReorderFilters';
import { ReorderTable } from './components/ReorderTable';
import { StickyActionFooter } from './components/StickyActionFooter';

export default function ReorderPage() {
  return (
    <div className="relative min-h-screen">
       <div className="w-full max-w-[1440px] mx-auto pb-32">
        <ReorderStats />
        <ReorderFilters />
        <ReorderTable />
      </div>
      <StickyActionFooter />
    </div>
  );
}
