'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';

// Import modular subcomponents
import ShaderBackground from './components/ShaderBackground';
import HomeView from './components/HomeView';
import CatalogView from './components/CatalogView';
import DetailView from './components/DetailView';
import CheckoutView from './components/CheckoutView';
import TrackingView from './components/TrackingView';
import CartFloatingModal from './components/CartFloatingModal';

// High-Res Stitch Products list merged with refined assets from Stitch
const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Gấu Bông Len Dệt',
    category: 'Thú Bông',
    price: 450000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfz-gpQRdR3LqTKA5OOvhWH2gh1Uxt8Ufje8yRHHPK70WNK3swJthGe4YJjkPxN8ufymz5uk73csP72PulZ5XyV_Rm-p8TIosyi60sqHN8tI9sv0pJvhzqvDvC49lpYpVPWwS_7xyf7rpZuF3ZsblBRLRsMZybxpIbEPi5NddUZQtslp8XwFTw8FVcmln2NdGtFnoegEZ2PHonWUwA34kHAwpC47OLFuzl_WV1kGdNxOTj930cIIebOzvFq_pl4KUvHUsMLuLBQ2WY',
    woolType: 'Merino Wool',
    description: 'Thú bông gấu dệt thủ công từ sợi len tự nhiên, vô cùng êm ái và an toàn cho làn da nhạy cảm của bé. Mỗi sản phẩm được các nghệ nhân móc tỉ mỉ trong 3 ngày.'
  },
  {
    id: 'prod-2',
    name: 'Áo Khoác Merino',
    category: 'Thời Trang',
    price: 1250000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAS-VgCNe0c0ipLm_ydBUdPVufGIU1fYPO0CzURgYC_iQ0Np1JriASAlJzZ6eU7VM3uf3yrhDZw5aLmtMJ6T9huT1WhbFbkn5rtDLNZkI5jMHKzT4jh6Ng51VY9ba74nDfewTAfTL2r4gXDFTthe0-H6YZqYThGEIHsHJTD--BSlolpLNBJhv9XOyE_ZpGczyyeOl3QnfQNycoKtEZAeQDeikPxFrXGUjKDeuE7T0Gu1nUmuJYoAsM0cKsf-JUGabrqlGoohSy4BlB8',
    woolType: 'Merino Wool',
    description: 'Áo khoác dệt từ sợi len Merino cao cấp, ấm áp và nhẹ nhàng, lý tưởng cho những ngày đông lạnh giá. Kiểu dáng thanh lịch phù hợp với mọi phong cách.'
  },
  {
    id: 'prod-3',
    name: 'Khăn Choàng Mùa Đông',
    category: 'Phụ Kiện',
    price: 350000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA5t8wAmtJt3DR66c_xJYlWRk8Kgm8ycajBLnpI4KqUJ413gKCDBKD74fBJlWiO-UbENoNb7ckXqkH0uvLOGid9z4nA84FBnboSh2IO6HZaeRU9tcurfjHyfTsR0HiFHpCBb91ya7xUyot-J47QT9-jRB3qCIA9RNFLAj9BtnjUjsOeyT3HCQfajdomKVuSzaG0GUjs73-8zI6vCBa60hQiEd1R4z9wn6WLS2vuLDt8Ryh4jFtEvov0vGBCr5Gf_pVUDlatEZ-eZbCG',
    woolType: 'Organic Cotton',
    description: 'Khăn choàng dệt tay với họa tiết tinh tế và màu sắc nhuộm thảo mộc tự nhiên. Vừa giữ ấm vừa là điểm nhấn phụ kiện thời trang sang trọng.'
  },
  {
    id: 'prod-4',
    name: 'Cozy Alpaca Beanie',
    category: 'Mũ Len',
    price: 450000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANuKTsF-ESnKqmbd-qY2D57OcW-mnzEZSLyxe8nvWxjZRfzepLlRcPwPP3pZMT1yW3XNgstckkHFus9LiW9QY2RCbcny2x2En6DLsRr5WI1Ip6bbvT-S5c1raa-A1zQlaYBd0GrwdSWfpU1EiK6wHSFXEeXr4qYwpT-uIe0GDeS4ZvSmsMBME62UZ-Q1qQ3WuhKk7kly3cnFbmiwhCqTV4gK7NMzUNp4In7odgi_A1TYL7MIQ1RcWkz27E2VinkULXbH94pDYwnuj-',
    woolType: 'Alpaca Wool',
    description: 'Mũ len Beanie siêu mềm mịn dệt từ sợi Baby Alpaca nhập khẩu cao cấp. Thiết kế ôm vừa vặn, giữ ấm tối ưu mà không gây ngứa hay khó chịu.'
  },
  {
    id: 'prod-5',
    name: 'Merino Knit Cardigan',
    category: 'Thời Trang',
    price: 1850000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeOSk17YTTFP1fbf80ORifUtVHv-W-KvPS9WZgOES7G23rjKt46WY8_jObQ-lALsc_ETc4bqOavcDx8AbRFtytywhlmGcBr2uYUBPxmxWCL4vGyklwPIHBepGxYoEtHnrKXOkrV1eOpSKZB_SIgdEs9dXMFgBdPZeQm9abtV4ZvDsjyxQqjWX9pBL1qejM54JN0swiENo-8G4QzGPr-_jQFBfDhxTcFyeH5OA7W_kqAz_9FlTgDG5ScZaJtc4c4qrFWYEp5XPb8gS3',
    woolType: 'Merino Wool',
    description: 'Áo cardigan đan tay thủ công tinh xảo, sử dụng 100% sợi len Merino thượng hạng. Mỗi chiếc áo mất 15-20 ngày đan tay bởi những nghệ nhân bậc thầy.'
  },
  {
    id: 'prod-6',
    name: 'Cute Woolen Octopus',
    category: 'Thú Bông',
    price: 350000,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOYdXABT0zL5JsFAEoD2ZbJpomioGZsz99pikYfkrPspKlCulzdT5FFbVmq2B4rCNu4RxIONMt9HQBdfA7uJg60IxJyXFQOD4eTAYwnf1qixfptENkE_M36cV7A6KKIUBcf5UQyVDmb81hJF2lsAX46iLEaKzP-Y0sDVlZbdgGRd9uBdKoyagP5z_zifpcEtrYiZLIUkAjRJDuwPrRaCvsF-vwzikOJSLTKwuZErT5bUlt_j7ZQ0NGN7CXn1zGKLudcGyJHvlw0ZAz',
    woolType: 'Organic Cotton',
    description: 'Bạch tuộc nhồi bông nhỏ nhắn dễ thương móc hoàn toàn từ sợi cotton hữu cơ kháng khuẩn. Món quà tặng thủ công hoàn hảo và an toàn cho bé yêu.'
  }
];

interface CartItem {
  id: string;
  product: typeof PRODUCTS[0];
  quantity: number;
  customColor: string;
  chestWidth: string;
  sleeveLength: string;
  height: string;
  customNotes: string;
}

interface Order {
  orderId: string;
  items: CartItem[];
  total: number;
  shipping: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
  status: 'received' | 'knitting' | 'completed' | 'shipping' | 'success';
  date: string;
}



export default function StorefrontIndex() {
  const [activeView, setActiveView] = useState<'home' | 'catalog' | 'detail' | 'checkout' | 'tracking'>('home');
  const [selectedProduct, setSelectedProduct] = useState<typeof PRODUCTS[0]>(PRODUCTS[4]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Catalog filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWoolTypes, setSelectedWoolTypes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(2000000);

  // Customizer inputs state
  const [customColor, setCustomColor] = useState('Sage Green');
  const [chestWidth, setChestWidth] = useState('85');
  const [sleeveLength, setSleeveLength] = useState('58');
  const [height, setHeight] = useState('165');
  const [customNotes, setCustomNotes] = useState('');
  const [detailMainImage, setDetailMainImage] = useState('');

  // Cart & checkout states
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      product: PRODUCTS[4],
      quantity: 1,
      customColor: 'Sage Green',
      chestWidth: '85',
      sleeveLength: '58',
      height: '165',
      customNotes: 'Mong muốn dáng áo hơi rộng một chút...'
    },
    {
      id: 'cart-init-2',
      product: PRODUCTS[0],
      quantity: 1,
      customColor: 'Cream',
      chestWidth: 'N/A',
      sleeveLength: 'N/A',
      height: 'N/A',
      customNotes: 'Đóng gói hộp quà tặng bé trai.'
    }
  ]);

  const [shippingForm, setShippingForm] = useState({
    name: '',
    email: '',
    address: '',
    city: 'Hà Nội'
  });

  const [stripeCard, setStripeCard] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  // Sync main image in Detail View when product selection changes
  useEffect(() => {
    if (selectedProduct) {
      setDetailMainImage(selectedProduct.imageUrl);
      // Set defaults for customization
      setCustomColor('Sage Green');
      if (selectedProduct.category === 'Thời Trang' || selectedProduct.category === 'Mũ Len') {
        setChestWidth('85');
        setSleeveLength('58');
        setHeight('165');
      } else {
        setChestWidth('N/A');
        setSleeveLength('N/A');
        setHeight('N/A');
      }
      setCustomNotes('');
    }
  }, [selectedProduct]);

  // Handle Add to Cart from Catalog
  const handleAddToCartDefault = (prod: typeof PRODUCTS[0], e: React.MouseEvent) => {
    e.stopPropagation();
    const isFashion = prod.category === 'Thời Trang' || prod.category === 'Mũ Len';
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random()}`,
      product: prod,
      quantity: 1,
      customColor: 'Sage Green',
      chestWidth: isFashion ? '85' : 'N/A',
      sleeveLength: isFashion ? '58' : 'N/A',
      height: isFashion ? '165' : 'N/A',
      customNotes: ''
    };
    setCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  // Handle Add to Cart from Customizer Detail Page
  const handleAddToCartCustom = () => {
    const newItem: CartItem = {
      id: `cart-${Date.now()}-${Math.random()}`,
      product: selectedProduct,
      quantity: 1,
      customColor,
      chestWidth,
      sleeveLength,
      height,
      customNotes
    };
    setCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.id !== itemId));
  };

  // Simulated Payment Checkout
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingForm.name || !shippingForm.email || !shippingForm.address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }
    setCheckoutLoading(true);

    setTimeout(() => {
      const newOrder: Order = {
        orderId: `ZIT-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...cart],
        total: cartTotal,
        shipping: { ...shippingForm },
        status: 'received',
        date: new Date().toLocaleDateString('vi-VN')
      };
      setOrderHistory([newOrder, ...orderHistory]);
      setActiveOrder(newOrder);
      setCart([]);
      setCheckoutLoading(false);
      setActiveView('tracking');
    }, 2000);
  };

  // Filter products based on Sidebar search and selections
  const filteredProducts = PRODUCTS.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesWool = selectedWoolTypes.length === 0 || selectedWoolTypes.includes(prod.woolType);

    // Simulate color matches (just for interactivity demonstration)
    const matchesColor = selectedColors.length === 0 ||
      selectedColors.includes('Sage') && prod.id === 'prod-5' ||
      selectedColors.includes('Cream') && prod.id === 'prod-1' ||
      selectedColors.includes('Oatmeal') && prod.id === 'prod-2' ||
      selectedColors.includes('Lavender') && prod.id === 'prod-4';

    const matchesPrice = prod.price <= maxPrice;

    return matchesSearch && matchesWool && matchesColor && matchesPrice;
  });

  const toggleWoolType = (type: string) => {
    if (selectedWoolTypes.includes(type)) {
      setSelectedWoolTypes(selectedWoolTypes.filter((t) => t !== type));
    } else {
      setSelectedWoolTypes([...selectedWoolTypes, type]);
    }
  };

  const toggleColorFilter = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter((c) => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  // Simulate Order Tracking Status Transitions
  useEffect(() => {
    if (activeOrder && activeView === 'tracking') {
      const interval = setInterval(() => {
        setActiveOrder((prev) => {
          if (!prev) return null;
          if (prev.status === 'received') return { ...prev, status: 'knitting' };
          if (prev.status === 'knitting') return { ...prev, status: 'completed' };
          if (prev.status === 'completed') return { ...prev, status: 'shipping' };
          if (prev.status === 'shipping') return { ...prev, status: 'success' };
          return prev;
        });
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [activeOrder, activeView]);

  // Scroll Reveal logic using Intersection Observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.isVisible);
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll('.reveal-on-scroll');
    elements.forEach(el => observer.observe(el));

    const timeoutId = setTimeout(() => {
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          el.classList.add(styles.isVisible);
        }
      });
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [activeView]);

  return (
    <div className={styles.storefrontLayout}>
      {/* Background Weave Layer */}
      <div className={styles.ambientGrain}></div>
      <ShaderBackground />

      {/* TOP NAVIGATION BAR */}
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
              {cart.length > 0 && <span className={styles.cartBadge}>{cart.length}</span>}
            </button>

            <button className={`${styles.iconBtn} ${styles.hoverScaleIcon}`} aria-label="Tài khoản" onClick={() => setActiveView('tracking')}>
              <span className="material-symbols-outlined">person</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 💳 FLOATING CART DRAWER DROP PANEL */}
      {isCartOpen && (
        <CartFloatingModal
          styles={styles}
          cart={cart}
          cartTotal={cartTotal}
          removeFromCart={removeFromCart}
          setIsCartOpen={setIsCartOpen}
          setActiveView={setActiveView}
        />
      )}

      {/* MAIN LAYOUTS */}
      <main>

        {activeView === 'home' && (
          <HomeView
            styles={styles}
            setActiveView={setActiveView}
            setSelectedProduct={setSelectedProduct}
            PRODUCTS={PRODUCTS}
            handleAddToCartDefault={handleAddToCartDefault}
          />
        )}

        {/* ==================== 2. CATALOG VIEW ==================== */}
        {activeView === 'catalog' && (
          <CatalogView
            styles={styles}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedWoolTypes={selectedWoolTypes}
            toggleWoolType={toggleWoolType}
            selectedColors={selectedColors}
            toggleColorFilter={toggleColorFilter}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            filteredProducts={filteredProducts}
            setSelectedProduct={setSelectedProduct}
            setActiveView={setActiveView}
            handleAddToCartDefault={handleAddToCartDefault}
            onClearFilters={() => {
              setSearchQuery('');
              setSelectedWoolTypes([]);
              setSelectedColors([]);
              setMaxPrice(2000000);
            }}
          />
        )}

        {/* ==================== 3. DETAIL VIEW TAB ==================== */}
        {activeView === 'detail' && selectedProduct && (
          <DetailView
            styles={styles}
            selectedProduct={selectedProduct}
            detailMainImage={detailMainImage}
            setDetailMainImage={setDetailMainImage}
            customColor={customColor}
            setCustomColor={setCustomColor}
            chestWidth={chestWidth}
            setChestWidth={setChestWidth}
            sleeveLength={sleeveLength}
            setSleeveLength={setSleeveLength}
            height={height}
            setHeight={setHeight}
            customNotes={customNotes}
            setCustomNotes={setCustomNotes}
            handleAddToCartCustom={handleAddToCartCustom}
            setActiveView={setActiveView}
          />
        )}

        {/* ==================== 4. CART & CHECKOUT TAB ==================== */}
        {activeView === 'checkout' && (
          <CheckoutView
            styles={styles}
            cart={cart}
            cartTotal={cartTotal}
            removeFromCart={removeFromCart}
            shippingForm={shippingForm}
            setShippingForm={setShippingForm}
            stripeCard={stripeCard}
            setStripeCard={setStripeCard}
            checkoutLoading={checkoutLoading}
            handleCheckoutSubmit={handleCheckoutSubmit}
            setActiveView={setActiveView}
          />
        )}

        {/* ==================== 5. TIMELINE TRACKING VIEW ==================== */}
        {activeView === 'tracking' && (
          <TrackingView
            styles={styles}
            activeOrder={activeOrder}
            setActiveView={setActiveView}
          />
        )}

      </main>

      {/* FOOTER */}
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
    </div>
  );
}
