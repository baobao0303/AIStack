'use client';

import React from 'react';
import { CartItem } from '@tiem-nha-zit/shared';
import styles from '../styles/page.module.scss';

interface CartFloatingModalProps {
  cart: CartItem[];
  cartTotal: number;
  removeFromCart: (itemId: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setActiveView: (view: 'home' | 'catalog' | 'detail' | 'checkout' | 'tracking') => void;
}

export default function CartFloatingModal({
  cart,
  cartTotal,
  removeFromCart,
  setIsCartOpen,
  setActiveView
}: CartFloatingModalProps) {
  return (
    <div id="cart-modal" className={styles.cartFloatingModal} onClick={(e) => e.stopPropagation()}>
      <div className={styles.modalHeader}>
        <h3>Giỏ hàng</h3>
        <button className={styles.btnCloseModal} onClick={() => setIsCartOpen(false)}>
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className={styles.modalBody}>
        {cart.length === 0 ? (
          <div className={styles.emptyCart}>
            <span className={styles.emptyCartIcon}>🛍️</span>
            <p>Giỏ hàng đang trống.</p>
          </div>
        ) : (
          <div className={styles.cartItemList}>
            {cart.map((item) => (
              <div key={item.id} className={styles.modalItemCard}>
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name} 
                  className={styles.modalItemImg} 
                />
                <div className={styles.modalItemDetails}>
                  <h4>{item.product.name}</h4>
                  <p className="text-xs text-sage font-medium">Màu: {item.customColor}</p>
                  <p>{item.product.price.toLocaleString('vi-VN')}đ {item.quantity > 1 && `x${item.quantity}`}</p>
                  <button 
                    className={styles.btnRemoveItem} 
                    onClick={() => removeFromCart(item.id)}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className={styles.modalFooter}>
          <div className={styles.modalSubtotalRow}>
            <span>Tạm tính</span>
            <span className={styles.modalSubtotalPrice}>{cartTotal.toLocaleString('vi-VN')}đ</span>
          </div>
          <div className={styles.modalActions}>
            <button 
              className={styles.btnCheckout} 
              onClick={() => {
                setActiveView('checkout');
                setIsCartOpen(false);
              }}
            >
              Thanh toán
            </button>
            <button 
              className={styles.btnViewCart} 
              onClick={() => {
                setActiveView('checkout');
                setIsCartOpen(false);
              }}
            >
              Xem chi tiết giỏ hàng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
