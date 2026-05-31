// API Routes and Endpoint Constants (SPEC_CORE_FE)

export const ApiEndpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    refreshToken: '/auth/refresh',
    me: '/auth/me',
  },
  products: {
    list: '/products',
    detail: (id: string) => `/products/${id}`,
  },
  orders: {
    create: '/orders',
    list: '/orders',
    detail: (id: string) => `/orders/${id}`,
    tracking: (id: string) => `/orders/${id}/tracking`,
  },
} as const;
