'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ViewType } from '../../../shared/model/types';

interface NavbarProps {
  styles: Record<string, string>;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const woolPromotions = [
  {
    tag: "Ưu đãi cuộn",
    title: "Giảm 50.000đ khi mua 2 cuộn len Merino nghệ nhân",
    desc: "Áp dụng cho tất cả dòng Merino đan tay thủ công.",
    icon: "🧶"
  },
  {
    tag: "Độc quyền WebApp",
    title: "Giảm 10% Cardigan len Alpaca đan tay bespoke",
    desc: "Đan theo số đo riêng, tự chọn cúc gỗ dừa.",
    icon: "🧥"
  },
  {
    tag: "Combo Đan Móc",
    title: "Giảm 15% khi mua từ 3 thú bông len handmade",
    desc: "Tự chọn phối màu thú bông và phụ kiện đi kèm.",
    icon: "🧸"
  },
  {
    tag: "Tự Đan Tiết Kiệm",
    title: "Giảm 20.000đ cho trọn bộ Set len tự đan cơ bản",
    desc: "Đầy đủ len, kim móc, chart hướng dẫn chi tiết.",
    icon: "🎁"
  },
  {
    tag: "Quà Tặng Premium",
    title: "Tặng kim móc gỗ Rosewood cho đơn từ 1.000.000đ",
    desc: "Kim đan thủ công mộc mạc, cầm êm tay không mỏi.",
    icon: "🥢"
  },
  {
    tag: "Bespoke Fitting",
    title: "Giảm 12% khi đặt lịch tư vấn số đo đan len riêng",
    desc: "Hỗ trợ đo trực tiếp hoặc hướng dẫn online chuẩn dáng.",
    icon: "📐"
  }
];

export default function Navbar({
  styles,
  activeView,
  setActiveView,
  isCartOpen,
  setIsCartOpen,
  cartCount,
  searchQuery,
  setSearchQuery,
}: NavbarProps) {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div 
          className={styles.logoGroup} 
          onClick={() => { setActiveView('home'); setIsCartOpen(false); }}
          onMouseEnter={() => router.prefetch('/')}
        >
          <span className={styles.logoText}>Tiệm Nhà Zịt</span>
        </div>

        <div className={styles.navMenu}>
          <button
            className={`${styles.navItem} ${activeView === 'home' ? styles.active : ''}`}
            onClick={() => { setActiveView('home'); setIsCartOpen(false); }}
            onMouseEnter={() => router.prefetch('/')}
          >
            Trang Chủ
          </button>
          <button
            className={`${styles.navItem} ${activeView === 'catalog' ? styles.active : ''}`}
            onClick={() => { setActiveView('catalog'); setIsCartOpen(false); }}
            onMouseEnter={() => router.prefetch('/product')}
          >
            Sản Phẩm
          </button>
        </div>

        <div className={styles.navIcons}>
          <div className={`${styles.navSearchBox} relative`} ref={searchRef}>
            <span className="material-symbols-outlined">search</span>
            <input 
              type="text" 
              placeholder="Bạn muốn mua gì..." 
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                if (value.trim() !== '' && activeView !== 'catalog') {
                  setActiveView('catalog');
                }
              }}
              onFocus={() => setIsSearchOpen(true)}
              className={styles.navSearchInput}
            />

            {isSearchOpen && (
              <div className="absolute top-[calc(100%+12px)] right-0 w-[520px] max-w-[calc(100vw-32px)] box-border bg-white rounded-2xl shadow-[0_10px_40px_rgba(26,28,26,0.08)] border border-customBorder/80 p-5 z-[1000] font-sans">
                <div className="mb-3.5 text-[13px] font-semibold text-sage tracking-wide">
                  🎁 Ưu đãi đan móc đặc biệt hôm nay
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {woolPromotions.map((promo, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        const searchTerms = ['Merino', 'Alpaca', 'thú bông', 'Set len', 'len', 'len'];
                        setSearchQuery(searchTerms[idx]);
                        setActiveView('catalog');
                        setIsSearchOpen(false);
                      }}
                      className="flex gap-3 items-center p-3 rounded-xl bg-ivory border border-customBorder/30 cursor-pointer transition-all duration-200 hover:bg-sage/5 hover:border-sage hover:-translate-y-0.5"
                    >
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl border border-customBorder/50 shrink-0">
                        {promo.icon}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[9px] text-gold font-bold uppercase tracking-wider">
                          {promo.tag}
                        </span>
                        <h4 className="mt-0.5 text-[11px] font-semibold text-charcoal truncate">
                          {promo.title}
                        </h4>
                        <p className="mt-px text-[9px] text-charcoal/60 truncate">
                          {promo.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            id="cart-trigger"
            className={`${styles.iconBtn} ${isCartOpen ? styles.activeIcon : ''} ${styles.hoverScaleIcon}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsCartOpen(!isCartOpen);
            }}
            aria-label="Giỏ hàng"
          >
            <span className="relative inline-flex">
              <span className="material-symbols-outlined">shopping_bag</span>
              {cartCount > 0 && (
                <strong className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-sage text-white text-[10px] font-bold font-sans rounded-full border-[1.5px] border-ivory leading-none pointer-events-none">
                  {cartCount}
                </strong>
              )}
            </span>
          </button>

          <button 
            className={`${styles.iconBtn} ${styles.hoverScaleIcon} ${activeView === 'login' ? styles.activeIcon : ''}`} 
            aria-label="Tài khoản" 
            onClick={() => { router.push('/sign-in'); setIsCartOpen(false); }}
            onMouseEnter={() => router.prefetch('/sign-in')}
          >
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
