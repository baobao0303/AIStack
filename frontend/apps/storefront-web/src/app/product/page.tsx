'use client';

import React from 'react';
import { useShallow } from 'zustand/react/shallow';
import { CatalogView, StorefrontShell, useAppStore, useViewNavigation } from '@tiem-nha-zit/shared-react';
import { PRODUCTS } from '@tiem-nha-zit/shared';

export default function CatalogRoute() {
  const navigate = useViewNavigation();

  const {
    searchQuery,
    setSearchQuery,
    selectedWoolTypes,
    toggleWoolType,
    selectedColors,
    toggleColorFilter,
    maxPrice,
    setMaxPrice,
    setSelectedProduct,
    addToCartDefault,
    clearFilters
  } = useAppStore(
    useShallow((state) => ({
      searchQuery: state.searchQuery,
      setSearchQuery: state.setSearchQuery,
      selectedWoolTypes: state.selectedWoolTypes,
      toggleWoolType: state.toggleWoolType,
      selectedColors: state.selectedColors,
      toggleColorFilter: state.toggleColorFilter,
      maxPrice: state.maxPrice,
      setMaxPrice: state.setMaxPrice,
      setSelectedProduct: state.setSelectedProduct,
      addToCartDefault: state.addToCartDefault,
      clearFilters: state.clearFilters,
    }))
  );

  // Filter products based on Sidebar search and selections
  const filteredProducts = React.useMemo(
    () =>
      PRODUCTS.filter((prod) => {
        const matchesSearch =
          prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prod.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesWool =
          selectedWoolTypes.length === 0 || selectedWoolTypes.includes(prod.woolType);

        // Real dynamic color matching mapping organic sidebar filters to specific product variants
        const matchesColor =
          selectedColors.length === 0 ||
          selectedColors.some((filterColor) => {
            const searchStr = (prod.name + ' ' + prod.description).toLowerCase();
            
            if (!prod.colors || prod.colors.length === 0) {
              if (filterColor === 'Sage') {
                return searchStr.includes('xanh lá') || searchStr.includes('sage') || searchStr.includes('cỏ') || searchStr.includes('clover') || searchStr.includes('mint');
              }
              if (filterColor === 'Cream') {
                return searchStr.includes('cream') || searchStr.includes('trắng') || searchStr.includes('kem') || searchStr.includes('ivory');
              }
              if (filterColor === 'Oatmeal') {
                return searchStr.includes('oatmeal') || searchStr.includes('be') || searchStr.includes('beige');
              }
              if (filterColor === 'Lavender') {
                return searchStr.includes('lavender') || searchStr.includes('tím') || searchStr.includes('nhện') || searchStr.includes('purple');
              }
              if (filterColor === 'Red') {
                return searchStr.includes('đỏ') || searchStr.includes('red') || searchStr.includes('lửa') || searchStr.includes('calcifer');
              }
              if (filterColor === 'Pink') {
                return searchStr.includes('hồng') || searchStr.includes('pink') || searchStr.includes('heo') || searchStr.includes('pig');
              }
              if (filterColor === 'Blue') {
                return searchStr.includes('xanh biển') || searchStr.includes('xanh dương') || searchStr.includes('blue') || searchStr.includes('doraemon');
              }
              if (filterColor === 'Black') {
                return searchStr.includes('đen') || searchStr.includes('black') || searchStr.includes('bồ hóng') || searchStr.includes('soot') || searchStr.includes('ma mắt mèo');
              }
              return false;
            }

            return prod.colors.some((col) => {
              const name = col.name.toLowerCase();
              if (filterColor === 'Sage') {
                return name.includes('xanh lá') || name.includes('sage') || name.includes('green') || name.includes('xanh pastel') || name.includes('mint') || name.includes('cỏ');
              }
              if (filterColor === 'Cream') {
                return name.includes('cream') || name.includes('trắng') || name.includes('kem') || name.includes('ivory');
              }
              if (filterColor === 'Oatmeal') {
                return name.includes('oatmeal') || name.includes('be') || name.includes('beige') || name.includes('gấu pooh') || name.includes('cáo nick') || name.includes('dorami');
              }
              if (filterColor === 'Lavender') {
                return name.includes('lavender') || name.includes('tím') || name.includes('purple') || name.includes('nhện') || name.includes('kuromi');
              }
              if (filterColor === 'Red') {
                return name.includes('đỏ') || name.includes('red') || name.includes('lửa đỏ') || name.includes('lửa');
              }
              if (filterColor === 'Pink') {
                return name.includes('hồng') || name.includes('pink') || name.includes('thỏ') || name.includes('cinnamoroll') || name.includes('hello kitty');
              }
              if (filterColor === 'Blue') {
                return name.includes('xanh biển') || name.includes('xanh dương') || name.includes('blue') || name.includes('lửa xanh') || name.includes('doraemon');
              }
              if (filterColor === 'Black') {
                return name.includes('đen') || name.includes('black') || name.includes('bồ hóng') || name.includes('ma mắt mèo');
              }
              return false;
            });
          });

        const matchesPrice = prod.price <= maxPrice;

        return matchesSearch && matchesWool && matchesColor && matchesPrice;
      }),
    [searchQuery, selectedWoolTypes, selectedColors, maxPrice]
  );

  return (
    <StorefrontShell activeView="catalog">
      {/* Preload top 4 catalog product images for instant above-the-fold grid loading */}
      <link 
        rel="preload" 
        href={PRODUCTS[0].imageUrl} 
        as="image" 
        fetchPriority="high" 
      />
      <link 
        rel="preload" 
        href={PRODUCTS[1].imageUrl} 
        as="image" 
      />
      <link 
        rel="preload" 
        href={PRODUCTS[2].imageUrl} 
        as="image" 
      />
      <link 
        rel="preload" 
        href={PRODUCTS[3].imageUrl} 
        as="image" 
      />
      <CatalogView
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
        setActiveView={navigate}
        handleAddToCartDefault={addToCartDefault}
        onClearFilters={clearFilters}
      />
    </StorefrontShell>
  );
}
