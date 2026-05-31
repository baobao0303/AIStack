// Application UI Route Paths Constants (SPEC_CORE_FE)

export const AppRoutes = {
  home: '/',
  catalog: '/product',
  productDetail: (id: string) => `/product/${id}`,
  checkout: '/checkout',
  tracking: (orderId: string) => `/tracking/${orderId}`,
  login: '/login',
} as const;
