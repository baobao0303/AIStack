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
}

export default function Navbar({
  styles,
  activeView,
  setActiveView,
  isCartOpen,
  setIsCartOpen,
  cartCount,
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
          <button className={`${styles.iconBtn} ${styles.hoverScaleIcon}`} aria-label="Tìm kiếm" onClick={() => setActiveView('catalog')}>
            <span className="material-symbols-outlined">search</span>
          </button>

          <button
            id="cart-trigger"
            className={`${styles.iconBtn} ${isCartOpen ? styles.activeIcon : ''} ${styles.hoverScaleIcon}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsCartOpen(!isCartOpen);
            }}
            aria-label="Giỏ hàng"
          >
            <span className="material-symbols-outlined">shopping_bag</span>
            {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
          </button>

          <button className={`${styles.iconBtn} ${styles.hoverScaleIcon}`} aria-label="Tài khoản" onClick={() => setActiveView('tracking')}>
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
