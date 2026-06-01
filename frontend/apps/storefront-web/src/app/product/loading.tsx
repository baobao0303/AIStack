import React from 'react';
import styles from '@tiem-nha-zit/shared-react/src/lib/ui/styles/page.module.scss';

export default function ProductCatalogLoading() {
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

      {/* Main Container mimicking CatalogView */}
      <main className="max-w-[1600px] mx-auto px-4 py-10 flex gap-8 max-md:flex-col w-full box-border">
        
        {/* Mock Filter Sidebar Skeleton */}
        <aside className="w-[280px] shrink-0 bg-white/85 backdrop-blur-md border border-sage/10 p-6 rounded-3xl h-fit flex flex-col gap-8 shadow-sm max-md:w-full box-border animate-pulse select-none">
          {/* Search slot */}
          <div className="flex flex-col gap-2">
            <div className="w-20 h-4 rounded bg-charcoal/10"></div>
            <div className="w-full h-11 rounded-xl bg-charcoal/5"></div>
          </div>

          {/* Wool types checkboxes */}
          <div className="flex flex-col gap-3">
            <div className="w-24 h-4 rounded bg-charcoal/10"></div>
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-4.5 h-4.5 rounded-full bg-charcoal/5"></div>
                <div className="w-32 h-4 rounded bg-charcoal/5"></div>
              </div>
            ))}
          </div>

          {/* Colors palette */}
          <div className="flex flex-col gap-3">
            <div className="w-28 h-4 rounded bg-charcoal/10"></div>
            <div className="flex flex-wrap gap-2.5">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="w-7 h-7 rounded-full bg-charcoal/5"></div>
              ))}
            </div>
          </div>

          {/* Price slider */}
          <div className="flex flex-col gap-3">
            <div className="w-28 h-4 rounded bg-charcoal/10"></div>
            <div className="w-full h-1.5 rounded bg-charcoal/5"></div>
          </div>

          {/* Clear button */}
          <div className="w-full h-11 rounded-full bg-charcoal/10 mt-2"></div>
        </aside>

        {/* Mock Grid Area */}
        <div className="flex-1 w-full box-border">
          {/* Header Title placeholder */}
          <div className="mb-8 select-none animate-pulse">
            <div className="w-64 h-9 rounded-lg bg-charcoal/10 mb-2"></div>
            <div className="w-96 h-4 rounded bg-charcoal/5"></div>
          </div>

          {/* Grid of Product Cards */}
          <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1 w-full box-border">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="rounded-[32px] p-2.5 bg-white/80 border border-customBorder/15 flex flex-col gap-4 box-border shadow-sm">
                {/* Concentric image placeholder */}
                <div className="aspect-square w-full rounded-[22px] bg-charcoal/5 animate-pulse"></div>
                <div className="p-4 flex flex-col gap-2">
                  <div className="w-16 h-4 rounded bg-charcoal/5 animate-pulse"></div>
                  <div className="w-3/4 h-5 rounded bg-charcoal/10 animate-pulse"></div>
                  <div className="w-full h-4 rounded bg-charcoal/5 animate-pulse mt-1"></div>
                  <div className="flex justify-between items-center mt-3">
                    <div className="w-24 h-6 rounded bg-charcoal/10 animate-pulse"></div>
                    <div className="w-8 h-8 rounded-full bg-charcoal/5 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
