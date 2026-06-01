import React from 'react';
import styles from '@tiem-nha-zit/shared-react/src/lib/ui/styles/page.module.scss';

export default function CheckoutLoading() {
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

      {/* Checkout Screen Content Skeleton */}
      <main className="max-w-[1400px] mx-auto px-4 py-10 grid grid-cols-12 gap-8 w-full box-border">
        
        {/* Left Side: Cart Items list - Span 7 */}
        <div className="col-span-7 max-lg:col-span-12 flex flex-col gap-6 w-full box-border animate-pulse">
          <div className="w-48 h-8 rounded-lg bg-charcoal/10 mb-2"></div>
          
          <div className="rounded-[32px] p-6 bg-white/80 border border-customBorder/15 flex flex-col gap-6 shadow-sm">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="flex gap-4 items-center pb-4 border-b border-customBorder/10 last:border-0 last:pb-0">
                <div className="w-16 h-16 rounded-[12px] bg-charcoal/5"></div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <div className="w-1/2 h-5 rounded bg-charcoal/10"></div>
                  <div className="w-1/3 h-4 rounded bg-charcoal/5"></div>
                </div>
                <div className="w-20 h-5 rounded bg-charcoal/10"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Credit Card Billing Box - Span 5 */}
        <div className="col-span-5 max-lg:col-span-12 flex flex-col gap-6 w-full box-border animate-pulse">
          <div className="w-48 h-8 rounded-lg bg-charcoal/10 mb-2"></div>
          
          <div className="rounded-[32px] p-8 bg-white/80 border border-customBorder/15 shadow-sm flex flex-col gap-6 box-border">
            {/* Input boxes */}
            <div className="flex flex-col gap-2">
              <div className="w-32 h-4 rounded bg-charcoal/5"></div>
              <div className="w-full h-11 rounded-xl bg-charcoal/5"></div>
            </div>
            
            <div className="flex flex-col gap-2">
              <div className="w-24 h-4 rounded bg-charcoal/5"></div>
              <div className="w-full h-11 rounded-xl bg-charcoal/5"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <div className="w-16 h-4 rounded bg-charcoal/5"></div>
                <div className="w-full h-11 rounded-xl bg-charcoal/5"></div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-16 h-4 rounded bg-charcoal/5"></div>
                <div className="w-full h-11 rounded-xl bg-charcoal/5"></div>
              </div>
            </div>

            {/* Total Pricing row and Place order button */}
            <div className="border-t border-customBorder/15 pt-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="w-20 h-5 rounded bg-charcoal/5"></div>
                <div className="w-28 h-6 rounded bg-charcoal/10"></div>
              </div>
              <div className="w-full h-12 rounded-full bg-charcoal/15 mt-2"></div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
