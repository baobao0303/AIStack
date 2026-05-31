'use client';

import React from 'react';
import { Order } from '@tiem-nha-zit/shared';
import styles from '../styles/page.module.scss';

interface TrackingViewProps {
  activeOrder: Order | null;
  setActiveView: (view: 'home' | 'catalog' | 'detail' | 'checkout' | 'tracking') => void;
}

export default function TrackingView({
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
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 mt-10">
            
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
                <hr className="border-0 border-t border-[#cbc3d5] my-2" />
                <p className="font-bold text-sage">Thông số đan tay tùy biến:</p>
                {activeOrder.items.map((item) => (
                  <div key={item.id} className="p-2 bg-white rounded-lg mb-2 border border-[#cbc3d5]">
                    <p className="font-semibold text-charcoal">{item.product.name}</p>
                    <p className="text-[11px] text-[#665978]">Màu dệt: {item.customColor}</p>
                    {item.chestWidth !== 'N/A' && (
                      <p className="text-[11px] text-[#665978]">Ngực: {item.chestWidth}cm | Dài tay: {item.sleeveLength}cm | Chiều cao: {item.height}cm</p>
                    )}
                    {item.customNotes && (
                      <p className="text-[11px] italic text-gold">Ghi chú: {item.customNotes}</p>
                    )}
                  </div>
                ))}
                <hr className="border-0 border-t border-[#cbc3d5] my-2" />
                <p className="text-base font-bold text-charcoal">Tổng tiền: {activeOrder.total.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>

          </div>
        ) : (
          <div className={`${styles.emptyCart} py-[60px]`}>
            <p>Lịch sử đơn hàng trống. Hãy đặt đan sản phẩm đầu tiên của bạn!</p>
            <button className={`${styles.btnCheckout} mt-4 max-w-[240px] mx-auto block`} onClick={() => setActiveView('catalog')}>
              Đến Cửa Hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
