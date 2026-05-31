'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../shared/styles/page.module.scss';
import DetailView from '../../views/detail/ui/DetailView';
import StorefrontShell from '../../widgets/layout/ui/StorefrontShell';
import { useAppStore } from '../../core/stores/app.store';

export default function DetailRoute() {
  const router = useRouter();

  const {
    selectedProduct,
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
  } = useAppStore();

  return (
    <StorefrontShell activeView="detail">
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
        handleAddToCartCustom={addToCartCustom}
        setActiveView={(view) => {
          if (view === 'home') {
            router.push('/');
          } else {
            router.push(`/${view}`);
          }
        }}
      />
    </StorefrontShell>
  );
}
