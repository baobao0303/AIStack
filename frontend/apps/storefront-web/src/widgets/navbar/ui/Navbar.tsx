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
        <div className={styles.logoGroup} onClick={() => { setActiveView('home'); setIsCartOpen(false); }}>
          <span className={styles.logoText}>Tiệm Nhà Zịt</span>
        </div>

        <div className={styles.navMenu}>
          <button
            className={`${styles.navItem} ${activeView === 'home' ? styles.active : ''}`}
            onClick={() => { setActiveView('home'); setIsCartOpen(false); }}
          >
            Trang Chủ
          </button>
          <button
            className={`${styles.navItem} ${activeView === 'catalog' ? styles.active : ''}`}
            onClick={() => { setActiveView('catalog'); setIsCartOpen(false); }}
          >
            Sản Phẩm
          </button>
          <button
            className={`${styles.navItem} ${activeView === 'checkout' ? styles.active : ''}`}
            onClick={() => { setActiveView('checkout'); setIsCartOpen(false); }}
          >
            Thanh Toán
          </button>
          <button
            className={`${styles.navItem} ${activeView === 'tracking' ? styles.active : ''}`}
            onClick={() => { setActiveView('tracking'); setIsCartOpen(false); }}
          >
            Theo Dõi Đơn
          </button>
        </div>

        <div className={styles.navIcons}>
          <div className={styles.navSearchBox} ref={searchRef} style={{ position: 'relative' }}>
            <span className="material-symbols-outlined">search</span>
            <input 
              type="text" 
              placeholder="Bạn muốn mua gì..." 
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                // Only jump to the catalog once the user actually types a query
                if (value.trim() !== '' && activeView !== 'catalog') {
                  setActiveView('catalog');
                }
              }}
              onFocus={() => setIsSearchOpen(true)}
              className={styles.navSearchInput}
            />

            {isSearchOpen && (
              <div 
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 12px)',
                  right: 0,
                  width: '520px',
                  maxWidth: 'calc(100vw - 32px)',
                  boxSizing: 'border-box',
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 10px 40px rgba(26, 28, 26, 0.08)',
                  border: '1px solid rgba(194, 200, 192, 0.8)',
                  padding: '20px',
                  zIndex: 1000,
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
              >
                <div style={{ marginBottom: '14px', fontSize: '13px', fontWeight: 600, color: '#4a654f', letterSpacing: '0.02em' }}>
                  🎁 Ưu đãi đan móc đặc biệt hôm nay
                </div>
                <div 
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                  }}
                >
                  {woolPromotions.map((promo, idx) => (
                    <div 
                      key={idx}
                      onClick={() => {
                        const searchTerms = ['Merino', 'Alpaca', 'thú bông', 'Set len', 'len', 'len'];
                        setSearchQuery(searchTerms[idx]);
                        setActiveView('catalog');
                        setIsSearchOpen(false);
                      }}
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        padding: '12px',
                        borderRadius: '12px',
                        backgroundColor: '#faf9f6',
                        border: '1px solid rgba(194, 200, 192, 0.3)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(74, 101, 79, 0.05)';
                        e.currentTarget.style.borderColor = '#4a654f';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#faf9f6';
                        e.currentTarget.style.borderColor = 'rgba(194, 200, 192, 0.3)';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <div 
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          border: '1px solid rgba(194, 200, 192, 0.5)',
                          flexShrink: 0,
                        }}
                      >
                        {promo.icon}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ fontSize: '9px', color: '#c5a059', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {promo.tag}
                        </span>
                        <h4 style={{ margin: '2px 0 0 0', fontSize: '11px', fontWeight: 600, color: '#1a1c1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {promo.title}
                        </h4>
                        <p style={{ margin: '1px 0 0 0', fontSize: '9px', color: 'rgba(26, 28, 26, 0.6)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <span className="material-symbols-outlined">shopping_bag</span>
              {cartCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    minWidth: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#4a654f',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    padding: '0 4px',
                    borderRadius: '99px',
                    lineHeight: 1,
                    border: '1.5px solid #faf9f6',
                    boxSizing: 'border-box',
                    pointerEvents: 'none',
                  }}
                >
                  {cartCount}
                </span>
              )}
            </span>
          </button>

          <button 
            className={`${styles.iconBtn} ${styles.hoverScaleIcon} ${activeView === 'login' ? styles.activeIcon : ''}`} 
            aria-label="Tài khoản" 
            onClick={() => { router.push('/sign-in'); setIsCartOpen(false); }}
          >
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
