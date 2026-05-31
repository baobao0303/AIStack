'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShallow } from 'zustand/react/shallow';
import { ShaderBackground, Navbar, Footer, CartFloatingModal } from '../ui';
import { useAppStore } from '../store/app.store';
import { ViewType } from '@tiem-nha-zit/shared';
import { useScrollReveal, useClickOutside } from '../hooks';
import styles from '../ui/styles/page.module.scss';

interface StorefrontShellProps {
  children: React.ReactNode;
  activeView: ViewType;
}

export default function StorefrontShell({ children, activeView }: StorefrontShellProps) {
  const router = useRouter();

  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    searchQuery,
    setSearchQuery,
    removeFromCart,
    activeOrder,
  } = useAppStore(
    useShallow((state) => ({
      isCartOpen: state.isCartOpen,
      setIsCartOpen: state.setIsCartOpen,
      cart: state.cart,
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
      removeFromCart: state.removeFromCart,
      activeOrder: state.activeOrder,
    }))
  );

  const cartTotal = React.useMemo(
    () => cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
    [cart]
  );

  // Sync order tracking statuses in the background when active view is tracking
  useEffect(() => {
    if (activeOrder && activeView === 'tracking') {
      const interval = setInterval(() => {
        useAppStore.setState((prev) => {
          if (!prev.activeOrder) return {};
          const nextStatusMap: Record<string, 'knitting' | 'completed' | 'shipping' | 'success'> = {
            received: 'knitting',
            knitting: 'completed',
            completed: 'shipping',
            shipping: 'success',
          };
          const nextStatus = nextStatusMap[prev.activeOrder.status];
          if (nextStatus) {
            return {
              activeOrder: { ...prev.activeOrder, status: nextStatus }
            };
          }
          return {};
        });
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [activeOrder, activeView]);

  // Route transition helper mapping legacy tab state names to standard router paths
  const handleActiveViewChange = (view: ViewType) => {
    setIsCartOpen(false);
    if (view === 'home') {
      router.push('/');
    } else if (view === 'login') {
      router.push('/sign-in');
    } else if (view === 'catalog') {
      router.push('/product');
    } else if (view === 'detail') {
      const selectedProduct = useAppStore.getState().selectedProduct;
      router.push(`/product/${selectedProduct?.id || 'prod-5'}`);
    } else {
      router.push(`/${view}`);
    }
  };

  // Bind scroll reveal interactions and animations for storefront layout page changes
  useScrollReveal(styles.isVisible, [activeView]);

  // Handle clicking outside the cart drawer to dismiss
  useClickOutside(isCartOpen, ['cart-modal', 'cart-trigger'], () => setIsCartOpen(false));

  return (
    <div className={styles.storefrontLayout}>
      {/* Background Ambient Weave Layer */}
      <div className={styles.ambientGrain}></div>
      <ShaderBackground />

      {/* TOP NAVIGATION BAR */}
      <Navbar
        activeView={activeView}
        setActiveView={handleActiveViewChange}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cartCount={cart.length}
        searchQuery={searchQuery}
        setSearchQuery={(query) => {
          setSearchQuery(query);
          // Auto-redirect to catalog once search inputs contain typed text
          if (query.trim() !== '' && activeView !== 'catalog') {
            router.push('/product');
          }
        }}
        cart={cart}
        cartTotal={cartTotal}
        removeFromCart={removeFromCart}
      />

      {/* RENDER VIEW CHILDREN */}
      <main>
        {children}
      </main>

      {/* FOOTER */}
      <Footer setActiveView={handleActiveViewChange} />
    </div>
  );
}
