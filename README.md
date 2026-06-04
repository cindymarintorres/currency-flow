# 💱 CurrencyFlow

**Conversor de divisas en tiempo real construido con Angular 21 y PrimeNG.** Una aplicación SPA que consume la ExchangeRate-API para convertir monedas, registrar historial de conversiones, gestionar favoritos y practicar los patrones más demandados del ecosistema Angular moderno.

> Proyecto de portafolio orientado al aprendizaje de Angular 21: Signals, Reactive Forms, RxJS, Guards, Interceptors, Lazy Loading y más.

---

## ✨ Características principales

- 💹 **Conversión en tiempo real** con caché de 1 hora para optimizar las llamadas a la API.
- 🕓 **Historial de conversiones** persistido en `localStorage` con pipes personalizados.
- ⭐ **Favoritos** gestionados con estado global mediante Signals.
- 🔍 **Búsqueda de monedas** con `debounceTime` + `switchMap` para búsqueda reactiva.
- 🔐 **Autenticación mock** con Guards, Interceptor HTTP y `CanDeactivate`.
- 🌗 **Modo claro/oscuro** con ThemeService global y soporte nativo de PrimeNG.
- 📱 **UI responsiva** con componentes PrimeNG + Aura theme.

---

## 🛠️ Stack tecnológico

| Capa | Tecnología | Detalles |
|:---|:---|:---|
| **Framework** | 🅰️ Angular 21 | Standalone components, Signals API |
| **Lenguaje** | 📘 TypeScript | Modo estricto (`strict: true`) |
| **UI Library** | 🎨 PrimeNG v18+ | Tema Aura, Design Tokens, Dark Mode nativo |
| **Estilos** | 💅 SCSS | Variables CSS + theming por tokens |
| **Formularios** | 📋 Reactive Forms | `FormBuilder`, validators, `CanDeactivate` |
| **HTTP Client** | 🌐 Angular HttpClient | Interceptors, caché en memoria |
| **Estado** | ⚡ Signals | `signal()`, `computed()`, `effect()` |
| **Reactividad** | 🔄 RxJS | `switchMap`, `debounceTime`, `distinctUntilChanged` |
| **Persistencia** | 💾 localStorage | Historial y favoritos del usuario |
| **API externa** | 📡 ExchangeRate-API | Free tier — 1,500 req/mes, sin CORS |
| **Auth** | 🔑 Mock Service | Credenciales hardcodeadas — sin backend real |

---

## 🏗️ Arquitectura de módulos

```
src/app/
├── core/                              → Singleton services, interceptors, guards
│   ├── services/
│   │   ├── auth.service.ts            → mock login/logout, fake JWT
│   │   ├── theme.service.ts           → toggle claro/oscuro global
│   │   └── exchange-rate.service.ts   → HttpClient + caché en memoria (1h)
│   ├── interceptors/
│   │   └── auth.interceptor.ts        → adjunta fake token en cada request
│   └── guards/
│       └── auth.guard.ts              → protege rutas privadas (/history, /favorites)
│
├── shared/                            → Pipes y componentes reutilizables
│   ├── pipes/
│   │   ├── currency-format.pipe.ts    → formatea montos con símbolo y decimales
│   │   └── time-ago.pipe.ts           → "hace 5 minutos", "hace 2 horas"
│   └── components/
│       └── flag-icon.component.ts     → emoji de bandera por código ISO
│
├── features/                          → Lazy-loaded feature modules
│   ├── auth/
│   │   └── login/                     → Reactive Form + CanDeactivate guard
│   ├── converter/                     → Página principal de conversión
│   ├── history/                       → localStorage + @for + pipes
│   ├── favorites/                     → estado global con Signals
│   └── search/                        → debounceTime + switchMap
│
└── app.routes.ts                      → Router con lazy loading por feature
```

---

## 📐 Conceptos Angular por feature

| Feature | Conceptos practicados |
|:---|:---|
| **Converter** | `HttpClient`, `RxJS`, `Signals`, `computed()`, `Reactive Forms`, `input()` / `output()` |
| **History** | `localStorage`, `@for`, `@if`, Pipes custom, `effect()` |
| **Favorites** | Service como estado global, `signal()` en service, `inject()` |
| **Search** | `debounceTime`, `switchMap`, `distinctUntilChanged` |
| **Auth mock** | `CanActivate`, `CanDeactivate`, `Interceptor`, fake JWT |
| **Theme** | Service global, `effect()`, binding de clases con PrimeNG |

---

## 🔄 Flujo de datos principal

```
ExchangeRate-API  →  GET /v6/{KEY}/latest/{base}
        ↓
ExchangeRateService      ← cachea en memoria · refresca cada 1h
        ↓
ConverterComponent       ← Reactive Form → signal de resultado
        ↓
HistoryService           ← persiste en localStorage con effect()
        ↓
HistoryComponent         ← lista con pipes + filtros reactivos
```

---

## 📡 API externa

**[ExchangeRate-API](https://www.exchangerate-api.com/)** — Free tier

| Endpoint | Descripción |
|:---|:---|
| `GET /v6/{API_KEY}/latest/{base}` | Todas las tasas desde una moneda base |

- ✅ Sin problemas de CORS — llamada directa desde el browser
- ✅ Sin backend ni proxy necesario
- ✅ 1,500 requests/mes gratis (más que suficiente para desarrollo)

---

## ⚙️ Prerrequisitos

Asegúrate de tener instalados:

- 🟢 **Node.js** v20+ (recomendado LTS)
- 📦 **npm** v9+ o **pnpm**
- 🅰️ **Angular CLI** v21+

```bash
npm install -g @angular/cli@latest
```

> ⚠️ **No se necesita Docker.** CurrencyFlow no tiene backend real ni base de datos. Todo el estado vive en memoria y `localStorage`.

---

## 🚀 Instalación y puesta en marcha

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/cindymarintorres/currency-flow.git
cd currency-flow
```

### 2️⃣ Instalar dependencias

```bash
npm install
```

### 3️⃣ Configurar variables de entorno

Crea el archivo `src/environments/environment.ts` basándote en el ejemplo:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

Edita el archivo con tu API key:

```typescript
export const environment = {
  production: false,
  exchangeRateApiKey: 'TU_API_KEY_AQUI',       // ← de exchangerate-api.com (gratis)
  exchangeRateBaseUrl: 'https://v6.exchangerate-api.com',
  cacheTimeMs: 3600000,                          // 1 hora en milisegundos
  fakeAuthToken: 'fake-jwt-token-currencyflow'
};
```

> 🔑 Obtén tu API key gratuita en [exchangerate-api.com](https://www.exchangerate-api.com/) — tarda menos de 2 minutos.

### 4️⃣ Iniciar el servidor de desarrollo

```bash
ng serve
```

🚀 La aplicación estará disponible en: [http://localhost:4200](http://localhost:4200)

---

## 🔐 Credenciales de acceso (mock)

La autenticación es simulada. Usa estas credenciales en la pantalla de login:

| Campo | Valor |
|:---|:---|
| **Email** | `demo@currencyflow.com` |
| **Password** | `1234` |

---

## 📂 Estructura de carpetas detallada

```
currency-flow/
├── src/
│   ├── app/
│   │   ├── core/                    ← Servicios singleton (inyectados en root)
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── theme.service.ts
│   │   │   │   └── exchange-rate.service.ts
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts
│   │   │   └── guards/
│   │   │       └── auth.guard.ts
│   │   ├── shared/                  ← Pipes y componentes compartidos
│   │   │   ├── pipes/
│   │   │   │   ├── currency-format.pipe.ts
│   │   │   │   └── time-ago.pipe.ts
│   │   │   └── components/
│   │   │       └── flag-icon.component.ts
│   │   ├── features/                ← Feature modules con lazy loading
│   │   │   ├── auth/login/
│   │   │   ├── converter/
│   │   │   ├── history/
│   │   │   ├── favorites/
│   │   │   └── search/
│   │   ├── app.component.ts
│   │   ├── app.config.ts            ← providePrimeNG, provideRouter, provideHttpClient
│   │   └── app.routes.ts            ← Lazy loading de cada feature
│   ├── environments/
│   │   ├── environment.ts           ← Variables de dev (gitignored)
│   │   └── environment.example.ts   ← Plantilla pública
│   └── styles.scss                  ← Estilos globales + tokens PrimeNG
├── angular.json
├── tsconfig.json
└── package.json
```

---

## 🗺️ Rutas de la aplicación

| Ruta | Componente | Protegida |
|:---|:---|:---|
| `/` | Redirect → `/converter` | No |
| `/login` | `LoginComponent` | No |
| `/converter` | `ConverterComponent` | No |
| `/history` | `HistoryComponent` | ✅ Sí — requiere login |
| `/favorites` | `FavoritesComponent` | ✅ Sí — requiere login |
| `/search` | `SearchComponent` | No |

---

## 🛑 Comandos de referencia rápida

```bash
# Desarrollo
ng serve                          # Levanta el servidor en localhost:4200
ng serve --open                   # Lo mismo pero abre el browser automáticamente

# Generación de código
ng generate component features/converter/converter
ng generate service core/services/exchange-rate
ng generate pipe shared/pipes/currency-format
ng generate guard core/guards/auth

# Build
ng build                          # Build de producción
ng build --watch                  # Watch mode para desarrollo

# Testing
ng test                           # Unit tests con Karma
ng e2e                            # End-to-end tests

# Linting
ng lint                           # ESLint
```

---

## 📋 Estado del proyecto

Este proyecto está en desarrollo activo como parte de un portafolio de ingeniería de software enfocado en Angular 21. La arquitectura, decisiones de diseño y progreso están documentados en el historial de commits.