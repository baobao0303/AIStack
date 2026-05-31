'use client';

import React from 'react';
import styles from '../shared/styles/page.module.scss';
import HomeView from '../views/home/ui/HomeView';
import StorefrontShell from '../widgets/layout/ui/StorefrontShell';
import { useAppStore } from '../core/stores/app.store';
import { useViewNavigation } from '../shared/lib/useViewNavigation';
import { PRODUCTS } from '../entities/product/data/products';

export default function StorefrontIndex() {
  const navigate = useViewNavigation();
  const setSelectedProduct = useAppStore((state) => state.setSelectedProduct);
  const addToCartDefault = useAppStore((state) => state.addToCartDefault);

  return (
    <StorefrontShell activeView="home">
      <HomeView
        styles={styles}
        setActiveView={navigate}
        setSelectedProduct={setSelectedProduct}
        PRODUCTS={PRODUCTS}
        handleAddToCartDefault={addToCartDefault}
      />
    </StorefrontShell>
  );
}
