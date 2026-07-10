# Brew & Crust — Storefront

A modern, Shopify-inspired e-commerce frontend for an artisan coffee & bakery brand. Frontend only — no backend, no auth, all data is mocked and cart state persists to `localStorage`.

## What's built (Phase 1 — Storefront)

- **Landing page** — hero, about, categories, best sellers, featured products, testimonials, newsletter
- **Shop** — search, category filter, price range filter, sort, loading skeletons, empty state
- **Product details** — image gallery, size/extras customization, quantity, notes, tabs (description/ingredients/nutrition/reviews), related products, favorites
- **Cart** — quantity updates, remove item, mock coupon codes (`BREW10`, `CRUST5`), tax/delivery/total breakdown, persisted to `localStorage`
- **Checkout** — 4-step flow (customer info → delivery → payment → review) built with `react-hook-form`, mock payment methods (Card / GCash / Maya / Cash), animated success screen
- Dark mode toggle, responsive layout, toast notifications, wishlist/favorites (persisted)

**Not yet built** (next phases, per the original spec): Customer Dashboard, Admin Dashboard, POS system. The folder structure and routing are set up to extend into these — just say the word and I'll pick up from here.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/    reusable UI (Navbar, Footer, ProductCard, Button, Badge, Rating, Toast, etc.)
  pages/         route-level pages (Landing, Shop, ProductDetails, Cart, Checkout, NotFound)
  layouts/       StorefrontLayout (navbar + footer wrapper)
  contexts/      CartContext, WishlistContext, ToastContext, ThemeContext
  hooks/         useLocalStorage
  data/          mock JSON (products, categories, reviews, extras)
```

## Notes on mock behavior

- **Cart & wishlist** persist across reloads via `localStorage`.
- **Coupons**: try `BREW10` (10% off) or `CRUST5` ($5 off) in the cart.
- **Free delivery** kicks in automatically once the discounted subtotal reaches $35.
- **Checkout** never calls a real API — placing an order clears the cart and shows a mock confirmation with a randomly generated order ID.
- Product photography is sourced from Unsplash for placeholder purposes; swap in your own brand photography before shipping.

## Design system

- **Colors**: espresso `#2B1B14`, parchment `#F2E9DC`, copper `#B5651D`, sage `#7C8B6F` — defined as CSS variables in `src/index.css`, including a dark-mode override.
- **Type**: Fraunces (display), Sora (body), IBM Plex Mono (prices/labels/utility).
- **Signature element**: a rotated "ink stamp" badge (`.stamp` class) used for best-seller/new callouts and the order-confirmed screen — a nod to loyalty punch cards.
