export const environment = {
  production: false,
  exchangeRateApiKey: 'YOUR_API_KEY_HERE',
  exchangeRateBaseUrl: 'https://v6.exchangerate-api.com',
  exchangeRateApiUrl: 'https://v6.exchangerate-api.com/v6', // ← URL completa con versión
  cacheTimeMs: 3600000,
  mockToken: 'fake-jwt-token-currencyflow', // generar en jwt.io con el payload documentado
  mockCredentials: {
    email: 'demo@currencyflow.com',
    password: '123456'
  }
};