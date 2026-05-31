'use client';

import { create } from 'zustand';
import { Product, CartItem, Order, PRODUCTS } from '@tiem-nha-zit/shared';

const createId = (prefix: string): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? `${prefix}-${crypto.randomUUID()}`
    : `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;

export interface AppStoreState {
  // Navigation & Drawer
  isCartOpen: boolean;

  // Catalog filtering states
  searchQuery: string;
  selectedWoolTypes: string[];
  selectedColors: string[];
  maxPrice: number;

  // Product Selection & Customizer
  selectedProduct: Product;
  detailMainImage: string;
  customColor: string;
  chestWidth: string;
  sleeveLength: string;
  height: string;
  customNotes: string;

  // Cart list
  cart: CartItem[];

  // Checkout states
  shippingForm: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
  stripeCard: {
    number: string;
    expiry: string;
    cvc: string;
  };
  checkoutLoading: boolean;
  orderHistory: Order[];
  activeOrder: Order | null;
}

export interface AppStoreActions {
  // General UI setter
  setIsCartOpen: (open: boolean) => void;

  // Catalog Actions
  setSearchQuery: (query: string) => void;
  toggleWoolType: (type: string) => void;
  toggleColorFilter: (color: string) => void;
  setMaxPrice: (price: number) => void;
  clearFilters: () => void;

  // Customizer Sync
  setSelectedProduct: (prod: Product) => void;
  setDetailMainImage: (img: string) => void;
  setCustomColor: (color: string) => void;
  setChestWidth: (val: string) => void;
  setSleeveLength: (val: string) => void;
  setHeight: (val: string) => void;
  setCustomNotes: (notes: string) => void;

  // Cart operations
  addToCartDefault: (prod: Product, e?: React.MouseEvent) => void;
  addToCartCustom: (quantity?: number) => void;
  removeFromCart: (itemId: string) => void;

  // Shipping & Checkout
  setShippingForm: (form: Partial<AppStoreState['shippingForm']>) => void;
  setStripeCard: (card: Partial<AppStoreState['stripeCard']>) => void;
  setCheckoutLoading: (loading: boolean) => void;
  setActiveOrder: (order: Order | null) => void;
  setOrderHistory: (history: Order[] | ((prev: Order[]) => Order[])) => void;
  submitCheckout: (e: React.SyntheticEvent, routerPush: (path: string) => void) => void;
}

export type AppStore = AppStoreState & AppStoreActions;

export const useAppStore = create<AppStore>((set, get) => ({
  // --- INITIAL STATES ---
  isCartOpen: false,

  searchQuery: '',
  selectedWoolTypes: [],
  selectedColors: [],
  maxPrice: 2000000,

  selectedProduct: PRODUCTS[4],
  detailMainImage: PRODUCTS[4].imageUrl,
  customColor: 'Sage Green',
  chestWidth: '85',
  sleeveLength: '58',
  height: '165',
  customNotes: '',

  cart: [
    {
      id: 'cart-init-1',
      product: PRODUCTS[4],
      quantity: 1,
      customColor: 'Sage Green',
      chestWidth: '85',
      sleeveLength: '58',
      height: '165',
      customNotes: 'Mong muốn dáng áo hơi rộng một chút...'
    },
    {
      id: 'cart-init-2',
      product: PRODUCTS[0],
      quantity: 1,
      customColor: 'Cream',
      chestWidth: 'N/A',
      sleeveLength: 'N/A',
      height: 'N/A',
      customNotes: 'Đóng gói hộp quà tặng bé trai.'
    }
  ],

  shippingForm: {
    name: '',
    email: '',
    address: '',
    city: 'Hà Nội'
  },
  stripeCard: {
    number: '',
    expiry: '',
    cvc: ''
  },
  checkoutLoading: false,
  orderHistory: [],
  activeOrder: null,

  // --- ACTIONS ---

  setIsCartOpen: (open) => set({ isCartOpen: open }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  toggleWoolType: (type) => set((state) => ({
    selectedWoolTypes: state.selectedWoolTypes.includes(type)
      ? state.selectedWoolTypes.filter((t) => t !== type)
      : [...state.selectedWoolTypes, type]
  })),

  toggleColorFilter: (color) => set((state) => ({
    selectedColors: state.selectedColors.includes(color)
      ? state.selectedColors.filter((c) => c !== color)
      : [...state.selectedColors, color]
  })),

  setMaxPrice: (price) => set({ maxPrice: price }),

  clearFilters: () => set({
    searchQuery: '',
    selectedWoolTypes: [],
    selectedColors: [],
    maxPrice: 2000000
  }),

  setSelectedProduct: (prod) => {
    const isFashion = prod.category === 'Thời Trang' || prod.category === 'Mũ Len';
    set({
      selectedProduct: prod,
      detailMainImage: prod.imageUrl,
      customColor: 'Sage Green',
      chestWidth: isFashion ? '85' : 'N/A',
      sleeveLength: isFashion ? '58' : 'N/A',
      height: isFashion ? '165' : 'N/A',
      customNotes: ''
    });
  },

  setDetailMainImage: (img) => set({ detailMainImage: img }),
  setCustomColor: (color) => set({ customColor: color }),
  setChestWidth: (val) => set({ chestWidth: val }),
  setSleeveLength: (val) => set({ sleeveLength: val }),
  setHeight: (val) => set({ height: val }),
  setCustomNotes: (notes) => set({ customNotes: notes }),

  addToCartDefault: (prod, e) => {
    if (e) {
      e.stopPropagation();
    }
    const isFashion = prod.category === 'Thời Trang' || prod.category === 'Mũ Len';
    const newItem: CartItem = {
      id: createId('cart'),
      product: prod,
      quantity: 1,
      customColor: 'Sage Green',
      chestWidth: isFashion ? '85' : 'N/A',
      sleeveLength: isFashion ? '58' : 'N/A',
      height: isFashion ? '165' : 'N/A',
      customNotes: ''
    };
    set((state) => ({
      cart: [...state.cart, newItem],
      isCartOpen: true
    }));
  },

  addToCartCustom: (quantity = 1) => {
    const state = get();
    const newItem: CartItem = {
      id: createId('cart'),
      product: state.selectedProduct,
      quantity: quantity,
      customColor: state.customColor,
      chestWidth: state.chestWidth,
      sleeveLength: state.sleeveLength,
      height: state.height,
      customNotes: state.customNotes
    };
    set((state) => ({
      cart: [...state.cart, newItem],
      isCartOpen: true
    }));
  },

  removeFromCart: (itemId) => set((state) => ({
    cart: state.cart.filter((item) => item.id !== itemId)
  })),

  setShippingForm: (form) => set((state) => ({
    shippingForm: { ...state.shippingForm, ...form }
  })),

  setStripeCard: (card) => set((state) => ({
    stripeCard: { ...state.stripeCard, ...card }
  })),

  setCheckoutLoading: (loading) => set({ checkoutLoading: loading }),

  setActiveOrder: (order) => set({ activeOrder: order }),

  setOrderHistory: (history) => set((state) => ({
    orderHistory: typeof history === 'function' ? history(state.orderHistory) : history
  })),

  submitCheckout: (e, routerPush) => {
    e.preventDefault();
    const state = get();
    const { name, email, address } = state.shippingForm;
    if (!name || !email || !address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng.');
      return;
    }
    set({ checkoutLoading: true });

    setTimeout(() => {
      const cartTotal = state.cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
      const newOrder: Order = {
        orderId: `ZIT-${Math.floor(100000 + Math.random() * 900000)}`,
        items: [...state.cart],
        total: cartTotal,
        shipping: { ...state.shippingForm },
        status: 'received',
        date: new Date().toLocaleDateString('vi-VN')
      };
      set((prev) => ({
        orderHistory: [newOrder, ...prev.orderHistory],
        activeOrder: newOrder,
        cart: [],
        checkoutLoading: false
      }));
      routerPush('/tracking');
    }, 2000);
  }
}));
