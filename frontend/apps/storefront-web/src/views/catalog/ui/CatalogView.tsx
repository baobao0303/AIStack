'use client';

import React from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  woolType: string;
  description: string;
}

interface CatalogViewProps {
  styles: Record<string, string>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedWoolTypes: string[];
  toggleWoolType: (type: string) => void;
  selectedColors: string[];
  toggleColorFilter: (color: string) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  filteredProducts: Product[];
  setSelectedProduct: (prod: Product) => void;
  setActiveView: (view: 'home' | 'catalog' | 'detail' | 'checkout' | 'tracking') => void;
  handleAddToCartDefault: (prod: Product, e: React.MouseEvent) => void;
  onClearFilters: () => void;
}

export default function CatalogView({
  styles,
  searchQuery,
  setSearchQuery,
  selectedWoolTypes,
  toggleWoolType,
  selectedColors,
  toggleColorFilter,
  maxPrice,
  setMaxPrice,
  filteredProducts,
  setSelectedProduct,
  setActiveView,
  handleAddToCartDefault,
  onClearFilters
}: CatalogViewProps) {
  return (
    <div className={styles.containerMax + ' ' + styles.listingContainer}>
      {/* Filter Sidebar */}
      <aside className={styles.filterSidebar}>
        <div className={styles.filterGroup}>
          <h3>Tìm Kiếm</h3>
          <div className={styles.searchBox}>
            <input 
              type="text" 
              placeholder="Tên sản phẩm..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="material-symbols-outlined">search</span>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <h3>Chất Liệu Len</h3>
          <div className={styles.radioGroup}>
            {['Merino Wool', 'Alpaca Wool', 'Organic Cotton'].map((type) => (
              <label key={type} className={selectedWoolTypes.includes(type) ? styles.activeRadio : ''}>
                <input 
                  type="checkbox" 
                  checked={selectedWoolTypes.includes(type)}
                  onChange={() => toggleWoolType(type)}
                  className="hidden"
                />
                <span className={styles.radioDot}></span>
                {type}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <h3>Màu Nhuộm Organic</h3>
          <div className={styles.organicColorsGrid}>
            {['Cream', 'Sage', 'Oatmeal', 'Lavender'].map((color) => {
              const colorBgClass = color === 'Cream' ? 'bg-[#F5F5DC]' : color === 'Sage' ? 'bg-[#8DAA91]' : color === 'Oatmeal' ? 'bg-[#D9C5B2]' : 'bg-[#E1D2FF]';
              const isActive = selectedColors.includes(color);
              return (
                <button 
                  key={color}
                  className={`${styles.colorCircle} ${colorBgClass} transition-transform duration-200 ${
                    isActive ? 'border-[#1a1c1a] border-[3px] scale-11' : 'border-customBorder border'
                  }`}
                  onClick={() => toggleColorFilter(color)}
                  title={color}
                />
              );
            })}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <h3>Giá Tối Đa ({maxPrice.toLocaleString('vi-VN')}đ)</h3>
          <input 
            type="range" 
            min="300000" 
            max="2000000" 
            step="50000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full accent-sage"
          />
        </div>

        <button 
          className={styles.btnPrimaryFull}
          onClick={onClearFilters}
        >
          Xóa Bộ Lọc
        </button>
      </aside>

      {/* Catalog Main Area */}
      <div className={styles.catalogArea}>
        <div className={styles.catalogHeader}>
          <h2>Bộ Sưu Tập Thủ Công</h2>
          <p>Khám phá {filteredProducts.length} sản phẩm len Merino & Alpaca tự nhiên</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className={`${styles.emptyCart} py-[80px]`}>
            <span className="text-[48px]">🔍</span>
            <p className="mt-4">Không tìm thấy sản phẩm phù hợp bộ lọc.</p>
          </div>
        ) : (
          <div className={styles.productsCatalogGrid}>
            {filteredProducts.map((prod) => (
              <div key={prod.id} className={styles.productCard} onClick={() => { setSelectedProduct(prod); setActiveView('detail'); }}>
                <div className={styles.cardImageContainer}>
                  <img 
                    src={prod.imageUrl} 
                    alt={prod.name} 
                    className={styles.cardImageReal} 
                  />
                  <span className={styles.cardTag}>{prod.category}</span>
                </div>
                <div className={styles.cardInfo}>
                  <h3>{prod.name}</h3>
                  <p className={styles.cardMaterial}>{prod.woolType}</p>
                  <div className={styles.cardBottom}>
                    <span className={styles.cardPrice}>{prod.price.toLocaleString('vi-VN')}đ</span>
                    <button 
                      className={styles.cardCartButton}
                      onClick={(e) => handleAddToCartDefault(prod, e)}
                      title="Thêm vào giỏ hàng"
                    >
                      <span className="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
