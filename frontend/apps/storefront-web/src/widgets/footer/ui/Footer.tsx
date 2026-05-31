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
        {/* Column 1: Brand Directory */}
        <div className={`${styles.footerColumn} ${styles.footerColumnBrand}`}>
          <h3>Tiệm Nhà Zịt</h3>
          <p className={styles.footerTagline}>
            Nơi những sợi len dệt nên sự ấm áp và tình yêu dành cho thủ công mỹ nghệ Việt Nam.
          </p>
          <div className={styles.footerSocials}>
            <a href="https://tiemnhazit.com" target="_blank" rel="noopener noreferrer" className={styles.footerSocialBtn}>
              <span className="material-symbols-outlined">language</span>
            </a>
            <a href="mailto:tiemnhazit@gmail.com" className={styles.footerSocialBtn}>
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
          </div>
        </div>

        {/* Column 2: Dịch Vụ */}
        <div className={`${styles.footerColumn} ${styles.footerColumnMenu}`}>
          <h4>Dịch Vụ</h4>
          <ul>
            <li onClick={() => setActiveView('catalog')}>Shipping Policy</li>
            <li onClick={() => setActiveView('catalog')}>Care Guides</li>
            <li onClick={() => setActiveView('catalog')}>Returns</li>
            <li onClick={() => setActiveView('catalog')}>Privacy Policy</li>
          </ul>
        </div>

        {/* Column 3: Bộ Sưu Tập */}
        <div className={`${styles.footerColumn} ${styles.footerColumnMenu}`}>
          <h4>Bộ Sưu Tập</h4>
          <ul>
            <li onClick={() => setActiveView('catalog')}>Đồ Cho Bé</li>
            <li onClick={() => setActiveView('catalog')}>Trang Trí Nhà Cửa</li>
            <li onClick={() => setActiveView('catalog')}>Quà Tặng Handmade</li>
            <li onClick={() => setActiveView('catalog')}>Len Merino Cao Cấp</li>
          </ul>
        </div>

        {/* Column 4: Liên Hệ */}
        <div className={`${styles.footerColumn} ${styles.footerColumnContact}`}>
          <h4>Liên Hệ</h4>
          <ul className={styles.footerContactList}>
            <li>
              <span className="material-symbols-outlined">location_on</span>
              Hà Nội, Việt Nam
            </li>
            <li>
              <span className="material-symbols-outlined">mail</span>
              tiemnhazit@gmail.com
            </li>
            <li>
              <span className="material-symbols-outlined">phone</span>
              090 123 4567
            </li>
          </ul>
        </div>

        {/* Copyright Centered at the Bottom */}
        <div className={styles.footerBottom}>
          <p className={styles.footerCopy}>© 2024 Tiệm Nhà Zịt. Handcrafted with heart in Vietnam.</p>
        </div>
      </div>
    </footer>
  );
}
