'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, PRODUCTS } from '@tiem-nha-zit/shared';
import { useAppStore } from '../../store/app.store';
import styles from '../styles/page.module.scss';

interface DetailViewProps {
  selectedProduct: Product | null;
  detailMainImage: string;
  setDetailMainImage: (image: string) => void;
  customColor: string;
  setCustomColor: (color: string) => void;
  chestWidth: string;
  setChestWidth: (width: string) => void;
  sleeveLength: string;
  setSleeveLength: (length: string) => void;
  height: string;
  setHeight: (height: string) => void;
  customNotes: string;
  setCustomNotes: (notes: string) => void;
  handleAddToCartCustom: (quantity?: number) => void;
  setActiveView: (view: 'home' | 'catalog' | 'detail' | 'checkout' | 'tracking') => void;
}

export default function DetailView({
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
  handleAddToCartCustom,
  setActiveView
}: DetailViewProps) {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    if (selectedProduct?.types && selectedProduct.types.length > 0) {
      setSelectedType(selectedProduct.types[0]);
    } else {
      setSelectedType('');
    }
  }, [selectedProduct]);
  const setSelectedProduct = useAppStore((state) => state.setSelectedProduct);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([
    {
      name: 'Lê Thị Mai',
      rating: 5,
      date: '2 ngày trước',
      comment: 'Áo được đan cực kỳ mềm, tay đan rất đều và đẹp. Tôi đã cung cấp số đo và áo vừa vặn như in. Cảm ơn nghệ nhân của Tiệm!'
    },
    {
      name: 'Nguyễn Hoàng Nam',
      rating: 5,
      date: '1 tuần trước',
      comment: 'Gói quà rất đẹp và thân thiện với môi trường, mở ra có mùi sáp chanh rất dễ chịu. Sản phẩm Merino rất êm không hề ngứa. Đáng tiền!'
    },
    {
      name: 'Phạm Quỳnh Anh',
      rating: 4,
      date: '2 tuần trước',
      comment: 'Rất hài lòng với chất lượng len hữu cơ này. Màu Sage Green bên ngoài rất nhã nhặn. Thời gian chờ đan hơi lâu một chút nhưng hoàn toàn xứng đáng với công sức thợ thủ công.'
    }
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState(5);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;
    const newReview = {
      name: newCommentName,
      rating: newCommentRating,
      date: 'Vừa xong',
      comment: newCommentText
    };
    setReviews([newReview, ...reviews]);
    setNewCommentName('');
    setNewCommentText('');
    setNewCommentRating(5);
  };

  if (!selectedProduct) return null;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-12 w-full box-border flex flex-col gap-16 font-sans">
      <div className="flex flex-col gap-4">
        {/* Breadcrumbs */}
        <nav className={`${styles.detailBreadcrumbs} !mb-0`}>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('home'); }}>Trang chủ</a>
          <span className="material-symbols-outlined">chevron_right</span>
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('catalog'); }}>Sản phẩm</a>
          <span className="material-symbols-outlined">chevron_right</span>
          <span>{selectedProduct.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-start">

        {/* Left Column: Image showcase */}
        <div className={styles.imageShowcase}>
          <div className="aspect-[4/3] w-full bg-white/70 backdrop-blur-md border border-sage/10 rounded-3xl overflow-hidden flex items-center justify-center shadow-sm relative group">
            <img
              src={detailMainImage}
              alt={selectedProduct.name}
              className={styles.detailRealImage}
            />
          </div>
          {/* Visual Gallery Thumbnails matching dynamic image structures */}
          <div className={styles.detailThumbnails}>
            {selectedProduct.images && selectedProduct.images.length > 0 ? (
              selectedProduct.images.map((imgUrl, index) => (
                <button 
                  key={index}
                  className={`${styles.thumbImgButton} ${detailMainImage === imgUrl ? styles.thumbActive : ''}`}
                  onClick={() => setDetailMainImage(imgUrl)}
                  title={`Góc chụp ${index + 1}`}
                >
                  <img src={imgUrl} alt={`Góc chụp ${index + 1}`} />
                </button>
              ))
            ) : (
              <>
                <button 
                  className={`${styles.thumbImgButton} ${detailMainImage === selectedProduct.imageUrl ? styles.thumbActive : ''}`}
                  onClick={() => setDetailMainImage(selectedProduct.imageUrl)}
                  title="Góc chính"
                >
                  <img src={selectedProduct.imageUrl} alt="Góc chụp chính" />
                </button>
                <button 
                  className={`${styles.thumbImgButton} ${detailMainImage === 'https://lh3.googleusercontent.com/aida/ADBb0ugGS8xiSKzBXsjv8f1Ndlh_xEwfvoLw4w-Jkz6jpej5o8qs2KX3QclLsivoMQ3mSg2UHI4Exh8_IkKypIdzDstLCP8Expv5nV73exEJ86YzUJcMijfIvK69Z0l5zGnK0GNACMt6puf5FtAxLz3NounFNAIglefpQIoyMa6W9u-XZzDM1q9fAAwZm_lHxUVAv3liK_uJ9vk6B3F1A7APZvVfLYmqMpmMGoDW2zXj0oVelqv11MLtXPcUQTwI' ? styles.thumbActive : ''}`}
                  onClick={() => setDetailMainImage('https://lh3.googleusercontent.com/aida/ADBb0ugGS8xiSKzBXsjv8f1Ndlh_xEwfvoLw4w-Jkz6jpej5o8qs2KX3QclLsivoMQ3mSg2UHI4Exh8_IkKypIdzDstLCP8Expv5nV73exEJ86YzUJcMijfIvK69Z0l5zGnK0GNACMt6puf5FtAxLz3NounFNAIglefpQIoyMa6W9u-XZzDM1q9fAAwZm_lHxUVAv3liK_uJ9vk6B3F1A7APZvVfLYmqMpmMGoDW2zXj0oVelqv11MLtXPcUQTwI')}
                  title="Cận cảnh sợi len"
                >
                  <img src="https://lh3.googleusercontent.com/aida/ADBb0ugGS8xiSKzBXsjv8f1Ndlh_xEwfvoLw4w-Jkz6jpej5o8qs2KX3QclLsivoMQ3mSg2UHI4Exh8_IkKypIdzDstLCP8Expv5nV73exEJ86YzUJcMijfIvK69Z0l5zGnK0GNACMt6puf5FtAxLz3NounFNAIglefpQIoyMa6W9u-XZzDM1q9fAAwZm_lHxUVAv3liK_uJ9vk6B3F1A7APZvVfLYmqMpmMGoDW2zXj0oVelqv11MLtXPcUQTwI" alt="Cận cảnh sợi len" />
                </button>
                <button 
                  className={`${styles.thumbImgButton} ${detailMainImage === 'https://lh3.googleusercontent.com/aida-public/AB6AXuAS-VgCNe0c0ipLm_ydBUdPVufGIU1fYPO0CzURgYC_iQ0Np1JriASAlJzZ6eU7VM3uf3yrhDZw5aLmtMJ6T9huT1WhbFbkn5rtDLNZkI5jMHKzT4jh6Ng51VY9ba74nDfewTAfTL2r4gXDFTthe0-H6YZqYThGEIHsHJTD--BSlolpLNBJhv9XOyE_ZpGczyyeOl3QnfQNycoKtEZAeQDeikPxFrXGUjKDeuE7T0Gu1nUmuJYoAsM0cKsf-JUGabrqlGoohSy4BlB8' ? styles.thumbActive : ''}`}
                  onClick={() => setDetailMainImage('https://lh3.googleusercontent.com/aida-public/AB6AXuAS-VgCNe0c0ipLm_ydBUdPVufGIU1fYPO0CzURgYC_iQ0Np1JriASAlJzZ6eU7VM3uf3yrhDZw5aLmtMJ6T9huT1WhbFbkn5rtDLNZkI5jMHKzT4jh6Ng51VY9ba74nDfewTAfTL2r4gXDFTthe0-H6YZqYThGEIHsHJTD--BSlolpLNBJhv9XOyE_ZpGczyyeOl3QnfQNycoKtEZAeQDeikPxFrXGUjKDeuE7T0Gu1nUmuJYoAsM0cKsf-JUGabrqlGoohSy4BlB8')}
                  title="Góc nghệ nhân"
                >
                  <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS-VgCNe0c0ipLm_ydBUdPVufGIU1fYPO0CzURgYC_iQ0Np1JriASAlJzZ6eU7VM3uf3yrhDZw5aLmtMJ6T9huT1WhbFbkn5rtDLNZkI5jMHKzT4jh6Ng51VY9ba74nDfewTAfTL2r4gXDFTthe0-H6YZqYThGEIHsHJTD--BSlolpLNBJhv9XOyE_ZpGczyyeOl3QnfQNycoKtEZAeQDeikPxFrXGUjKDeuE7T0Gu1nUmuJYoAsM0cKsf-JUGabrqlGoohSy4BlB8" alt="Góc nghệ nhân" />
                </button>
              </>
            )}
            <div className={styles.videoPlaceholder} onClick={() => alert('Đang tải video giới thiệu quy trình đan tay...')}>
              <span className="material-symbols-outlined">videocam</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customizer */}
        <div className={styles.productDetailsArea}>
          <span className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] mb-2 block">{selectedProduct.category}</span>
          <div className="flex justify-between items-start gap-4">
            <h2 className="font-playfair text-4xl font-extrabold text-charcoal leading-tight my-0">{selectedProduct.name}</h2>
            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`w-11 h-11 rounded-full border border-sage/15 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 shrink-0 ${
                isFavorite ? 'text-red-500 border-red-200' : 'text-charcoal/40 hover:text-red-500 hover:border-red-200'
              }`}
              title={isFavorite ? "Đã lưu vào yêu thích" : "Lưu vào yêu thích"}
            >
              <span 
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3 mb-5 select-none text-xs text-charcoal/60">
            <div className="text-gold text-sm flex gap-0.5">⭐⭐⭐⭐⭐</div>
            <span>(42 reviews) • 100% Đan tay</span>
          </div>

          {/* Price, Wool Material and Description Block */}
          <div className="flex flex-col gap-4 mt-6 mb-8 select-none">
            <div className="flex items-baseline gap-4">
              <span className="font-sans font-bold text-4xl text-charcoal tracking-tight">
                {selectedProduct.price.toLocaleString('vi-VN')}đ
              </span>
              <span className="bg-sage/10 text-sage text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border border-sage/15">
                {selectedProduct.woolType}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-charcoal/70 font-medium font-sans max-w-[540px]">
              {selectedProduct.description}
            </p>
          </div>

          {/* Customizer Panel */}
          <div className="bg-white/95 backdrop-blur-md border border-sage/10 p-8 rounded-3xl shadow-[0_20px_45px_rgba(74,101,79,0.03)] flex flex-col gap-6 w-full box-border font-sans mb-8">
            <div className="flex items-center gap-3 border-b border-sage/15 pb-4 mb-2 select-none">
              <span className="material-symbols-outlined text-sage text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_fix</span>
              <h3 className="text-[11px] font-bold text-sage uppercase tracking-[0.18em] m-0">Yêu Cầu Tùy Biến</h3>
            </div>

            {/* Color swatches */}
            <div className="flex flex-col gap-3">
              <label className="text-[10px] font-bold text-[#6b5c4c] uppercase tracking-wider block select-none">
                {(() => {
                  switch (selectedProduct.id) {
                    case 'prod-9':
                      return 'PHÂN LOẠI SẢN PHẨM';
                    case 'prod-15':
                      return 'NHÂN VẬT CHỌN LỰA';
                    case 'prod-18':
                      return 'CHỌN THÚ MINI CUTE';
                    case 'prod-19':
                      return 'CHỌN ĐẾ HOA MÀU';
                    default:
                      return selectedProduct.colors && selectedProduct.colors.length > 0 ? 'MÀU SẮC CHỌN LỰA' : 'MÀU SẮC TỰ NHIÊN';
                  }
                })()}
              </label>
              <div className="flex flex-wrap gap-3.5 select-none">
                {(selectedProduct.colors && selectedProduct.colors.length > 0
                  ? selectedProduct.colors
                  : [
                      { name: 'Sage Green', hex: '#8DAA91' },
                      { name: 'Cream', hex: '#FAF9F6' },
                      { name: 'Soft Rose', hex: '#ECBAC1' },
                      { name: 'Oatmeal', hex: '#D7C3B0' },
                    ]
                ).map((color) => {
                  const isActive = customColor === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      title={color.name}
                      onClick={() => {
                        setCustomColor(color.name);
                        if (color.imageUrl) {
                          setDetailMainImage(color.imageUrl);
                        }
                      }}
                      className={`w-[38px] h-[38px] rounded-full transition-all duration-300 relative cursor-pointer outline-none ${
                        isActive 
                          ? 'ring-2 ring-sage ring-offset-2 scale-110 shadow-md' 
                          : 'ring-1 ring-customBorder/70 hover:ring-2 hover:ring-sage'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  );
                })}
              </div>
              <div className="text-[10px] font-semibold text-charcoal/60 uppercase tracking-wider select-none mt-1">
                Phân loại: <span className="text-sage font-bold font-sans">{customColor}</span>
              </div>
            </div>

            {/* Dynamic Product Types selector if available */}
            {selectedProduct.types && selectedProduct.types.length > 0 && (
              <div className="flex flex-col gap-2 select-none mb-1">
                <label className="text-[10px] font-bold text-gold uppercase tracking-wider block">PHÂN LOẠI LOẠI</label>
                <div className="flex gap-2.5">
                  {selectedProduct.types.map((type) => {
                    const isSelected = selectedType === type;
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedType(type)}
                        className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold transition-all duration-300 cursor-pointer border box-border ${
                          isSelected
                            ? 'bg-sage text-white border-sage shadow-md'
                            : 'bg-white border-customBorder/60 text-charcoal/70 hover:border-sage hover:text-sage hover:bg-sage/5'
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Size Presets */}
            {(selectedProduct.category === 'Thời Trang' || selectedProduct.category === 'Mũ Len') && (
              <div className="flex flex-col gap-2 select-none mb-1">
                <label className="text-[10px] font-bold text-gold uppercase tracking-wider block">CHỌN SIZE ĐAN NHANH</label>
                <div className="flex gap-2.5">
                  {[
                    { label: 'Size S (Nhỏ)', chest: '85', sleeve: '56', h: '160' },
                    { label: 'Size M (Vừa)', chest: '90', sleeve: '58', h: '165' },
                    { label: 'Size L (Lớn)', chest: '95', sleeve: '60', h: '170' },
                  ].map((preset) => {
                    const isSelected = chestWidth === preset.chest && sleeveLength === preset.sleeve && height === preset.h;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => {
                          setChestWidth(preset.chest);
                          setSleeveLength(preset.sleeve);
                          setHeight(preset.h);
                        }}
                        className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all duration-300 cursor-pointer border box-border ${
                          isSelected
                            ? 'bg-sage text-white border-sage shadow-md'
                            : 'bg-white border-customBorder/60 text-charcoal/70 hover:border-sage hover:text-sage hover:bg-sage/5'
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Measurements inputs */}
            {(selectedProduct.category === 'Thời Trang' || selectedProduct.category === 'Mũ Len') && (
              <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[#6b5c4c] uppercase tracking-wider block select-none">VÒNG NGỰC (cm)</label>
                  <input
                    type="number"
                    value={chestWidth}
                    onChange={(e) => setChestWidth(e.target.value)}
                    placeholder="85"
                    className="w-full bg-transparent border-0 border-b border-customBorder/60 py-2 px-0 text-sm text-charcoal outline-none focus:ring-0 focus:border-sage transition-all duration-300 font-medium font-sans box-border"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-[#6b5c4c] uppercase tracking-wider block select-none">DÀI TAY (cm)</label>
                  <input
                    type="number"
                    value={sleeveLength}
                    onChange={(e) => setSleeveLength(e.target.value)}
                    placeholder="58"
                    className="w-full bg-transparent border-0 border-b border-customBorder/60 py-2 px-0 text-sm text-charcoal outline-none focus:ring-0 focus:border-sage transition-all duration-300 font-medium font-sans box-border"
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-2 max-sm:col-span-1">
                  <label className="text-[10px] font-bold text-[#6b5c4c] uppercase tracking-wider block select-none">CHIỀU CAO (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="165"
                    className="w-full bg-transparent border-0 border-b border-customBorder/60 py-2 px-0 text-sm text-charcoal outline-none focus:ring-0 focus:border-sage transition-all duration-300 font-medium font-sans box-border"
                  />
                </div>
              </div>
            )}

            {/* Notes textarea */}
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-[#6b5c4c] uppercase tracking-wider block select-none">GHI CHÚ CHO NGHỆ NHÂN</label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Ví dụ: Mong muốn dáng áo hơi rộng một chút..."
                rows={2}
                className="w-full bg-transparent border-0 border-b border-customBorder/60 py-2 px-0 text-sm text-charcoal outline-none focus:ring-0 focus:border-sage transition-all duration-300 font-medium font-sans box-border resize-none"
              />
            </div>

            {/* Quantity Selector */}
            <div className="flex flex-col gap-2 mb-2 select-none">
              <label className="text-[10px] font-bold text-[#6b5c4c] uppercase tracking-wider block">SỐ LƯỢNG</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-customBorder/50 rounded-xl bg-ivory/50 p-1 w-fit">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white hover:bg-sage/10 text-charcoal hover:text-sage transition-colors cursor-pointer border-none shadow-sm font-bold text-base"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center bg-transparent border-none outline-none font-bold text-sm text-charcoal [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-white hover:bg-sage/10 text-charcoal hover:text-sage transition-colors cursor-pointer border-none shadow-sm font-bold text-base"
                  >
                    +
                  </button>
                </div>
                <span className="text-[10px] text-charcoal/50 font-bold uppercase tracking-wider">Đầu đan thủ công sẵn sàng</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 mt-2">
              <button
                type="button"
                className="w-full bg-sage text-white hover:bg-sage/90 py-4 rounded-xl font-sans font-bold text-sm cursor-pointer transition-all duration-300 shadow-[0_4px_12px_rgba(74,101,79,0.15)] hover:shadow-[0_8px_20px_rgba(74,101,79,0.3)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] border-none flex items-center justify-center gap-2.5 box-border"
                onClick={() => {
                  if (selectedType) {
                    const prefix = `Loại: ${selectedType}`;
                    const currentNotes = customNotes.trim();
                    const nextNotes = currentNotes.startsWith('Loại:')
                      ? `${prefix}${currentNotes.indexOf('\n') !== -1 ? currentNotes.indexOf('\n') : ''}`
                      : currentNotes
                        ? `${prefix}\n${currentNotes}`
                        : prefix;
                    setCustomNotes(nextNotes);
                  }
                  handleAddToCartCustom(quantity);
                }}
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_bag</span>
                Xác Nhận & Đặt Đan Ngay
              </button>
              <button
                type="button"
                className="w-full bg-white border border-customBorder/60 text-charcoal/80 hover:bg-ivory py-4 rounded-xl font-sans font-bold text-sm cursor-pointer transition-all duration-300 shadow-sm hover:border-sage hover:text-sage hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2.5 box-border"
                onClick={() => alert('Đang kết nối tới Chat Hub SignalR... Hỗ trợ trực tuyến với nghệ nhân đã sẵn sàng.')}
              >
                <span className="material-symbols-outlined text-[20px]">chat_bubble</span>
                Tư vấn trực tiếp với nghệ nhân
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-customBorder/25 mt-2">
              <div className="flex flex-col items-center text-center gap-1.5 select-none font-sans">
                <span className="material-symbols-outlined text-sage text-[26px]">local_shipping</span>
                <span className="text-[9px] font-bold leading-tight text-charcoal/50 uppercase tracking-wider">Giao hàng tận nơi</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 select-none font-sans">
                <span className="material-symbols-outlined text-sage text-[26px]">verified</span>
                <span className="text-[9px] font-bold leading-tight text-charcoal/50 uppercase tracking-wider">Bảo hành trọn đời</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1.5 select-none font-sans">
                <span className="material-symbols-outlined text-sage text-[26px]">eco</span>
                <span className="text-[9px] font-bold leading-tight text-charcoal/50 uppercase tracking-wider">Đóng gói sinh thái</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Artisan Story Section matching Stitch design */}
      <section className={`${styles.detailArtisanStory} ${styles.revealOnScroll} reveal-on-scroll`}>
        <div className={styles.artisanVisual}>
          <div className={styles.artisanImgContainer}>
            <img
              alt="Artisan hands weaving wool"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_E8wjfDDaNUI6BOC0e8N_rRaUuVm3KQU-icXB4BhMdIUAKTNEyEsxxAUXzqQgwHHuqf52ZzH8cko8WjzoGp-HQ2EzqyeRqifWxHevOb9By6dkI66GV2YZ6ZI6ZlGAxq1hGkSzJOkB5S_tKnWh6Z2jP64liERAtEB0FlGqf35V8Q5I3LSZaqiNTxPRA2V6IrUmUXXBs15hjEv2flJssbFZNY5oK-V-YmZo5K3okc6Qwn4Od70VKz6rkcd3IqG-KawzX-qgdYWjjORt"
            />
          </div>
        </div>
        <div className={styles.artisanContent}>
          <div>
            <h3>Our Craftsmanship</h3>
            <h2>Mỗi mũi đan là một lời tâm tình</h2>
          </div>
          <p>
            Sợi {selectedProduct.woolType} được chúng tôi tuyển chọn kỹ lưỡng, mang đến sự mềm mại và ấm áp tuyệt đối. {selectedProduct.description} Mỗi tác phẩm tại Tiệm Nhà Zịt đều được đan thủ công bởi những nghệ nhân giàu kinh nghiệm với sự tỉ mỉ trong từng mũi chỉ để tạo nên một sản phẩm độc bản dành riêng cho bạn.
          </p>
          <div className={styles.artisanQuote}>
            <p>"Thời trang chậm là sự tôn trọng với tự nhiên và người thợ thủ công."</p>
          </div>
        </div>
      </section>

      {/* 🌟 REVIEWS & COMMENTS SECTION */}
      <section className="mt-20 border-t border-customBorder/30 pt-16 max-w-[950px] mx-auto font-sans w-full box-border">
        <h3 className="font-playfair text-3xl font-bold text-charcoal mb-10 text-center select-none">
          Đánh Giá & Bình Luận <span className="text-sage italic">Khách Hàng</span>
        </h3>
        
        {/* Rating Overview */}
        <div className="grid grid-cols-[1fr_1.8fr] gap-10 items-center bg-white/70 backdrop-blur-md border border-sage/10 p-8 rounded-3xl mb-10 shadow-[0_20px_50px_rgba(74,101,79,0.03)] max-sm:grid-cols-1 select-none">
          <div className="text-center border-r border-customBorder/30 max-sm:border-r-0 max-sm:border-b max-sm:pb-6 flex flex-col items-center justify-center">
            <span className="text-[10px] font-bold text-gold uppercase tracking-[0.15em] mb-1 block">Điểm đánh giá</span>
            <h4 className="text-[56px] font-bold text-sage m-0 leading-none mb-2">4.9</h4>
            <div className="text-gold text-xl mb-2 flex gap-0.5">⭐⭐⭐⭐⭐</div>
            <p className="text-[11px] text-charcoal/50 font-medium m-0">Dựa trên {reviews.length} đánh giá thực tế</p>
          </div>
          
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center gap-3.5 text-xs font-semibold">
              <span className="w-12 text-right text-charcoal/70">5 sao</span>
              <div className="flex-1 h-2 bg-customBorder/35 rounded-full overflow-hidden">
                <div className="h-full bg-sage w-[95%] rounded-full"></div>
              </div>
              <span className="w-8 text-right text-charcoal/50">95%</span>
            </div>
            <div className="flex items-center gap-3.5 text-xs font-semibold">
              <span className="w-12 text-right text-charcoal/70">4 sao</span>
              <div className="flex-1 h-2 bg-customBorder/35 rounded-full overflow-hidden">
                <div className="h-full bg-sage w-[5%] rounded-full"></div>
              </div>
              <span className="w-8 text-right text-charcoal/50">5%</span>
            </div>
            {['3 sao', '2 sao', '1 sao'].map((star) => (
              <div key={star} className="flex items-center gap-3.5 text-xs font-semibold">
                <span className="w-12 text-right text-charcoal/70">{star}</span>
                <div className="flex-1 h-2 bg-customBorder/35 rounded-full overflow-hidden">
                  <div className="h-full bg-sage w-0 rounded-full"></div>
                </div>
                <span className="w-8 text-right text-charcoal/50">0%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form and List Container */}
        <div className="flex flex-col gap-10">
          
          {/* Comment input form */}
          <form onSubmit={handleReviewSubmit} className="bg-white/80 backdrop-blur-md border border-sage/10 p-8 rounded-3xl shadow-[0_15px_40px_rgba(74,101,79,0.02)] flex flex-col gap-6 box-border w-full">
            <div className="flex flex-col select-none">
              <span className="text-[10px] font-bold text-gold uppercase tracking-[0.18em] mb-1">Hãy chia sẻ cảm nhận</span>
              <h4 className="font-playfair text-xl font-bold text-charcoal m-0">Viết nhận xét của bạn</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
              <div>
                <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider block mb-2 select-none font-sans">HỌ VÀ TÊN</label>
                <input 
                  type="text" 
                  required
                  placeholder="Nguyễn Văn A" 
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  className="w-full bg-ivory/60 border border-customBorder/60 p-3.5 rounded-xl text-xs font-sans text-charcoal outline-none focus:bg-white focus:border-sage focus:ring-4 focus:ring-sage/10 transition-all duration-300 box-border shadow-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider block mb-2 select-none font-sans">ĐÁNH GIÁ CỦA BẠN</label>
                <div className="flex items-center gap-1.5 h-[46px] select-none">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewCommentRating(star)}
                      className="text-2xl outline-none border-none bg-transparent cursor-pointer transition-all duration-200 hover:scale-125 focus:outline-none p-0"
                    >
                      <span 
                        className="material-symbols-outlined text-[26px]"
                        style={{
                          color: star <= newCommentRating ? '#D4AF37' : '#cfd1cf',
                          fontVariationSettings: star <= newCommentRating ? "'FILL' 1" : "'FILL' 0"
                        }}
                      >
                        star
                      </span>
                    </button>
                  ))}
                  <span className="text-[11px] text-charcoal/50 ml-2 font-medium">
                    {newCommentRating === 5 && '(Rất hài lòng)'}
                    {newCommentRating === 4 && '(Hài lòng)'}
                    {newCommentRating === 3 && '(Bình thường)'}
                    {newCommentRating === 2 && '(Tệ)'}
                    {newCommentRating === 1 && '(Rất tệ)'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-charcoal/50 uppercase tracking-wider block mb-2 select-none font-sans">NỘI DUNG NHẬN XÉT</label>
              <textarea 
                required
                rows={4}
                placeholder="Nhận xét chi tiết của bạn về chất lượng len, form dáng áo, dịch vụ..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="w-full bg-ivory/60 border border-customBorder/60 p-3.5 rounded-xl text-xs font-sans text-charcoal outline-none focus:bg-white focus:border-sage focus:ring-4 focus:ring-sage/10 transition-all duration-300 box-border shadow-sm"
              />
            </div>

            <button 
              type="submit" 
              className="bg-charcoal text-white font-sans font-semibold text-xs py-3.5 px-8 rounded-xl cursor-pointer transition-all duration-300 hover:bg-sage border-none shadow-[0_4px_12px_rgba(26,28,26,0.08)] hover:shadow-[0_8px_20px_rgba(74,101,79,0.2)] hover:translate-y-[-1px] active:translate-y-0 align-self-start mt-2"
            >
              Gửi Nhận Xét
            </button>
          </form>

          {/* List of comments */}
          <div className="flex flex-col gap-6">
            {reviews.map((rev, idx) => {
              // Extract initials for avatar
              const initials = rev.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
              
              return (
                <div 
                  key={idx} 
                  className="bg-white/50 backdrop-blur-sm border border-customBorder/25 p-6 rounded-2xl flex gap-4 transition-all duration-300 hover:translate-x-1.5 shadow-sm"
                >
                  {/* Avatar Circular Initial Badge */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sage/10 to-sage/20 border border-sage/10 flex items-center justify-center font-bold text-xs text-sage shadow-inner shrink-0 font-sans select-none">
                    {initials}
                  </div>
                  
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start mb-2 max-sm:flex-col max-sm:gap-1.5 select-none">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-charcoal">{rev.name}</span>
                          <span className="text-[9px] font-bold text-sage bg-sage/5 border border-sage/10 px-2 py-0.5 rounded-full scale-95 origin-left">
                            Đã mua hàng
                          </span>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span 
                              key={i} 
                              className="material-symbols-outlined text-[15px]"
                              style={{
                                color: i < rev.rating ? '#D4AF37' : '#cfd1cf',
                                fontVariationSettings: i < rev.rating ? "'FILL' 1" : "'FILL' 0"
                              }}
                            >
                              star
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-charcoal/40 font-medium">{rev.date}</span>
                    </div>
                    <p className="text-xs leading-relaxed text-charcoal/70 m-0 font-sans">{rev.comment}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🧥 OTHER PRODUCTS SECTION (SẢN PHẨM KHÁC) */}
      <section className="mt-24 pt-16 border-t border-customBorder/30 font-sans w-full box-border">
        <div className="text-center mb-12 select-none">
          <span className="text-[11px] font-bold text-gold uppercase tracking-[0.2em] mb-2.5 block">
            Có thể bạn cũng thích
          </span>
          <h3 className="font-playfair text-3.5xl font-bold text-charcoal m-0">
            Sản Phẩm Khác Tại Tiệm
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-6 max-xl:grid-cols-2 max-sm:grid-cols-1 w-full box-border">
          {PRODUCTS.filter((p) => p.id !== selectedProduct.id).slice(0, 4).map((prod) => (
            <div 
              key={prod.id} 
              className={`${styles.productCard} cursor-pointer flex flex-col h-full`}
              onClick={() => {
                setSelectedProduct(prod);
                setDetailMainImage(prod.imageUrl);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveView('detail');
              }}
              onMouseEnter={() => router.prefetch(`/product/${prod.id}`)}
            >
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
                  <span className="material-symbols-outlined text-[18px] text-sage hover:translate-x-0.5 transition-transform duration-200">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
