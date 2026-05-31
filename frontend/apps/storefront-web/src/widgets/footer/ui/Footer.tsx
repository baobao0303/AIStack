'use client';

import React from 'react';
import { ViewType } from '../../../shared/model/types';
import pageStyles from '../../../shared/styles/page.module.scss';

interface FooterProps {
  styles?: Record<string, string>;
  setActiveView: (view: ViewType) => void;
}

export default function Footer({ styles, setActiveView }: FooterProps) {
  // Gracefully fall back to directly imported styles if props are not provided or empty
  const footerStyles = styles && Object.keys(styles).length > 0 ? styles : pageStyles;

  return (
    <footer className={`${footerStyles.footer} ${footerStyles.revealOnScroll} reveal-on-scroll`}>
      <div className={footerStyles.footerContainer}>
        {/* Column 1: Brand Directory */}
        <div className={`${footerStyles.footerColumn} ${footerStyles.footerColumnBrand}`}>
          <h3>Tiệm Nhà Zịt</h3>
          <p className={footerStyles.footerTagline}>
            Nơi những sợi len dệt nên sự ấm áp và tình yêu dành cho thủ công mỹ nghệ Việt Nam.
          </p>
          <div className={footerStyles.footerSocials}>
            <a href="https://tiemnhazit.com" target="_blank" rel="noopener noreferrer" className={footerStyles.footerSocialBtn}>
              <span className="material-symbols-outlined">language</span>
            </a>
            <a href="mailto:tiemnhazit@gmail.com" className={footerStyles.footerSocialBtn}>
              <span className="material-symbols-outlined">alternate_email</span>
            </a>
          </div>
        </div>

        {/* Column 2: Dịch Vụ */}
        <div className={`${footerStyles.footerColumn} ${footerStyles.footerColumnMenu}`}>
          <h4>Dịch Vụ</h4>
          <ul>
            <li onClick={() => setActiveView('catalog')}>Shipping Policy</li>
            <li onClick={() => setActiveView('catalog')}>Care Guides</li>
            <li onClick={() => setActiveView('catalog')}>Returns</li>
            <li onClick={() => setActiveView('catalog')}>Privacy Policy</li>
          </ul>
        </div>

        {/* Column 3: Bộ Sưu Tập */}
        <div className={`${footerStyles.footerColumn} ${footerStyles.footerColumnMenu}`}>
          <h4>Bộ Sưu Tập</h4>
          <ul>
            <li onClick={() => setActiveView('catalog')}>Đồ Cho Bé</li>
            <li onClick={() => setActiveView('catalog')}>Trang Trí Nhà Cửa</li>
            <li onClick={() => setActiveView('catalog')}>Quà Tặng Handmade</li>
            <li onClick={() => setActiveView('catalog')}>Len Merino Cao Cấp</li>
          </ul>
        </div>

        {/* Column 4: Liên Hệ */}
        <div className={`${footerStyles.footerColumn} ${footerStyles.footerColumnContact}`}>
          <h4>Liên Hệ</h4>
          <ul className={footerStyles.footerContactList}>
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
        <div className={footerStyles.footerBottom}>
          <p className={footerStyles.footerCopy}>© 2024 Tiệm Nhà Zịt. Handcrafted with heart in Vietnam.</p>
        </div>
      </div>
    </footer>
  );
}
