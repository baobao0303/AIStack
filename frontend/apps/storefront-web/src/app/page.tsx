'use client';

import React from 'react';
import { HomeView, StorefrontShell, useAppStore, useViewNavigation } from '@tiem-nha-zit/shared-react';
import { PRODUCTS } from '@tiem-nha-zit/shared';
import styles from '@tiem-nha-zit/shared-react/src/lib/ui/styles/page.module.scss';

export default function StorefrontIndex() {
  const navigate = useViewNavigation();
  const setSelectedProduct = useAppStore((state) => state.setSelectedProduct);
  const addToCartDefault = useAppStore((state) => state.addToCartDefault);

  return (
    <StorefrontShell activeView="home">
      {/* Preload second and third hero slider images for instant smooth transitions */}
      <link 
        rel="preload" 
        href="/vietnam_strap.png" 
        as="image" 
      />
      <link 
        rel="preload" 
        href="/mini_plush_keychain.png" 
        as="image" 
      />
      <HomeView
        setActiveView={navigate}
        setSelectedProduct={setSelectedProduct}
        PRODUCTS={PRODUCTS}
        handleAddToCartDefault={addToCartDefault}
      />
    </StorefrontShell>
  );
}
