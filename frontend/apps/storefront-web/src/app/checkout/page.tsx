'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../shared/styles/page.module.scss';
import CheckoutView from '../../views/checkout/ui/CheckoutView';
import StorefrontShell from '../../widgets/layout/ui/StorefrontShell';
import { useAppStore } from '../../core/stores/app.store';

export default function CheckoutRoute() {
  const router = useRouter();

  const {
    cart,
    shippingForm,
    stripeCard,
    checkoutLoading,
    setShippingForm,
    setStripeCard,
    removeFromCart,
    submitCheckout
  } = useAppStore();

  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  // Conform perfectly to CheckoutView's React.Dispatch signatures
  const handleShippingFormChange = (
    action: React.SetStateAction<{
      name: string;
      email: string;
      address: string;
      city: string;
    }>
  ) => {
    const nextVal = typeof action === 'function' ? action(shippingForm) : action;
    setShippingForm(nextVal);
  };

  const handleStripeCardChange = (
    action: React.SetStateAction<{
      number: string;
      expiry: string;
      cvc: string;
    }>
  ) => {
    const nextVal = typeof action === 'function' ? action(stripeCard) : action;
    setStripeCard(nextVal);
  };

  return (
    <StorefrontShell activeView="checkout">
      <CheckoutView
        styles={styles}
        cart={cart}
        cartTotal={cartTotal}
        removeFromCart={removeFromCart}
        shippingForm={shippingForm}
        setShippingForm={handleShippingFormChange}
        stripeCard={stripeCard}
        setStripeCard={handleStripeCardChange}
        checkoutLoading={checkoutLoading}
        handleCheckoutSubmit={(e) => submitCheckout(e, router.push)}
        setActiveView={(view) => {
          if (view === 'home') {
            router.push('/');
          } else {
            router.push(`/${view}`);
          }
        }}
      />
    </StorefrontShell>
  );
}
