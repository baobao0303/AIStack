'use client';

import React from 'react';
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
          <div className={styles.navSearchBox}>
            <span className="material-symbols-outlined">search</span>
            <input
              type="text"
              placeholder="Bạn muốn mua gì..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'catalog') {
                  setActiveView('catalog');
                }
              }}
              onClick={() => {
                if (activeView !== 'catalog') {
                  setActiveView('catalog');
                }
              }}
              className={styles.navSearchInput}
            />
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

          <button className={`${styles.iconBtn} ${styles.hoverScaleIcon}`} aria-label="Tài khoản" onClick={() => setActiveView('tracking')}>
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
