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

        // Simulate color matches (just for interactivity demonstration)
        const matchesColor =
          selectedColors.length === 0 ||
          (selectedColors.includes('Sage') && prod.id === 'prod-5') ||
          (selectedColors.includes('Cream') && prod.id === 'prod-1') ||
          (selectedColors.includes('Oatmeal') && prod.id === 'prod-2') ||
          (selectedColors.includes('Lavender') && prod.id === 'prod-4');

        const matchesPrice = prod.price <= maxPrice;

        return matchesSearch && matchesWool && matchesColor && matchesPrice;
      }),
    [searchQuery, selectedWoolTypes, selectedColors, maxPrice]
  );

  return (
    <StorefrontShell activeView="catalog">
      {/* Preload first catalog product image for instant above-the-fold display */}
      <link 
        rel="preload" 
        href={PRODUCTS[0].imageUrl} 
        as="image" 
        fetchPriority="high" 
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
