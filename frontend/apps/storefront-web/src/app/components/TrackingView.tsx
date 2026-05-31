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

interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  customColor: string;
  chestWidth: string;
  sleeveLength: string;
  height: string;
  customNotes: string;
}

interface Order {
  orderId: string;
  items: CartItem[];
  total: number;
  shipping: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
  status: 'received' | 'knitting' | 'completed' | 'shipping' | 'success';
  date: string;
}

interface TrackingViewProps {
  styles: Record<string, string>;
  activeOrder: Order | null;
  setActiveView: (view: 'home' | 'catalog' | 'detail' | 'checkout' | 'tracking') => void;
}

export default function TrackingView({
  styles,
  activeOrder,
  setActiveView
}: TrackingViewProps) {
  return (
    <div className={styles.containerMax + ' ' + styles.trackingTab}>
      <div className={styles.trackingContainer}>
        <div className={styles.trackingHeading}>
          <h2>Theo Dõi Tiến Độ Đan Thủ Công</h2>
          {activeOrder ? (
            <p>Mã đơn hàng: <span className={styles.accentOrderNo}>{activeOrder.orderId}</span> • Ngày đặt: {activeOrder.date}</p>
          ) : (
            <p>Không có đơn hàng nào đang trong tiến trình đan.</p>
          )}
        </div>

        {activeOrder ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', marginTop: '40px' }}>
            
            {/* Left Column: Vertical timeline Progress Flow */}
            <div className={styles.timelineBlock}>
              <div className={`${styles.timelineStep} ${activeOrder.status === 'received' ? styles.active : styles.completed}`}>
                <div className={styles.stepDot}>1</div>
                <div className={styles.stepInfo}>
                  <h3>Đã tiếp nhận đơn hàng</h3>
                  <p>Hệ thống đã nhận thông tin và chuyển tiếp yêu cầu đến nhóm nghệ nhân dệt len.</p>
                  <span className={styles.stepTime}>Bước 1</span>
                </div>
              </div>

              <div className={`${styles.timelineStep} ${activeOrder.status === 'knitting' ? styles.active : (activeOrder.status === 'received' ? '' : styles.completed)}`}>
                <div className={styles.stepDot}>2</div>
                <div className={styles.stepInfo}>
                  <h3>Nghệ nhân đang thực hiện đan tay</h3>
                  <p>Sản phẩm của bạn đang được đan tay thủ công tỉ mỉ bằng sợi len hữu cơ Merino / Alpaca.</p>
                  <span className={styles.stepTime}>Bước 2</span>
                </div>
              </div>

              <div className={`${styles.timelineStep} ${activeOrder.status === 'completed' ? styles.active : (['received', 'knitting'].includes(activeOrder.status) ? '' : styles.completed)}`}>
                <div className={styles.stepDot}>3</div>
                <div className={styles.stepInfo}>
                  <h3>Hoàn thành & Kiểm thử chất lượng</h3>
                  <p>Nghệ nhân đã đan xong. Sản phẩm đang được giặt nhẹ bằng sáp chanh kháng khuẩn và đóng gói sinh thái.</p>
                  <span className={styles.stepTime}>Bước 3</span>
                </div>
              </div>

              <div className={`${styles.timelineStep} ${activeOrder.status === 'shipping' ? styles.active : (['received', 'knitting', 'completed'].includes(activeOrder.status) ? '' : styles.completed)}`}>
                <div className={styles.stepDot}>4</div>
                <div className={styles.stepInfo}>
                  <h3>Đang giao hàng</h3>
                  <p>Đơn hàng đan tay độc bản đã được bàn giao cho đối tác vận chuyển để chuyển tới địa chỉ của bạn.</p>
                  <span className={styles.stepTime}>Bước 4</span>
                </div>
              </div>

              <div className={`${styles.timelineStep} ${activeOrder.status === 'success' ? styles.active : ''}`}>
                <div className={styles.stepDot}>5</div>
                <div className={styles.stepInfo}>
                  <h3>Giao hàng thành công</h3>
                  <p>Đơn hàng đã được phát thành công. Tiệm chúc bạn có những trải nghiệm ấm áp nhất!</p>
                  <span className={styles.stepTime}>Hoàn thành</span>
                </div>
              </div>
            </div>

            {/* Right Column: Custom recap card */}
            <div className={styles.orderRecapCard}>
              <h3>Tóm Tắt Thiết Kế Nghệ Nhân</h3>
              <div className={styles.recapDetails}>
                <p><strong>Người nhận:</strong> {activeOrder.shipping.name}</p>
                <p><strong>Địa chỉ giao:</strong> {activeOrder.shipping.address}, {activeOrder.shipping.city}</p>
                <hr style={{ border: 0, borderTop: '1px solid #cbc3d5', margin: '8px 0' }} />
                <p style={{ fontWeight: 700, color: '#4a654f' }}>Thông số đan tay tùy biến:</p>
                {activeOrder.items.map((item) => (
                  <div key={item.id} style={{ padding: '8px', backgroundColor: '#ffffff', borderRadius: '8px', marginBottom: '8px', border: '1px solid #cbc3d5' }}>
                    <p style={{ fontWeight: 600 }}>{item.product.name}</p>
                    <p style={{ fontSize: '11px', color: '#665978' }}>Màu dệt: {item.customColor}</p>
                    {item.chestWidth !== 'N/A' && (
                      <p style={{ fontSize: '11px', color: '#665978' }}>Ngực: {item.chestWidth}cm | Dài tay: {item.sleeveLength}cm | Chiều cao: {item.height}cm</p>
                    )}
                    {item.customNotes && (
                      <p style={{ fontSize: '11px', fontStyle: 'italic', color: '#c5a059' }}>Ghi chú: {item.customNotes}</p>
                    )}
                  </div>
                ))}
                <hr style={{ border: 0, borderTop: '1px solid #cbc3d5', margin: '8px 0' }} />
                <p style={{ fontSize: '16px', fontWeight: 700 }}>Tổng tiền: {activeOrder.total.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>

          </div>
        ) : (
          <div className={styles.emptyCart} style={{ padding: '60px 0' }}>
            <p>Lịch sử đơn hàng trống. Hãy đặt đan sản phẩm đầu tiên của bạn!</p>
            <button className={styles.btnCheckout} style={{ marginTop: '16px', maxWidth: '240px', marginLeft: 'auto', marginRight: 'auto' }} onClick={() => setActiveView('catalog')}>
              Đến Cửa Hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
