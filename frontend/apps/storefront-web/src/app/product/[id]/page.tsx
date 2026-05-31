'use client';

import React, { useEffect, use } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { DetailView, StorefrontShell, useAppStore, useViewNavigation } from '@tiem-nha-zit/shared-react';
import { PRODUCTS } from '@tiem-nha-zit/shared';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailRoute({ params }: PageProps) {
  const { id } = use(params);
  const navigate = useViewNavigation();

  const product = PRODUCTS.find((p) => p.id === id);

  const {
    selectedProduct,
    setSelectedProduct,
    detailMainImage,
    setDetailMainImage,
    customColor,
    setCustomColor,
    chestWidth,
    setChestWidth,
    sleeveLength,
    setSleeveLength,
    height,
    setHeight,
    customNotes,
    setCustomNotes,
    addToCartCustom
  } = useAppStore(
    useShallow((state) => ({
      selectedProduct: state.selectedProduct,
      setSelectedProduct: state.setSelectedProduct,
      detailMainImage: state.detailMainImage,
      setDetailMainImage: state.setDetailMainImage,
      customColor: state.customColor,
      setCustomColor: state.setCustomColor,
      chestWidth: state.chestWidth,
      setChestWidth: state.setChestWidth,
      sleeveLength: state.sleeveLength,
      setSleeveLength: state.setSleeveLength,
      height: state.height,
      setHeight: state.setHeight,
      customNotes: state.customNotes,
      setCustomNotes: state.setCustomNotes,
      addToCartCustom: state.addToCartCustom,
    }))
  );

  // Sync route param ID to Zustand store
  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
    }
  }, [product, setSelectedProduct]);

  if (!product) {
    notFound();
  }

  return (
    <StorefrontShell activeView="detail">
      {/* Preload dynamic product detail image above-the-fold */}
      <link 
        rel="preload" 
        href={product.imageUrl} 
        as="image" 
        fetchPriority="high" 
      />
      <DetailView
        selectedProduct={selectedProduct || product}
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
        handleAddToCartCustom={addToCartCustom}
        setActiveView={navigate}
      />
    </StorefrontShell>
  );
}
