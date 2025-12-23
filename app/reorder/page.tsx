import { Suspense } from 'react';
import { ReorderPageContent } from './components/ReorderPageContent';

export default function ReorderPage() {
  return (
    <div className="relative min-h-screen">
      <Suspense fallback={
        <div className="w-full max-w-[1440px] mx-auto pb-12 px-4 md:px-6 animate-pulse">
          <div className="h-32 bg-neutral-100 dark:bg-neutral-800 rounded-2xl mb-8" />
          <div className="h-16 bg-neutral-100 dark:bg-neutral-800 rounded-2xl mb-6" />
          <div className="h-96 bg-neutral-100 dark:bg-neutral-800 rounded-3xl" />
        </div>
      }>
        <ReorderPageContent />
      </Suspense>
    </div>
  );
}
