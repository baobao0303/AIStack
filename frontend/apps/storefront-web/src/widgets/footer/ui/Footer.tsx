'use client';

import React from 'react';
import { ViewType } from '../../../shared/model/types';

interface FooterProps {
  styles: Record<string, string>;
  setActiveView: (view: ViewType) => void;
}

export default function Footer({ styles, setActiveView }: FooterProps) {
  return (
    <footer className={`${styles.footer} ${styles.revealOnScroll} reveal-on-scroll`}>
      <div className={styles.footerContainer}>
        <div className={styles.footerBrand}>
          <h3>Tiệm Nhà Zịt</h3>
          <p>Nơi những sợi len dệt nên sự ấm áp và tình yêu dành cho thủ công mỹ nghệ Việt Nam.</p>
        </div>

        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <button className={styles.navItem} onClick={() => setActiveView('home')}>Trang Chủ</button>
          <button className={styles.navItem} onClick={() => setActiveView('catalog')}>Sản Phẩm</button>
          <button className={styles.navItem} onClick={() => setActiveView('checkout')}>Giỏ Hàng</button>
          <button className={styles.navItem} onClick={() => setActiveView('tracking')}>Đơn Hàng</button>
        </div>

        <p className={styles.footerCopy}>© 2024 Tiệm Nhà Zịt. Handcrafted with heart in Vietnam.</p>
      </div>
    </footer>
  );
}
