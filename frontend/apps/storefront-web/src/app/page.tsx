'use client';

import React, { useState, useEffect } from 'react';
import styles from '../shared/styles/page.module.scss';

// Import modular subcomponents
import ShaderBackground from '../shared/ui/ShaderBackground';
import HomeView from '../views/home/ui/HomeView';
import CatalogView from '../views/catalog/ui/CatalogView';
import DetailView from '../views/detail/ui/DetailView';
import CheckoutView from '../views/checkout/ui/CheckoutView';
import TrackingView from '../views/tracking/ui/TrackingView';
import CartFloatingModal from '../widgets/cart-modal/ui/CartFloatingModal';
import Footer from '../widgets/footer/ui/Footer';
import Navbar from '../widgets/navbar/ui/Navbar';

// Import shared types
import { Product, CartItem, Order } from '../shared/model/types';

// Product catalog data
import { PRODUCTS } from '../entities/product/data/products';


export default function StorefrontIndex() {
  const [activeView, setActiveView] = useState<'home' | 'catalog' | 'detail' | 'checkout' | 'tracking'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(PRODUCTS[4]);
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
  const handleAddToCartDefault = (prod: Product, e: React.MouseEvent) => {
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
      <Navbar
        styles={styles}
        activeView={activeView}
        setActiveView={setActiveView}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartCount={cart.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

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
      <Footer styles={styles} setActiveView={setActiveView} />
    </div>
  );
}
