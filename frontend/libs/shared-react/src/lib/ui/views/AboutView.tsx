'use client';

import React from 'react';
import { usePrefetchOnHover } from '../../hooks';
import styles from '../styles/page.module.scss';

interface AboutViewProps {
  setActiveView: (view: 'home' | 'catalog' | 'detail' | 'checkout' | 'tracking' | 'about') => void;
}

export default function AboutView({ setActiveView }: AboutViewProps) {
  const { prefetchView } = usePrefetchOnHover();
  return (
    <div className={styles.aboutTab}>
      {/* 1. HERO BANNER */}
      <section className={styles.aboutHero}>
        <div className={styles.heroOverlay}></div>
        <img
          alt="Hành trình đan len"
          className={styles.heroBgImg}
          src="/merino_scarf.png"
        />
        <div className={styles.heroContent}>
          <span className={styles.heroTag}>Tiệm Nhà Zịt Story</span>
          <h1>Mỗi Mũi Đan, Một Câu Chuyện</h1>
          <p>
            Chúng tôi gìn giữ kỹ nghệ đan tay truyền thống Việt Nam, dệt nên những tác phẩm len 
            organic may đo độc bản mang hơi thở ấm áp của tình yêu thương.
          </p>
        </div>
      </section>

      {/* 2. PHILOSOPHY SECTION */}
      <section className={styles.philosophySection}>
        <div className={styles.containerMax}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Triết Lý Của Zịt</span>
            <h2>Tinh Hoa Trong Từng Chất Liệu</h2>
            <p>
              Tại Tiệm Nhà Zịt, chúng tôi tin rằng một sản phẩm len cao cấp không chỉ là trang phục ấm áp 
              mà còn là sự tôn vinh nghệ thuật thủ công, tính bền vững và sự nâng niu cơ thể.
            </p>
          </div>

          <div className={styles.philosophyGrid}>
            {/* Card 1 */}
            <div className={styles.philosophyCard}>
              <div className={styles.cardIcon}>
                <span className="material-symbols-outlined">yard</span>
              </div>
              <h3>Sợi Len Hữu Cơ Premium</h3>
              <p>
                Tuyển chọn 100% sợi len Merino và Alpaca thượng hạng nhập khẩu chính ngạch từ các nông trại bền vững. 
                Sợi len siêu mềm mịn, giữ ấm hoàn hảo mà hoàn toàn không gây ngứa hay kích ứng da.
              </p>
            </div>

            {/* Card 2 */}
            <div className={styles.philosophyCard}>
              <div className={styles.cardIcon}>
                <span className="material-symbols-outlined">local_florist</span>
              </div>
              <h3>Nhuộm Thảo Mộc Tự Nhiên</h3>
              <p>
                Nói không với hóa chất nhuộm công nghiệp độc hại. Sợi len của chúng tôi được nhuộm màu thủ công 
                từ lá chè xanh, vỏ củ nâu, quả rừng hoang dã, tạo ra bảng màu mộc mạc trầm ấm, tuyệt đối an toàn.
              </p>
            </div>

            {/* Card 3 */}
            <div className={styles.philosophyCard}>
              <div className={styles.cardIcon}>
                <span className="material-symbols-outlined">architecture</span>
              </div>
              <h3>Độc Bản Bespoke Fitting</h3>
              <p>
                Mỗi chiếc áo đều được đan theo đúng số đo riêng của bạn. Đội ngũ nghệ nhân thiết kế dáng áo 
                cho vừa vặn tinh tế từng đường kim mũi đan, mang đến trải nghiệm êm ái chưa từng có.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ARTISAN NETWORK SECTION */}
      <section className={styles.aboutArtisansSection}>
        <div className={styles.containerMax}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Mạng Lưới Bản Địa</span>
            <h2>Những Đôi Tay Thổi Hồn Vào Sợi Len</h2>
            <p>
              Sản phẩm của Tiệm Nhà Zịt là kết tinh tinh hoa từ những hợp tác xã đan tay 
              khắp dải đất hình chữ S. Nơi các nghệ nhân truyền lửa qua từng mũi kim mộc mạc.
            </p>
          </div>

          <div className={styles.artisanRegionGrid}>
            {/* Region 1: Sa Pa */}
            <div className={styles.artisanRegionCard}>
              <div className={styles.cardImage}>
                <img
                  alt="Nghệ nhân H'Mong Sa Pa"
                  src="/vietnam_strap.png"
                />
                <span className={styles.regionBadge}>Sa Pa, Lào Cai</span>
              </div>
              <div className={styles.cardBody}>
                <span className={styles.artisanHighlight}>Hợp Tác Xã Len H'Mong</span>
                <h3>Nghệ Thuật Đan Kim Kép</h3>
                <p>
                  Hơn 30 nghệ nhân bản địa chuyên trách dòng áo khoác vặn thừng dày dặn và khăn choàng 
                  bespoke với kỹ thuật đan kim kép đan xen cực khó, tạo độ đàn hồi và độ bền vĩnh cửu.
                </p>
              </div>
            </div>

            {/* Region 2: Đà Nẵng */}
            <div className={styles.artisanRegionCard}>
              <div className={styles.cardImage}>
                <img
                  alt="Nghệ nhân đan móc Đà Nẵng"
                  src="/vietnam_flower_strap.png"
                />
                <span className={styles.regionBadge}>Đà Nẵng</span>
              </div>
              <div className={styles.cardBody}>
                <span className={styles.artisanHighlight}>Làng Nghề Móc Len Hoa Nổi</span>
                <h3>Họa Tiết Mộc Mạc Tỉ Mỉ</h3>
                <p>
                  Nơi các nghệ nhân đan móc từng đoá hoa cúc, cúc gỗ dừa và họa tiết hoa văn nổi 3D vintage. 
                  Mỗi tác phẩm mất từ 40 đến 60 giờ làm việc tỉ mẩn để đạt độ hoàn hảo tinh tế.
                </p>
              </div>
            </div>

            {/* Region 3: Đà Lạt */}
            <div className={styles.artisanRegionCard}>
              <div className={styles.cardImage}>
                <img
                  alt="Nông trại sợi Đà Lạt"
                  src="/mini_plush_keychain.png"
                />
                <span className={styles.regionBadge}>Đà Lạt, Lâm Đồng</span>
              </div>
              <div className={styles.cardBody}>
                <span className={styles.artisanHighlight}>Nông Trại Hữu Cơ & Thú Bông</span>
                <h3>Nhuộm Màu Thảo Mộc</h3>
                <p>
                  Vùng nguyên liệu nhuộm thiên nhiên và sản xuất dòng thú bông len organic an toàn nhất cho trẻ nhỏ. 
                  Sợi len thấm đượm hương lá rừng mộc mạc tinh khôi của xứ sở ngàn hoa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION SECTION */}
      <section className={styles.aboutCtaSection}>
        <div className={styles.ctaWrapper}>
          <div className={styles.ctaDecor}></div>
          <div className={styles.ctaDecor2}></div>
          <span className={styles.ctaTag}>Sở Hữu Tác Phẩm Của Riêng Bạn</span>
          <h2>Bạn Sẵn Sàng Trải Nghiệm Ấm Áp Chuẩn Dáng Cơ Thể?</h2>
          <p>
            Nhấn xem toàn bộ sản phẩm có sẵn tại cửa hàng hoặc gửi ngay yêu cầu may đo riêng 
            để được nhóm nghệ nhân đo dáng dệt đan chiếc áo dành riêng cho bạn.
          </p>
          <div className={styles.ctaActions}>
            <button
              className={`${styles.btnCtaPrimary} group`}
              onClick={() => setActiveView('catalog')}
              onMouseEnter={() => prefetchView('catalog')}
            >
              <span>Khám Phá Cửa Hàng</span>
              <span className={styles.btnIconWrapper}>
                <span className="material-symbols-outlined">arrow_outward</span>
              </span>
            </button>
            <button
              className={`${styles.btnCtaSecondary} group`}
              onClick={() => setActiveView('home')}
              onMouseEnter={() => prefetchView('home')}
            >
              <span>Quay Lại Trang Chủ</span>
              <span className={styles.btnIconWrapper}>
                <span className="material-symbols-outlined">arrow_forward</span>
              </span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
