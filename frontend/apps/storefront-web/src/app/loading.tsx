import React from 'react';
import styles from '@tiem-nha-zit/shared-react/src/lib/ui/styles/page.module.scss';

export default function StorefrontLoading() {
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

      {/* Main Home Page Grid Skeleton */}
      <main className="max-w-[1600px] mx-auto px-4 py-8 box-border">
        {/* Massive Hero Slider Placeholder following 32px Radius Lock */}
        <div className="w-full h-[580px] max-lg:h-[420px] rounded-[32px] bg-charcoal/5 relative overflow-hidden animate-pulse mb-12">
          <div className="absolute inset-0 flex flex-col justify-end p-12 max-md:p-6 gap-4">
            <div className="w-1/3 h-10 rounded-lg bg-charcoal/10"></div>
            <div className="w-2/3 h-6 rounded bg-charcoal/10"></div>
            <div className="flex gap-4 mt-4">
              <div className="w-40 h-12 rounded-full bg-charcoal/20"></div>
              <div className="w-40 h-12 rounded-full bg-charcoal/10"></div>
            </div>
          </div>
        </div>

        {/* Bento Grid / Featured Categories Section */}
        <div className="mb-12">
          <div className="w-48 h-8 rounded-lg bg-charcoal/5 animate-pulse mb-6"></div>
          <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="h-64 rounded-3xl bg-charcoal/5 animate-pulse p-6 flex flex-col justify-end gap-3 box-border">
                <div className="w-20 h-4 rounded bg-charcoal/10"></div>
                <div className="w-32 h-6 rounded bg-charcoal/20"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Catalog Section Placeholder */}
        <div>
          <div className="w-64 h-8 rounded-lg bg-charcoal/5 animate-pulse mb-6"></div>
          <div className="grid grid-cols-4 gap-6 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="rounded-[32px] p-2.5 bg-white/80 border border-customBorder/15 flex flex-col gap-4 box-border shadow-sm">
                <div className="aspect-square w-full rounded-[22px] bg-charcoal/5 animate-pulse"></div>
                <div className="p-4 flex flex-col gap-2">
                  <div className="w-16 h-4 rounded bg-charcoal/5"></div>
                  <div className="w-3/4 h-5 rounded bg-charcoal/10"></div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="w-24 h-6 rounded bg-charcoal/10"></div>
                    <div className="w-8 h-8 rounded-full bg-charcoal/5"></div>
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
