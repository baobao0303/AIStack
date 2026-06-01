import React from 'react';
import styles from '@tiem-nha-zit/shared-react/src/lib/ui/styles/page.module.scss';

export default function AboutLoading() {
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

      {/* About View Skeleton Content */}
      <main className="max-w-[1200px] mx-auto px-4 py-12 flex flex-col gap-12 w-full box-border">
        
        {/* Top Intro Section Placeholder */}
        <div className="text-center flex flex-col items-center gap-4 select-none animate-pulse">
          <div className="w-40 h-5 rounded bg-charcoal/5"></div>
          <div className="w-96 h-10 rounded-lg bg-charcoal/10"></div>
          <div className="w-2/3 h-5 rounded bg-charcoal/5 mt-2"></div>
        </div>

        {/* Bento Grid Cells following TFW concentric geometry */}
        <div className="grid grid-cols-3 gap-8 max-md:grid-cols-1 w-full box-border">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={idx} className="rounded-[28px] p-8 bg-white/80 border border-customBorder/15 flex flex-col gap-6 box-border shadow-sm animate-pulse">
              {/* Icon block placeholder */}
              <div className="w-12 h-12 rounded-[16px] bg-charcoal/5"></div>
              <div className="flex flex-col gap-3">
                <div className="w-1/2 h-6 rounded bg-charcoal/10"></div>
                <div className="w-full h-4 rounded bg-charcoal/5"></div>
                <div className="w-5/6 h-4 rounded bg-charcoal/5"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Cooperative section skeleton */}
        <div className="rounded-[32px] p-10 bg-white/80 border border-customBorder/15 shadow-sm flex max-md:flex-col gap-10 items-center box-border animate-pulse select-none mt-4">
          <div className="w-1/3 aspect-square rounded-[20px] bg-charcoal/5 max-md:w-full"></div>
          <div className="flex-1 flex flex-col gap-4">
            <div className="w-24 h-5 rounded bg-charcoal/5"></div>
            <div className="w-80 h-8 rounded-lg bg-charcoal/10"></div>
            <div className="w-full h-4 rounded bg-charcoal/5"></div>
            <div className="w-full h-4 rounded bg-charcoal/5"></div>
            <div className="w-48 h-12 rounded-full bg-charcoal/15 mt-2"></div>
          </div>
        </div>

      </main>
    </div>
  );
}
