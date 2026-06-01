'use client';

import React from 'react';
import { Product } from '@tiem-nha-zit/shared';
import { useScrollReveal, usePrefetchOnHover } from '../../hooks';
import styles from '../styles/page.module.scss';

interface CatalogViewProps {
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
  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 12;
  const { prefetchRoute } = usePrefetchOnHover();

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedWoolTypes, selectedColors, maxPrice]);

  useScrollReveal(styles.isVisible, [currentPage, filteredProducts]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex gap-8 max-md:flex-col max-w-[1600px] mx-auto px-4 py-10 w-full box-border">
      {/* Filter Sidebar */}
      <aside className="w-[280px] shrink-0 bg-white/85 backdrop-blur-md border border-sage/10 p-6 rounded-3xl h-fit flex flex-col gap-8 shadow-[0_20px_50px_rgba(74,101,79,0.04)] max-md:w-full box-border select-none">
        
        {/* SEARCH GROUP */}
        <div className="flex flex-col">
          <h3 className="text-[11px] font-bold text-sage uppercase tracking-[0.18em] block mb-4 border-b border-sage/10 pb-2 select-none">Tìm Kiếm</h3>
          <div className="relative flex items-center w-full">
            <input 
              type="text" 
              placeholder="Tên sản phẩm..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="peer w-full bg-ivory border border-customBorder/60 py-3 pl-4 pr-10 rounded-xl font-sans text-xs text-charcoal outline-none transition-all duration-300 focus:bg-white focus:border-sage focus:ring-4 focus:ring-sage/10 box-border shadow-sm"
            />
            <span className="material-symbols-outlined absolute right-3 text-[18px] text-charcoal/40 pointer-events-none transition-colors duration-300 peer-focus:text-sage">search</span>
          </div>
        </div>

        {/* WOOL MATERIAL GROUP */}
        <div className="flex flex-col">
          <h3 className="text-[11px] font-bold text-sage uppercase tracking-[0.18em] block mb-4 border-b border-sage/10 pb-2 select-none">Chất Liệu Len</h3>
          <div className="flex flex-col gap-3">
            {['Merino Wool', 'Alpaca Wool', 'Organic Cotton', 'Milk Cotton', 'Chenille Velvet'].map((type) => (
              <label key={type} className="group flex items-center gap-3 text-xs text-charcoal/70 cursor-pointer select-none font-medium transition-colors hover:text-sage">
                <input 
                  type="checkbox" 
                  checked={selectedWoolTypes.includes(type)}
                  onChange={() => toggleWoolType(type)}
                  className="hidden"
                />
                <span className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center transition-all duration-200 shrink-0 ${
                  selectedWoolTypes.includes(type) 
                    ? 'bg-sage border-sage scale-100 shadow-[0_2px_6px_rgba(74,101,79,0.25)]' 
                    : 'border-customBorder/80 bg-white group-hover:border-sage'
                }`}>
                  {selectedWoolTypes.includes(type) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                  )}
                </span>
                <span>{type === 'Chenille Velvet' ? 'Chenille Velvet (Nhung gấu)' : type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ORGANIC COLORS GROUP */}
        <div className="flex flex-col">
          <h3 className="text-[11px] font-bold text-sage uppercase tracking-[0.18em] block mb-4 border-b border-sage/10 pb-2 select-none">Màu Nhuộm Organic</h3>
          <div className="flex flex-wrap gap-2.5">
            {['Cream', 'Sage', 'Oatmeal', 'Lavender', 'Red', 'Pink', 'Blue', 'Black'].map((color) => {
              const colorBgClass = 
                color === 'Cream' ? 'bg-[#FAF9F6]' : 
                color === 'Sage' ? 'bg-[#8DAA91]' : 
                color === 'Oatmeal' ? 'bg-[#D9C5B2]' : 
                color === 'Lavender' ? 'bg-[#E1D2FF]' :
                color === 'Red' ? 'bg-[#E05A47]' :
                color === 'Pink' ? 'bg-[#ECBAC1]' :
                color === 'Blue' ? 'bg-[#84A9C0]' : 'bg-[#1A1C1A]';
              const isActive = selectedColors.includes(color);
              
              // Define nice titles/tooltips for the colors
              const vietnameseColorName = 
                color === 'Cream' ? 'Trắng kem / Cream' : 
                color === 'Sage' ? 'Xanh lá / Sage' : 
                color === 'Oatmeal' ? 'Be Oatmeal' : 
                color === 'Lavender' ? 'Tím Lavender' :
                color === 'Red' ? 'Đỏ / Red' :
                color === 'Pink' ? 'Hồng / Pink' :
                color === 'Blue' ? 'Xanh dương / Blue' : 'Đen / Black';

              return (
                <button 
                  key={color}
                  onClick={() => toggleColorFilter(color)}
                  className={`w-7 h-7 rounded-full transition-all duration-300 relative cursor-pointer outline-none ${colorBgClass} ${
                    isActive 
                      ? 'ring-2 ring-sage ring-offset-2 scale-110 shadow-md' 
                      : 'border border-customBorder/50 hover:scale-110 hover:shadow-sm'
                  }`}
                  title={vietnameseColorName}
                />
              );
            })}
          </div>
        </div>

        {/* PRICE FILTER GROUP */}
        <div className="flex flex-col">
          <h3 className="text-[11px] font-bold text-sage uppercase tracking-[0.18em] block mb-2 border-b border-sage/10 pb-2 select-none">
            Giá Tối Đa <span className="text-sage font-semibold text-xs tracking-wider">({maxPrice.toLocaleString('vi-VN')}đ)</span>
          </h3>
          <input 
            type="range" 
            min="20000" 
            max="2000000" 
            step="10000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #8DAA91 0%, #8DAA91 ${((maxPrice - 20000) / (2000000 - 20000)) * 100}%, rgba(141, 170, 145, 0.1) ${((maxPrice - 20000) / (2000000 - 20000)) * 100}%, rgba(141, 170, 145, 0.1) 100%)`
            }}
            className="w-full h-1 rounded-lg appearance-none cursor-pointer accent-sage focus:outline-none"
          />
        </div>

        {/* CLEAR FILTERS BUTTON */}
        <button 
          className="w-full bg-charcoal text-white hover:bg-sage border-none font-sans font-semibold text-xs py-3.5 rounded-full cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_4px_12px_rgba(26,28,26,0.08)] hover:shadow-[0_8px_20px_rgba(74,101,79,0.2)] hover:translate-y-[-1.5px] active:translate-y-0 active:scale-[0.98] box-border mt-2"
          onClick={onClearFilters}
        >
          Xóa Bộ Lọc
        </button>
      </aside>

      {/* Catalog Main Area */}
      <div className="flex-1 w-full box-border">
        <div className="mb-8 select-none">
          <h2 className="font-playfair text-3xl font-bold text-charcoal m-0">
            Bộ Sưu Tập <span className="text-sage italic">Thủ Công</span>
          </h2>
          <p className="text-[11px] font-bold text-gold uppercase tracking-[0.18em] mt-1.5 block">
            Khám phá {filteredProducts.length} sản phẩm len Merino & Alpaca tự nhiên
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center select-none w-full bg-white border border-customBorder/20 rounded-3xl">
            <span className="text-[48px] mb-4">🔍</span>
            <p className="text-sm text-charcoal/60 font-medium m-0">Không tìm thấy sản phẩm phù hợp bộ lọc.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8 w-full">
            <div className={styles.productsCatalogGrid}>
              {paginatedProducts.map((prod, index) => {
                const staggerClass = index % 3 === 0 ? styles.staggerDelay1 : index % 3 === 1 ? styles.staggerDelay2 : styles.staggerDelay3;
                return (
                  <div 
                    key={prod.id} 
                    className={`${styles.productCardShell} ${styles.revealOnScroll} reveal-on-scroll ${staggerClass}`} 
                    onClick={() => { setSelectedProduct(prod); setActiveView('detail'); }}
                    onMouseEnter={() => prefetchRoute(`/product/${prod.id}`)}
                  >
                    <div className={styles.productCardCore}>
                      <div className={styles.cardImageContainer}>
                        <img 
                          src={prod.imageUrl} 
                          alt={prod.name} 
                          className={styles.cardImageReal} 
                        />
                        <span className={styles.cardTag}>{prod.category}</span>
                      </div>
                      <div className={styles.cardInfo}>
                         <h3
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: '48px',
                            lineHeight: '24px',
                          }}
                         >
                           {prod.name}
                         </h3>
                        <p className={styles.cardMaterial}>{prod.woolType}</p>
                        {/* Product Description snippet */}
                        <p 
                          className="text-[11px] leading-relaxed text-charcoal/50 mt-2 mb-3.5 line-clamp-2 h-[34px] font-sans box-border select-none"
                          style={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: '34px',
                            lineHeight: '17px',
                          }}
                        >
                          {prod.description}
                        </p>
                        <div className={styles.cardBottom}>
                          <span className={styles.cardPrice}>{prod.price.toLocaleString('vi-VN')}đ</span>
                          <button 
                            className={styles.cardCartButton}
                            onClick={(e) => { e.stopPropagation(); handleAddToCartDefault(prod, e); }}
                            title="Thêm vào giỏ hàng"
                          >
                            <span className="material-symbols-outlined">add_shopping_cart</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 select-none font-sans">
                <button 
                  onClick={() => {
                    const nextPage = Math.max(currentPage - 1, 1);
                    setCurrentPage(nextPage);
                    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === 1}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                    currentPage === 1 
                      ? 'bg-customBorder/10 border-customBorder/25 text-charcoal/20 cursor-not-allowed' 
                      : 'bg-white border-customBorder/40 text-charcoal/70 hover:border-sage hover:text-sage hover:bg-sage/5 hover:-translate-y-0.5 cursor-pointer shadow-sm'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                {Array.from({ length: totalPages }, (_, idx) => {
                  const pageNum = idx + 1;
                  const isActive = currentPage === pageNum;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => {
                        setCurrentPage(pageNum);
                        if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-xs border transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'bg-sage border-sage text-white shadow-[0_4px_12px_rgba(74,101,79,0.25)] hover:bg-sage/90 scale-105'
                          : 'bg-white border-customBorder/40 text-charcoal/70 hover:border-sage hover:text-sage hover:bg-sage/5'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button 
                  onClick={() => {
                    const nextPage = Math.min(currentPage + 1, totalPages);
                    setCurrentPage(nextPage);
                    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={currentPage === totalPages}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                    currentPage === totalPages 
                      ? 'bg-customBorder/10 border-customBorder/25 text-charcoal/20 cursor-not-allowed' 
                      : 'bg-white border-customBorder/40 text-charcoal/70 hover:border-sage hover:text-sage hover:bg-sage/5 hover:-translate-y-0.5 cursor-pointer shadow-sm'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
