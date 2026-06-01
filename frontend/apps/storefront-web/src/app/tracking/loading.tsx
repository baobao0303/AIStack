import React from 'react';
import styles from '@tiem-nha-zit/shared-react/src/lib/ui/styles/page.module.scss';

export default function TrackingLoading() {
  return (
    <div className={styles.storefrontLayout}>
      <div className={styles.ambientGrain}></div>
      
      {/* Sticky Premium Navbar Skeleton */}
      <header className="sticky top-0 z-[100] bg-ivory/90 backdrop-blur-md border-b border-customBorder/15 py-4 px-6 shadow-sm select-none">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-charcoal/5 animate-pulse"></div>
            <div className="w-32 h-6 rounded-lg bg-charcoal/5 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-8 max-md:hidden">
            <div className="w-16 h-4 rounded bg-charcoal/5 animate-pulse"></div>
            <div className="w-20 h-4 rounded bg-charcoal/5 animate-pulse"></div>
            <div className="w-24 h-4 rounded bg-charcoal/5 animate-pulse"></div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-48 h-10 rounded-xl bg-charcoal/5 max-md:hidden animate-pulse"></div>
            <div className="w-10 h-10 rounded-xl bg-charcoal/5 animate-pulse"></div>
          </div>
        </div>
      </header>

      {/* Tracking Screen Content Skeleton */}
      <main className="max-w-[800px] mx-auto px-4 py-12 flex flex-col gap-10 w-full box-border select-none animate-pulse">
        
        {/* Title and Top Description */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-64 h-9 rounded-lg bg-charcoal/10"></div>
          <div className="w-48 h-4 rounded bg-charcoal/5"></div>
        </div>

        {/* Invoice Summary Card */}
        <div className="rounded-[32px] p-8 bg-white/80 border border-customBorder/15 shadow-sm flex flex-col gap-4 box-border">
          <div className="flex justify-between items-center pb-4 border-b border-customBorder/10">
            <div className="w-32 h-5 rounded bg-charcoal/10"></div>
            <div className="w-24 h-5 rounded bg-charcoal/5"></div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="flex flex-col gap-1.5">
              <div className="w-20 h-4 rounded bg-charcoal/5"></div>
              <div className="w-32 h-5 rounded bg-charcoal/10"></div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="w-24 h-4 rounded bg-charcoal/5"></div>
              <div className="w-40 h-5 rounded bg-charcoal/10"></div>
            </div>
          </div>
        </div>

        {/* Vertical Timeline Progress Bar */}
        <div className="relative pl-10 border-l-2 border-customBorder/15 flex flex-col gap-10 box-border ml-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="relative flex flex-col gap-2">
              {/* Pulsing indicator dot */}
              <div className="absolute left-[-50px] top-1 w-5 h-5 rounded-full border-4 border-white bg-charcoal/20 shadow-sm"></div>
              
              <div className="w-32 h-5 rounded bg-charcoal/10"></div>
              <div className="w-2/3 h-4 rounded bg-charcoal/5"></div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
