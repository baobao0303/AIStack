// Application UI Route Paths Constants (SPEC_CORE_FE)

export const AppRoutes = {
  home: '/',
  catalog: '/catalog',
  productDetail: (id: string) => `/products/${id}`,
  checkout: '/checkout',
  tracking: (orderId: string) => `/tracking/${orderId}`,
  login: '/login',
} as const;
