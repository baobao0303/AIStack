'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@tiem-nha-zit/shared';
import styles from '../styles/page.module.scss';

interface HomeViewProps {
  setActiveView: (view: 'home' | 'catalog' | 'detail' | 'checkout' | 'tracking') => void;
  setSelectedProduct: (prod: Product) => void;
  PRODUCTS: Product[];
  handleAddToCartDefault: (prod: Product, e: React.MouseEvent) => void;
}

export default function HomeView({
  setActiveView,
  setSelectedProduct,
  PRODUCTS,
  handleAddToCartDefault
}: HomeViewProps) {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = React.useState(0);

  const artisanRegions = [
    {
      id: 'hanoi',
      name: 'Tiệm Nhà Zịt Hub',
      region: 'Hà Nội',
      highlight: 'Bespoke Fitting & Hoàn Thiện',
      desc: 'Nơi tập trung các nhà thiết kế bespoke, thực hiện thiết kế chi tiết dáng người, đo đạc chỉ số cơ thể và hoàn thiện các chi tiết thêu đính thủ công tinh xảo trên áo trước khi đóng gói gửi khách.',
      x: '62.5%',
      y: '19.5%',
      icon: 'architecture'
    },
    {
      id: 'sapa',
      name: 'Hợp Tác Xã Len H\'Mông',
      region: 'Sa Pa, Lào Cai',
      highlight: 'Sợi Alpaca & Đan Tay',
      desc: 'Quy tụ hơn 30 nghệ nhân dân tộc H\'Mông với kỹ nghệ đan kim kép truyền thống siêu việt. Chuyên trách các sản phẩm áo khoác len Merino dầy dặn và khăn choàng bespoke.',
      x: '40%',
      y: '11%',
      icon: 'yard'
    },
    {
      id: 'danang',
      name: 'Làng Móc Len Hoạ Tiết Dân Gian',
      region: 'Đà Nẵng',
      highlight: 'Móc Hoạ Tiết Bespoke',
      desc: 'Nổi tiếng với các hoạ tiết hoa văn đan nổi dân tộc. Nơi các nghệ nhân đan móc từng đoá hoa hồng, cúc gỗ dừa và hoạ tiết vintage tỉ mỉ cho bộ sưu tập len cao cấp.',
      x: '60%',
      y: '50%',
      icon: 'local_florist'
    },
    {
      id: 'dalat',
      name: 'Nông Trại Sợi Hữu Cơ & Nhuộm Thảo Mộc',
      region: 'Đà Lạt, Lâm Đồng',
      highlight: 'Nhuộm Tự Nhiên & Thú Bông',
      desc: 'Trang trại cung cấp các sợi len organic dệt thô tự nhiên. Đặc biệt phụ trách kỹ thuật nhuộm màu từ lá cây, vỏ quả tự nhiên và tạo hình thú bông organic cho bé yêu.',
      x: '55%',
      y: '80%',
      icon: 'yard'
    },
    {
      id: 'saigon',
      name: 'Trung Tâm Bespoke & Phân Phối Phía Nam',
      region: 'TP. Hồ Chí Minh',
      highlight: 'Bespoke Fitting & Ship Hỏa Tốc',
      desc: 'Trực tiếp hỗ trợ đo dáng, tư vấn chất liệu len phù hợp thời tiết phương Nam và điều phối giao hàng hoả tốc các tác phẩm len bespoked cho khách hàng khu vực phía Nam.',
      x: '42.5%',
      y: '92.5%',
      icon: 'local_shipping'
    }
  ];

  const [activeRegion, setActiveRegion] = React.useState(artisanRegions[0]);

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
                onMouseEnter={() => {
                  if (slides[currentSlide].actionType === 'catalog') {
                    router.prefetch('/product');
                  } else {
                    router.prefetch(`/product/${PRODUCTS[4].id}`);
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
                onMouseEnter={() => {
                  const secAct = slides[currentSlide].secondaryAction;
                  if (secAct === 'catalog') {
                    router.prefetch('/product');
                  } else if (secAct === 'detail') {
                    router.prefetch(`/product/${PRODUCTS[4].id}`);
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
                <button 
                  className={styles.btnStoryLink} 
                  onClick={() => setActiveView('catalog')}
                  onMouseEnter={() => router.prefetch('/product')}
                >
                  <span>Khám Phá Hành Trình</span>
                  <span className="material-symbols-outlined">arrow_right_alt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTISAN MAP OF VIETNAM */}
      <section className={`${styles.artisanMapSection} ${styles.revealOnScroll} reveal-on-scroll`}>
        <div className={styles.containerMax}>
          <div className={styles.mapContainer}>
            <div className={styles.mapVisual}>
              <div className={styles.mapSvgWrapper}>
                <svg viewBox="0 0 200 400" className="w-full h-full">
                  <defs>
                    <linearGradient id="vietnamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4a654f" stopOpacity="0.15" />
                      <stop offset="50%" stopColor="#4a654f" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#c5a059" stopOpacity="0.15" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Elegant coordinate grid background */}
                  <g opacity="0.15">
                    <line x1="0" y1="50" x2="200" y2="50" stroke="#4a654f" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="0" y1="150" x2="200" y2="150" stroke="#4a654f" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="0" y1="250" x2="200" y2="250" stroke="#4a654f" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="0" y1="350" x2="200" y2="350" stroke="#4a654f" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="50" y1="0" x2="50" y2="400" stroke="#4a654f" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="100" y1="0" x2="100" y2="400" stroke="#4a654f" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="150" y1="0" x2="150" y2="400" stroke="#4a654f" strokeWidth="0.5" strokeDasharray="2 2" />
                  </g>

                  {/* Realistic closed-path outline of Vietnam */}
                  <path 
                    d="M130,30 C120,30 90,32 80,45 C70,58 75,70 95,78 C115,86 125,92 110,110 C95,128 85,150 90,170 C95,190 120,210 115,240 C110,270 95,290 85,320 C75,350 78,380 90,410 C92,415 85,420 70,425 C55,430 45,425 40,420 C35,415 32,425 35,435 C38,445 50,450 65,448 C80,446 100,430 105,405 C110,380 100,350 112,320 C124,290 135,270 130,240 C125,210 105,190 112,170 C119,150 135,128 138,110 C141,92 145,86 142,70 C139,54 140,30 130,30 Z" 
                    fill="url(#vietnamGrad)"
                    stroke="#4a654f"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                  />

                  {/* Phu Quoc Island */}
                  <path
                    d="M 28 385 Q 26 388 28 392 T 32 390 Z"
                    fill="url(#vietnamGrad)"
                    stroke="#4a654f"
                    strokeWidth="1"
                  />

                  {/* Hoang Sa (Paracel Islands) */}
                  <g opacity="0.75" transform="translate(145, 170)">
                    <circle cx="0" cy="0" r="1.5" fill="#c5a059" />
                    <circle cx="6" cy="4" r="1.2" fill="#c5a059" />
                    <circle cx="4" cy="10" r="1.5" fill="#c5a059" />
                    <text x="10" y="7" fontSize="5.5" fill="#4a654f" fontFamily="var(--font-be-vietnam-pro), sans-serif" fontWeight="bold">Hoàng Sa</text>
                  </g>

                  {/* Truong Sa (Spratly Islands) */}
                  <g opacity="0.75" transform="translate(130, 310)">
                    <circle cx="0" cy="0" r="1.2" fill="#c5a059" />
                    <circle cx="8" cy="6" r="1.5" fill="#c5a059" />
                    <circle cx="4" cy="12" r="1.2" fill="#c5a059" />
                    <circle cx="12" cy="18" r="1.5" fill="#c5a059" />
                    <text x="16" y="12" fontSize="5.5" fill="#4a654f" fontFamily="var(--font-be-vietnam-pro), sans-serif" fontWeight="bold">Trường Sa</text>
                  </g>
                </svg>

                {/* Pulsing Interactive Location Markers */}
                {artisanRegions.map((reg) => (
                  <div
                    key={reg.id}
                    className={`${styles.mapPin} ${activeRegion.id === reg.id ? styles.activePin : ''}`}
                    style={{ left: reg.x, top: reg.y }}
                    onClick={() => setActiveRegion(reg)}
                    title={reg.name}
                  >
                    <div className={styles.pinDot}></div>
                    <div className={styles.pinPulse}></div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.mapInfo}>
              <div className={styles.mapHeader}>
                <span className={styles.mapTagline}>Mạng Lưới Nghệ Nhân Việt</span>
                <h2>Bản Đồ Thủ Công</h2>
                <p>Khám phá bản đồ nghệ nhân của Tiệm Nhà Zịt - nơi hội tụ tình yêu đan móc từ các vùng miền đất nước, dệt nên những sản phẩm chất lượng cao nhất.</p>
              </div>

              {/* Glassmorphic Artisan Detail Card */}
              <div className={`${styles.artisanCard} ${styles.animateFadeIn}`} key={activeRegion.id}>
                <span className={styles.cardRegion}>{activeRegion.region}</span>
                <h3>{activeRegion.name}</h3>
                
                <div className={styles.cardHighlight}>
                  <span className="material-symbols-outlined">{activeRegion.icon}</span>
                  <span>{activeRegion.highlight}</span>
                </div>

                <p>{activeRegion.desc}</p>
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
                <div 
                  key={prod.id} 
                  className={`${styles.productCard} ${styles.revealOnScroll} reveal-on-scroll ${staggerClass}`} 
                  onClick={() => { setSelectedProduct(prod); setActiveView('detail'); }}
                  onMouseEnter={() => router.prefetch(`/product/${prod.id}`)}
                >
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
                    {/* Product Description snippet */}
                    <p className="text-[11px] leading-relaxed text-charcoal/50 mt-2 mb-3.5 line-clamp-2 h-[34px] font-sans box-border select-none">
                      {prod.description}
                    </p>
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
            <button 
              className={styles.btnViewAllProducts} 
              onClick={() => setActiveView('catalog')}
              onMouseEnter={() => router.prefetch('/product')}
            >
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
            <span className={styles.valuesTagline}>Tiêu Chuẩn Xanh</span>
            <h2>Giá Trị Thủ Công</h2>
            <div className={styles.titleSeparator}>
              <div className={styles.line}></div>
              <span className="material-symbols-outlined">yard</span>
              <div className={styles.line}></div>
            </div>
            <p>Chúng tôi tin rằng cái đẹp nằm ở sự tử tế và bền vững trong từng khâu sản xuất.</p>
          </div>
          <div className={styles.brandValues}>
            <div className={`${styles.valueCard} ${styles.revealOnScroll} reveal-on-scroll ${styles.staggerDelay1}`}>
              <div className={styles.cardNumber}>01</div>
              <div className={styles.valueIconBox}>
                <span className="material-symbols-outlined">eco</span>
              </div>
              <h3>100% Sợi Hữu Cơ</h3>
              <p>Sợi len tự nhiên được nhập khẩu với đầy đủ chứng chỉ hữu cơ, an toàn cho làn da nhạy cảm.</p>
            </div>
            <div className={`${styles.valueCard} ${styles.revealOnScroll} reveal-on-scroll ${styles.staggerDelay2}`}>
              <div className={styles.cardNumber}>02</div>
              <div className={styles.valueIconBox}>
                <span className="material-symbols-outlined">palette</span>
              </div>
              <h3>Nhuộm Màu Tự Nhiên</h3>
              <p>Kỹ thuật nhuộm thảo mộc tự nhiên giúp màu sắc bền lâu và không gây hại cho môi trường.</p>
            </div>
            <div className={`${styles.valueCard} ${styles.revealOnScroll} reveal-on-scroll ${styles.staggerDelay3}`}>
              <div className={styles.cardNumber}>03</div>
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
            <span className={styles.newsletterTagline}>Bản Tin Độc Quyền</span>
            <h2>Tham Gia Cùng Chúng Tôi</h2>
            <p>Đăng ký nhận thông báo sớm nhất về các bộ sưu tập giới hạn và bí quyết bảo quản đồ len đan tay từ các nghệ nhân bậc thầy.</p>
            <form className={styles.newsletterForm} onSubmit={(e) => { e.preventDefault(); alert('Cảm ơn bạn đã đăng ký!'); }}>
              <input type="email" placeholder="Email của bạn..." required />
              <button type="submit" className={styles.btnNewsletterSubmit}>Đăng Ký Ngay</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
