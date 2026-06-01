'use client';

import React from 'react';
import { CartItem } from '@tiem-nha-zit/shared';
import styles from '../styles/page.module.scss';

interface CheckoutViewProps {
  cart: CartItem[];
  cartTotal: number;
  removeFromCart: (itemId: string) => void;
  shippingForm: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
  setShippingForm: React.Dispatch<React.SetStateAction<{
    name: string;
    email: string;
    address: string;
    city: string;
  }>>;
  stripeCard: {
    number: string;
    expiry: string;
    cvc: string;
  };
  setStripeCard: React.Dispatch<React.SetStateAction<{
    number: string;
    expiry: string;
    cvc: string;
  }>>;
  checkoutLoading: boolean;
  handleCheckoutSubmit: (e: React.FormEvent) => void;
  setActiveView: (view: 'home' | 'catalog' | 'detail' | 'checkout' | 'tracking') => void;
}

export default function CheckoutView({
  cart,
  cartTotal,
  removeFromCart,
  shippingForm,
  setShippingForm,
  stripeCard,
  setStripeCard,
  checkoutLoading,
  handleCheckoutSubmit,
  setActiveView
}: CheckoutViewProps) {
  return (
    <div className={styles.containerMax + ' ' + styles.cartTab}>
      <div className={styles.cartGrid}>
        
        {/* Left Column: Cart items recap */}
        <div className={styles.cartItemsArea}>
          <h2>Giỏ Hàng Của Bạn ({cart.length} sản phẩm)</h2>
          {cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <p>Giỏ hàng đang trống. Quay lại Cửa hàng để thêm sản phẩm.</p>
              <button className={`${styles.btnCheckout} mt-4`} onClick={() => setActiveView('catalog')}>
                Đến Cửa Hàng
              </button>
            </div>
          ) : (
            <div className={styles.cartList}>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItemCard}>
                  <img 
                    src={item.product.imageUrl} 
                    alt={item.product.name} 
                    className={styles.cartItemImg} 
                  />
                  <div className={styles.cartItemDetails}>
                    <h3>{item.product.name}</h3>
                    <span className={styles.itemPrice}>{item.product.price.toLocaleString('vi-VN')}đ</span>
                    
                    {/* Specs Recapitulation */}
                    <div className={styles.itemSpecsSummary}>
                      <p><strong>Màu len:</strong> {item.customColor}</p>
                      {item.chestWidth !== 'N/A' && (
                        <p><strong>Kích thước:</strong> Ngực: {item.chestWidth}cm | Dài tay: {item.sleeveLength}cm | Chiều cao: {item.height}cm</p>
                      )}
                      {item.customNotes && <p><strong>Lưu ý:</strong> {item.customNotes}</p>}
                    </div>
                  </div>
                  <button 
                    className={`${styles.btnRemoveItem} absolute top-4 right-4`}
                    onClick={() => removeFromCart(item.id)}
                  >
                    Xóa
                  </button>
                </div>
              ))}

              <div className={styles.cartSubtotalBlock}>
                <div className={styles.subtotalRow}>
                  <span>Tạm tính</span>
                  <span>{cartTotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className={styles.subtotalRow}>
                  <span>Phí vận chuyển</span>
                  <span className="text-sage">Miễn phí</span>
                </div>
                <hr className="border-0 border-t border-[#cbc3d5]" />
                <div className={styles.totalRow}>
                  <span>Tổng tiền đơn hàng</span>
                  <span>{cartTotal.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Stripe billing & Shipping Form */}
        <div className={styles.checkoutFormArea}>
          <h2>Thông Tin Thanh Toán</h2>
          <p className={styles.stripeNote}>💳 Cổng bảo mật Stripe liên kết Tiệm Nhà Zịt</p>

          <form className={styles.checkoutForm} onSubmit={handleCheckoutSubmit}>
            <div className={styles.formGroup}>
              <label>Họ và tên người nhận</label>
              <input 
                type="text" 
                placeholder="Nguyễn Văn A" 
                required
                value={shippingForm.name}
                onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                className="!rounded-xl"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email liên hệ nhận hóa đơn</label>
              <input 
                type="email" 
                placeholder="nguyenvana@gmail.com" 
                required
                value={shippingForm.email}
                onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                className="!rounded-xl"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Địa chỉ nhận hàng</label>
              <input 
                type="text" 
                placeholder="Số 12, Ngõ 34, Phố Kim Mã" 
                required
                value={shippingForm.address}
                onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                className="!rounded-xl"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tỉnh / Thành phố</label>
              <select 
                value={shippingForm.city}
                onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                className="!rounded-xl"
              >
                <option>Hà Nội</option>
                <option>TP. Hồ Chí Minh</option>
                <option>Đà Nẵng</option>
                <option>Hải Phòng</option>
              </select>
            </div>

            {/* High-Fidelity Stripe Credit Card Input Mock */}
            <div className={`${styles.stripeCardBox} !rounded-2xl`}>
              <div className={styles.stripeHeader}>
                <span>Thông tin thẻ tín dụng</span>
                <span>Stripe secure</span>
              </div>
              <div className={styles.stripeInputRow}>
                <input 
                  type="text" 
                  placeholder="4242 4242 4242 4242 (Thẻ test Stripe)" 
                  required
                  value={stripeCard.number}
                  onChange={(e) => setStripeCard({ ...stripeCard, number: e.target.value })}
                  className="!rounded-xl"
                />
              </div>
              <div className={styles.stripeInputCol2}>
                <input 
                  type="text" 
                  placeholder="MM/YY" 
                  required
                  value={stripeCard.expiry}
                  onChange={(e) => setStripeCard({ ...stripeCard, expiry: e.target.value })}
                  className="!rounded-xl"
                />
                <input 
                  type="text" 
                  placeholder="CVC" 
                  required
                  value={stripeCard.cvc}
                  onChange={(e) => setStripeCard({ ...stripeCard, cvc: e.target.value })}
                  className="!rounded-xl"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`${styles.btnCheckoutSubmit} group flex items-center justify-between !py-2.5 !pl-7 !pr-2.5 rounded-full w-full`}
              disabled={cart.length === 0 || checkoutLoading}
            >
              {checkoutLoading ? (
                <span className="mx-auto">Đang xử lý giao dịch qua Stripe...</span>
              ) : (
                <>
                  <span>Thanh toán {cartTotal.toLocaleString('vi-VN')}đ</span>
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-white/25">
                    <span className="material-symbols-outlined text-[18px] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-white">arrow_outward</span>
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
