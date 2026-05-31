// General App Config Constants (SPEC_CORE_FE)

export const AppConfigs = {
  appName: 'Tiệm Nhà Zịt',
  environment: process.env.NODE_ENV || 'development',
  localStorageKeys: {
    token: 'access_token',
    refreshToken: 'refresh_token',
    theme: 'theme_mode',
    cart: 'shopping_cart_data',
  },
  logging: {
    levels: {
      info: 'INFO',
      warn: 'WARN',
      error: 'ERROR',
      debug: 'DEBUG',
    },
  },
} as const;
