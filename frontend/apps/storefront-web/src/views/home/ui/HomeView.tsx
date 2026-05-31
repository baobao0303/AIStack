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
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const slides = [
    {
      image: "https://lh3.googleusercontent.com/aida/ADBb0uhVFoGEYpMQ4ApsytjsctntvFwVW4pWh4s3RwmAkj2nixSjrnQVoB-zrJ1Ev7qEWihr5aJ6r4ooWWRiA3X4Wa4Gu5TEKD8X98XenUtSMQh9VTJviYKHYOoFItDI349VWGISmeVH5Qy5JFFaWsg9AYsDB_DSy89CERvWOKqcfcunAEw707Na5JIvQ2QyiErApQzb8PW4zKbGLVAsLv_PV0vRQ5I4h-CImO74Rz19--UpuVxt8dTPdvLDTTc",
      title: "Sản Phẩm Từ Tâm - Đan Dệt Yêu Thương",
      description: "Khám phá bộ sưu tập len Merino cao cấp, được đan tay tỉ mỉ bởi những nghệ nhân tại Tiệm Nhà Zịt.",
      actionType: "catalog",
      primaryText: "Khám Phá Cửa Hàng",
      secondaryText: "Đặt Đan Theo Yêu Cầu",
      secondaryAction: "detail"
    },
    {
      image: "https://lh3.googleusercontent.com/aida/ADBb0uhvpx8zRyIkiRxiqR5TYKu0lVSNibzq_zBeQve0TTm-3dGQykEsnaiMfNG28NfXDihyTrMyl6A2rbAVvVNpQYYub2wts4h-7flmo59K_0jpzXdRFc3nPKLRS7QHxhbpTpd4IHhseUNkyV9C3eQLjjehIQH_5tBzOo7mizGcWa-NN3GGSSPH9y1g0i1TK33ziyq9WBZ5UBC3ykeVjMxhk_rPmyfdfacFbtu-YmQKdTXA0E45BVE3QdM4v1f7",
      title: "Nghệ Thuật Đan Tay Truyền Thống",
      description: "Mỗi sản phẩm đều mang một câu chuyện riêng, được dệt nên từ tình yêu và sự tỉ mỉ qua từng mũi kim đan.",
      actionType: "catalog",
      primaryText: "Xem Bộ Sưu Tập",
      secondaryText: "Câu Chuyện Của Zịt",
      secondaryAction: "story"
    },
    {
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAS-VgCNe0c0ipLm_ydBUdPVufGIU1fYPO0CzURgYC_iQ0Np1JriASAlJzZ6eU7VM3uf3yrhDZw5aLmtMJ6T9huT1WhbFbkn5rtDLNZkI5jMHKzT4jh6Ng51VY9ba74nDfewTAfTL2r4gXDFTthe0-H6YZqYThGEIHsHJTD--BSlolpLNBJhv9XOyE_ZpGczyyeOl3QnfQNycoKtEZAeQDeikPxFrXGUjKDeuE7T0Gu1nUmuJYoAsM0cKsf-JUGabrqlGoohSy4BlB8",
      title: "Thiết Kế Độc Bản Cho Riêng Bạn",
      description: "Tùy chọn kích thước, màu sắc và kiểu dáng theo sở thích cá nhân. Chúng tôi đan dệt theo đúng số đo cơ thể của bạn.",
      actionType: "detail",
      primaryText: "Tự Thiết Kế Ngay",
      secondaryText: "Xem Sản Phẩm",
      secondaryAction: "catalog"
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className={styles.homeTab}>
      {/* HERO BANNER WITH SLIDESHOW CAROUSEL */}
      <section className={styles.heroSection}>
        <div className={styles.heroBg}>
          {slides.map((slide, idx) => (
            <div 
              key={idx}
              className={`${styles.slideBgItem} ${currentSlide === idx ? styles.activeSlide : ''}`}
            >
              <img 
                alt={slide.title} 
                className={styles.heroImg} 
                src={slide.image}
              />
              <div className={styles.heroOverlay}></div>
            </div>
          ))}
        </div>
        
        <div className={styles.containerMax}>
          {/* Keyed element forces React to re-trigger slideUp entrance micro-animations on index swap */}
          <div className={styles.heroText} key={currentSlide}>
            <h2 className={styles.animateSlideUp}>{slides[currentSlide].title}</h2>
            <p className={`${styles.animateSlideUp} ${styles.staggerDelay1}`}>{slides[currentSlide].description}</p>
            <div className={`${styles.heroActions} ${styles.animateSlideUp} ${styles.staggerDelay2}`}>
              <button 
                className={`${styles.btnPrimary} ${styles.hoverScaleBtn}`} 
                onClick={() => {
                  if (slides[currentSlide].actionType === 'catalog') {
                    setActiveView('catalog');
                  } else {
                    setSelectedProduct(PRODUCTS[4]);
                    setActiveView('detail');
                  }
                }}
              >
                {slides[currentSlide].primaryText}
              </button>
              <button 
                className={`${styles.btnSecondary} ${styles.hoverScaleBtn}`} 
                onClick={() => {
                  const secAct = slides[currentSlide].secondaryAction;
                  if (secAct === 'catalog') {
                    setActiveView('catalog');
                  } else if (secAct === 'detail') {
                    setSelectedProduct(PRODUCTS[4]);
                    setActiveView('detail');
                  } else if (secAct === 'story') {
                    document.querySelector(`.${styles.storySection}`)?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {slides[currentSlide].secondaryText}
              </button>
            </div>
          </div>
        </div>

        {/* CAROUSEL CONTROLLER DOT INDICATORS */}
        <div className={styles.heroIndicators}>
          {slides.map((_, idx) => (
            <button 
              key={idx}
              className={`${styles.indicatorDot} ${currentSlide === idx ? styles.activeIndicator : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* BRAND STORY */}
      <section className={`${styles.storySection} ${styles.revealOnScroll} reveal-on-scroll`}>
        <div className={styles.containerMax}>
          <div className={styles.brandStory}>
            <div className={styles.storyVisual}>
              <div className={styles.storyBgDecor}></div>
              <div className={styles.storyBorderOffset}></div>
              <img 
                alt="Knitting yarn wool details" 
                className={styles.storyImg} 
                src="https://lh3.googleusercontent.com/aida/ADBb0uhvpx8zRyIkiRxiqR5TYKu0lVSNibzq_zBeQve0TTm-3dGQykEsnaiMfNG28NfXDihyTrMyl6A2rbAVvVNpQYYub2wts4h-7flmo59K_0jpzXdRFc3nPKLRS7QHxhbpTpd4IHhseUNkyV9C3eQLjjehIQH_5tBzOo7mizGcWa-NN3GGSSPH9y1g0i1TK33ziyq9WBZ5UBC3ykeVjMxhk_rPmyfdfacFbtu-YmQKdTXA0E45BVE3QdM4v1f7"
              />
              <div className={styles.storyFloatingCard}>
                <div className={styles.floatingCardImgWrapper}>
                  <img 
                    alt="Detail of organic wool" 
                    src="https://lh3.googleusercontent.com/aida/ADBb0uhVFoGEYpMQ4ApsytjsctntvFwVW4pWh4s3RwmAkj2nixSjrnQVoB-zrJ1Ev7qEWihr5aJ6r4ooWWRiA3X4Wa4Gu5TEKD8X98XenUtSMQh9VTJviYKHYOoFItDI349VWGISmeVH5Qy5JFFaWsg9AYsDB_DSy89CERvWOKqcfcunAEw707Na5JIvQ2QyiErApQzb8PW4zKbGLVAsLv_PV0vRQ5I4h-CImO74Rz19--UpuVxt8dTPdvLDTTc"
                    className={styles.floatingCardImg}
                  />
                </div>
                <div className={styles.floatingCardText}>
                  <span className={styles.floatingCardTitle}>Sợi Len Thượng Hạng</span>
                  <div className={styles.floatingCardRating}>
                    <span className="material-symbols-outlined">grade</span>
                    <span>100% Organic</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.storyText}>
              <span className={styles.storyTagline}>Câu Chuyện Thương Hiệu</span>
              <h2>Bộ Sưu Tập <span className={styles.accentTitle}>Nghệ Nhân</span></h2>
              <p className={styles.storyParagraph}>
                <span className={styles.dropCap}>T</span>ại Tiệm Nhà Zịt, mỗi mũi đan đều mang theo tâm huyết và câu chuyện riêng. Chúng tôi chọn lọc những sợi len Merino tốt nhất, kết hợp cùng đôi bàn tay khéo léo của người thợ địa phương để tạo nên những sản phẩm không chỉ ấm áp mà còn mang tính nghệ thuật cao.
              </p>

              <div className={styles.storyHighlights}>
                <div className={styles.highlightItem}>
                  <div className={styles.highlightIcon}>
                    <span className="material-symbols-outlined">workspace_premium</span>
                  </div>
                  <div className={styles.highlightInfo}>
                    <h4>100% Thủ Công</h4>
                    <p>Đan móc tỉ mỉ từ nghệ nhân Việt</p>
                  </div>
                </div>

                <div className={styles.highlightItem}>
                  <div className={styles.highlightIcon}>
                    <span className="material-symbols-outlined">interests</span>
                  </div>
                  <div className={styles.highlightInfo}>
                    <h4>Merino Thượng Hạng</h4>
                    <p>Sợi len organic siêu mềm và nhẹ</p>
                  </div>
                </div>

                <div className={styles.highlightItem}>
                  <div className={styles.highlightIcon}>
                    <span className="material-symbols-outlined">local_florist</span>
                  </div>
                  <div className={styles.highlightInfo}>
                    <h4>Nhuộm Thảo Mộc</h4>
                    <p>Màu tự nhiên an toàn tuyệt đối</p>
                  </div>
                </div>
              </div>

              <div className={styles.storyActionRow}>
                <button className={styles.btnStoryLink} onClick={() => setActiveView('catalog')}>
                  <span>Khám Phá Hành Trình</span>
                  <span className="material-symbols-outlined">arrow_right_alt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className={`${styles.bestSellersSection} ${styles.revealOnScroll} reveal-on-scroll`}>
        <div className={styles.containerMax}>
          <div className={styles.bestSellersHeader}>
            <span className={styles.bestSellersTagline}>Bộ Sưu Tập Đặc Biệt</span>
            <h2>Sản Phẩm Nổi Bật</h2>
            <p className={styles.bestSellersSub}>Các tác phẩm len cao cấp được đan tay tỉ mỉ bởi nghệ nhân Tiệm Nhà Zịt</p>
            <div className={styles.headerSeparator}>
              <span className={styles.separatorLine}></span>
              <span className="material-symbols-outlined">local_florist</span>
              <span className={styles.separatorLine}></span>
            </div>
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
                        className={styles.cardCartButton}
                        onClick={(e) => { e.stopPropagation(); handleAddToCartDefault(prod, e); }}
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

          <div className={styles.bestSellersFooter}>
            <button className={styles.btnViewAllProducts} onClick={() => setActiveView('catalog')}>
              <span>Xem Tất Cả Sản Phẩm</span>
              <span className="material-symbols-outlined">arrow_right_alt</span>
            </button>
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
