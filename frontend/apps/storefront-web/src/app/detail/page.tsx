'use client';

import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import styles from '../../shared/styles/page.module.scss';
import DetailView from '../../views/detail/ui/DetailView';
import StorefrontShell from '../../widgets/layout/ui/StorefrontShell';
import { useAppStore } from '../../core/stores/app.store';
import { useViewNavigation } from '../../shared/lib/useViewNavigation';

export default function DetailRoute() {
  const navigate = useViewNavigation();

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
  } = useAppStore(
    useShallow((state) => ({
      selectedProduct: state.selectedProduct,
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
        setActiveView={navigate}
      />
    </StorefrontShell>
  );
}
