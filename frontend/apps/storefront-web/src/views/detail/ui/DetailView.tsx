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

interface DetailViewProps {
  styles: Record<string, string>;
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
  handleAddToCartCustom: () => void;
  setActiveView: (view: 'home' | 'catalog' | 'detail' | 'checkout' | 'tracking') => void;
}

export default function DetailView({
  styles,
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
  if (!selectedProduct) return null;

  return (
    <div className={styles.containerMax + ' ' + styles.detailTab}>
      {/* Breadcrumbs */}
      <nav className={styles.detailBreadcrumbs}>
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('home'); }}>Trang chủ</a>
        <span className="material-symbols-outlined">chevron_right</span>
        <a href="#" onClick={(e) => { e.preventDefault(); setActiveView('catalog'); }}>Sản phẩm</a>
        <span className="material-symbols-outlined">chevron_right</span>
        <span>{selectedProduct.name}</span>
      </nav>

      <div className={styles.detailGrid}>

        {/* Left Column: Image showcase */}
        <div className={styles.imageShowcase}>
          <div className={styles.mainImageArea}>
            <img
              src={detailMainImage}
              alt={selectedProduct.name}
              className={styles.detailRealImage}
            />
          </div>
          {/* Visual Gallery Thumbnails matching Stitch refined design */}
          <div className={styles.detailThumbnails}>
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
              className={`${styles.thumbImgButton} ${detailMainImage === 'https://lh3.googleusercontent.com/aida/ADBb0ug4LM5MAhgqzZywXjE-tUZ5ED4ODu2j-Olo_cnAp1vd9YSZ4xMMrzfIsJ_R80XQJ562LNcmft1Da9On7UlhHKgMgyBV6f0qnt5fP_tW_eiYHP0oHWrCwHVp40XOrUPKY0S1K1pJAsMw2V_bOGvNu_gFr-qQB4SnEobRey5MDnzZoagm1YBcWqWTiyRC9Y6dPY9qx0Q2tiBSRHLrDrVRL2GdCrJ6qQ5BSNZUTPtAwJmO1wHQ30ASNi1gU1w' ? styles.thumbActive : ''}`}
              onClick={() => setDetailMainImage('https://lh3.googleusercontent.com/aida/ADBb0ug4LM5MAhgqzZywXjE-tUZ5ED4ODu2j-Olo_cnAp1vd9YSZ4xMMrzfIsJ_R80XQJ562LNcmft1Da9On7UlhHKgMgyBV6f0qnt5fP_tW_eiYHP0oHWrCwHVp40XOrUPKY0S1K1pJAsMw2V_bOGvNu_gFr-qQB4SnEobRey5MDnzZoagm1YBcWqWTiyRC9Y6dPY9qx0Q2tiBSRHLrDrVRL2GdCrJ6qQ5BSNZUTPtAwJmO1wHQ30ASNi1gU1w')}
              title="Góc nghệ nhân"
            >
              <img src="https://lh3.googleusercontent.com/aida/ADBb0ug4LM5MAhgqzZywXjE-tUZ5ED4ODu2j-Olo_cnAp1vd9YSZ4xMMrzfIsJ_R80XQJ562LNcmft1Da9On7UlhHKgMgyBV6f0qnt5fP_tW_eiYHP0oHWrCwHVp40XOrUPKY0S1K1pJAsMw2V_bOGvNu_gFr-qQB4SnEobRey5MDnzZoagm1YBcWqWTiyRC9Y6dPY9qx0Q2tiBSRHLrDrVRL2GdCrJ6qQ5BSNZUTPtAwJmO1wHQ30ASNi1gU1w" alt="Góc nghệ nhân" />
            </button>
            <div className={styles.videoPlaceholder} onClick={() => alert('Đang tải video giới thiệu quy trình đan tay...')}>
              <span className="material-symbols-outlined">videocam</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customizer */}
        <div className={styles.productDetailsArea}>
          <span className={styles.detailCategory}>{selectedProduct.category}</span>
          <h2>{selectedProduct.name}</h2>
          <div className={styles.ratingRow}>
            <div className={styles.detailStars}>⭐⭐⭐⭐⭐</div>
            <span>(42 reviews) • 100% Đan tay</span>
          </div>
          <div className={styles.detailPrice}>{selectedProduct.price.toLocaleString('vi-VN')}đ</div>
          <p className={styles.detailDesc}>{selectedProduct.description}</p>
          <hr className={styles.detailDivider} />

          {/* Customizer Panel */}
          <div className={styles.customizerPanel}>
            <h3>Tùy Biến Đan Thủ Công</h3>

            <div className={styles.customFieldGroup}>
              <label>Màu sắc dệt</label>
              <div className={styles.colorPickGroup}>
                {['Sage Green', 'Cream', 'Soft Rose', 'Oatmeal'].map((color) => (
                  <button
                    key={color}
                    className={`${styles.colorChip} ${customColor === color ? styles.chipActive : ''}`}
                    onClick={() => setCustomColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {(selectedProduct.category === 'Thời Trang' || selectedProduct.category === 'Mũ Len') && (
              <>
                <div className={styles.customFieldGroup}>
                  <label>Vòng ngực mong muốn (cm)</label>
                  <input
                    type="number"
                    value={chestWidth}
                    onChange={(e) => setChestWidth(e.target.value)}
                    placeholder="85"
                  />
                </div>
                <div className={styles.customFieldGroup}>
                  <label>Chiều dài tay (cm)</label>
                  <input
                    type="number"
                    value={sleeveLength}
                    onChange={(e) => setSleeveLength(e.target.value)}
                    placeholder="58"
                  />
                </div>
                <div className={styles.customFieldGroup}>
                  <label>Chiều cao của bạn (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="165"
                  />
                </div>
              </>
            )}

            <div className={styles.customFieldGroup}>
              <label>Lời nhắn cho nghệ nhân</label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Ví dụ: Mong muốn dáng áo rộng hơn ở vạt, thêu thêm hoa..."
                rows={3}
              />
            </div>

            <button
              className={`${styles.btnPrimaryFull} ${styles.hoverScaleBtn}`}
              onClick={handleAddToCartCustom}
            >
              Xác Nhận & Đặt Đan Ngay
            </button>
            <button
              className={`${styles.btnViewCart} ${styles.hoverScaleBtn} mt-3`}
              onClick={() => alert('Đang kết nối tới Chat Hub SignalR... Hỗ trợ trực tuyến với nghệ nhân đã sẵn sàng.')}
            >
              Tư vấn số đo với nghệ nhân
            </button>
          </div>

          {/* Trust Badges matching Stitch design */}
          <div className={styles.trustBadges}>
            <div className={styles.badgeItem}>
              <span className="material-symbols-outlined">local_shipping</span>
              <span>Giao hàng tận nơi</span>
            </div>
            <div className={styles.badgeItem}>
              <span className="material-symbols-outlined">verified</span>
              <span>Bảo hành trọn đời</span>
            </div>
            <div className={styles.badgeItem}>
              <span className="material-symbols-outlined">eco</span>
              <span>Đóng gói sinh thái</span>
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
            Sợi len Merino được chúng tôi tuyển chọn kỹ lưỡng, mang đến sự mềm mại và ấm áp tuyệt đối. Mỗi sản phẩm tại Tiệm Nhà Zịt đều được đan thủ công bởi những nghệ nhân giàu kinh nghiệm, mất từ 15 đến 20 ngày để hoàn thiện một chiếc áo độc bản.
          </p>
          <div className={styles.artisanQuote}>
            <p>"Thời trang chậm là sự tôn trọng với tự nhiên và người thợ thủ công."</p>
          </div>
        </div>
      </section>
    </div>
  );
}
