'use client';

import React from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  woolType: string;
  description: string;
}

interface HomeViewProps {
  styles: Record<string, string>;
  setActiveView: (view: 'home' | 'catalog' | 'detail' | 'checkout' | 'tracking') => void;
  setSelectedProduct: (prod: Product) => void;
  PRODUCTS: Product[];
  handleAddToCartDefault: (prod: Product, e: React.MouseEvent) => void;
}

export default function HomeView({
  styles,
  setActiveView,
  setSelectedProduct,
  PRODUCTS,
  handleAddToCartDefault
}: HomeViewProps) {
  return (
    <div className={styles.homeTab}>
      {/* HERO BANNER */}
      <section className={styles.heroSection}>
        <div className={styles.heroBg}>
          <img 
            alt="Cozy knit warm wool blankets" 
            className={`${styles.heroImg} ${styles.animateFadeIn}`} 
            src="https://lh3.googleusercontent.com/aida/ADBb0ugGS8xiSKzBXsjv8f1Ndlh_xEwfvoLw4w-Jkz6jpej5o8qs2KX3QclLsivoMQ3mSg2UHI4Exh8_IkKypIdzDstLCP8Expv5nV73exEJ86YzUJcMijfIvK69Z0l5zGnK0GNACMt6puf5FtAxLz3NounFNAIglefpQIoyMa6W9u-XZzDM1q9fAAwZm_lHxUVAv3liK_uJ9vk6B3F1A7APZvVfLYmqMpmMGoDW2zXj0oVelqv11MLtXPcUQTwI"
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={styles.containerMax}>
          <div className={styles.heroText}>
            <h2 className={styles.animateSlideUp}>Sản Phẩm Từ Tâm - Đan Dệt Yêu Thương</h2>
            <p className={`${styles.animateSlideUp} ${styles.staggerDelay1}`}>Khám phá bộ sưu tập len Merino cao cấp, được đan tay tỉ mỉ bởi những nghệ nhân tại Tiệm Nhà Zịt.</p>
            <div className={`${styles.heroActions} ${styles.animateSlideUp} ${styles.staggerDelay2}`}>
              <button className={`${styles.btnPrimary} ${styles.hoverScaleBtn}`} onClick={() => setActiveView('catalog')}>
                Khám Phá Cửa Hàng
              </button>
              <button className={`${styles.btnSecondary} ${styles.hoverScaleBtn}`} onClick={() => { setSelectedProduct(PRODUCTS[4]); setActiveView('detail'); }}>
                Đặt Đan Theo Yêu Cầu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className={`${styles.storySection} ${styles.revealOnScroll} reveal-on-scroll`}>
        <div className={styles.containerMax}>
          <div className={styles.brandStory}>
            <div className={styles.storyVisual}>
              <div className={styles.storyBorderOffset}></div>
              <img 
                alt="Knitting yarn wool details" 
                className={styles.storyImg} 
                src="https://lh3.googleusercontent.com/aida/ADBb0uhvpx8zRyIkiRxiqR5TYKu0lVSNibzq_zBeQve0TTm-3dGQykEsnaiMfNG28NfXDihyTrMyl6A2rbAVvVNpQYYub2wts4h-7flmo59K_0jpzXdRFc3nPKLRS7QHxhbpTpd4IHhseUNkyV9C3eQLjjehIQH_5tBzOo7mizGcWa-NN3GGSSPH9y1g0i1TK33ziyq9WBZ5UBC3ykeVjMxhk_rPmyfdfacFbtu-YmQKdTXA0E45BVE3QdM4v1f7"
              />
            </div>
            <div className={styles.storyText}>
              <span className={styles.storyTagline}>Câu Chuyện Thương Hiệu</span>
              <h2>Bộ Sưu Tập Nghệ Nhân</h2>
              <p>Tại Tiệm Nhà Zịt, mỗi mũi đan đều mang theo tâm huyết và câu chuyện riêng. Chúng tôi chọn lọc những sợi len Merino tốt nhất, kết hợp cùng đôi bàn tay khéo léo của người thợ địa phương để tạo nên những sản phẩm không chỉ ấm áp mà còn mang tính nghệ thuật cao.</p>
              <div className={styles.storyActionRow}>
                <button className={styles.btnStoryLink} onClick={() => setActiveView('catalog')}>
                  TÌM HIỂU VỀ CHÚNG TÔI <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className={`${styles.bestSellersSection} ${styles.revealOnScroll} reveal-on-scroll`}>
        <div className={styles.containerMax}>
          <div className={styles.sectionHeader}>
            <div className={styles.headerTitleBlock}>
              <h2>Sản Phẩm Nổi Bật</h2>
              <div className={styles.headerTitleLine}></div>
            </div>
            <button className={`${styles.btnViewAll} ${styles.hoverScaleBtn}`} onClick={() => setActiveView('catalog')}>Xem tất cả sản phẩm</button>
          </div>

          <div className={styles.productsGrid}>
            {PRODUCTS.slice(0, 3).map((prod, index) => {
              const staggerClass = index === 0 ? styles.staggerDelay1 : index === 1 ? styles.staggerDelay2 : index === 2 ? styles.staggerDelay3 : '';
              return (
                <div key={prod.id} className={`${styles.productCard} ${styles.revealOnScroll} reveal-on-scroll ${staggerClass}`} onClick={() => { setSelectedProduct(prod); setActiveView('detail'); }}>
                  <div className={styles.cardImageContainer}>
                    <img 
                      src={prod.imageUrl} 
                      alt={prod.name} 
                      className={styles.cardImageReal} 
                    />
                    <span className={styles.cardTag}>{prod.category}</span>
                  </div>
                  <div className={styles.cardInfo}>
                    <h3>{prod.name}</h3>
                    <p className={styles.cardMaterial}>{prod.woolType}</p>
                    <div className={styles.cardBottom}>
                      <span className={styles.cardPrice}>{prod.price.toLocaleString('vi-VN')}đ</span>
                      <button 
                        className={`${styles.cardCartButton} ${styles.hoverRotateIcon}`}
                        onClick={(e) => handleAddToCartDefault(prod, e)}
                        title="Thêm vào giỏ hàng"
                      >
                        <span className="material-symbols-outlined">add_shopping_cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BRAND VALUES */}
      <section className={`${styles.valuesSection} ${styles.revealOnScroll} reveal-on-scroll`}>
        <div className={styles.containerMax}>
          <div className={styles.brandValuesTitle}>
            <h2>Giá Trị Thủ Công</h2>
            <p>Chúng tôi tin rằng cái đẹp nằm ở sự tử tế và bền vững trong từng khâu sản xuất.</p>
          </div>
          <div className={styles.brandValues}>
            <div className={`${styles.valueCard} ${styles.revealOnScroll} reveal-on-scroll ${styles.staggerDelay1}`}>
              <div className={styles.valueIconBox}>
                <span className="material-symbols-outlined">eco</span>
              </div>
              <h3>100% Sợi Hữu Cơ</h3>
              <p>Sợi len tự nhiên được nhập khẩu với đầy đủ chứng chỉ hữu cơ, an toàn cho làn da nhạy cảm.</p>
            </div>
            <div className={`${styles.valueCard} ${styles.revealOnScroll} reveal-on-scroll ${styles.staggerDelay2}`}>
              <div className={styles.valueIconBox}>
                <span className="material-symbols-outlined">palette</span>
              </div>
              <h3>Nhuộm Màu Tự Nhiên</h3>
              <p>Kỹ thuật nhuộm thảo mộc tự nhiên giúp màu sắc bền lâu và không gây hại cho môi trường.</p>
            </div>
            <div className={`${styles.valueCard} ${styles.revealOnScroll} reveal-on-scroll ${styles.staggerDelay3}`}>
              <div className={styles.valueIconBox}>
                <span className="material-symbols-outlined">volunteer_activism</span>
              </div>
              <h3>Hỗ Trợ Nghệ Nhân</h3>
              <p>Tạo công ăn việc làm ổn định cho cộng đồng thợ thủ công tại các làng nghề truyền thống.</p>
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className={`${styles.newsletterOuter} ${styles.revealOnScroll} reveal-on-scroll`}>
        <div className={styles.containerMax}>
          <div className={styles.newsletterSection}>
            <div className={styles.newsletterIconBox}>
              <span className="material-symbols-outlined">mail_outline</span>
            </div>
            <h2>Tham Gia Cùng Chúng Tôi</h2>
            <p>Nhận thông báo sớm nhất về các bộ sưu tập giới hạn và mẹo bảo quản đồ len từ các nghệ nhân.</p>
            <form className={styles.newsletterForm} onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã đăng ký!'); }}>
              <input type="email" placeholder="Email của bạn..." required />
              <button type="submit" className={`${styles.btnNewsletterSubmit} ${styles.hoverScaleBtn}`}>Đăng Ký Ngay</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
