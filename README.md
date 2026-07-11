# Brew & Crust — Storefront

A modern, Shopify-inspired e-commerce frontend for an artisan coffee & bakery brand. Frontend only — no backend, no auth, all data is mocked and cart state persists to `localStorage`.

## What's built

### Phase 1 — Storefront
- **Landing page** — hero, about, categories, best sellers, featured products, testimonials, newsletter
- **Shop** — search, category filter, price range filter, sort, loading skeletons, empty state
- **Product details** — image gallery, size/extras customization, quantity, notes, tabs (description/ingredients/nutrition/reviews), related products, favorites
- **Cart** — quantity updates, remove item, mock coupon codes (`BREW10`, `CRUST5`), tax/delivery/total breakdown, persisted to `localStorage`
- **Checkout** — 4-step flow (customer info → delivery → payment → review) built with `react-hook-form`, mock payment methods (Card / GCash / Maya / Cash), animated success screen
- Dark mode toggle, responsive layout, toast notifications, wishlist/favorites (persisted)

### Phase 2 — Admin Dashboard (`/admin`)
- **Dashboard** — KPI cards (revenue, orders, products, customers), revenue area chart, category pie chart, top-products bar chart, low-stock alerts, recent orders table, recent customers, notifications feed
- **Products** — searchable/filterable table, add/edit modal, delete, stock/status indicators
- **Orders** — searchable/filterable table, order detail modal with status updates (processing / fulfilled / refunded)
- **Customers** — searchable table with segments (VIP/Regular/New), detail modal with order history
- **Inventory** — stock table, low-stock banner, per-item stock adjustment modal
- **Promotions** — coupon list with usage/limits/expiry, create/delete
- **Analytics** — 6-month revenue & orders trend, category mix, top products by revenue
- **Settings** — store info form, notification preferences (mock save)
- Collapsible sidebar (mobile-responsive), topbar search, notifications dropdown, dark mode

### Phase 3 — POS System (`/pos`)
- Full-screen cafe checkout UI (own layout, no storefront chrome)
- **Left**: category tabs, search, tappable product grid — simple items add instantly, customizable drinks (size/extras/notes) open a quick-add modal
- **Right**: live order with quantity/remove/notes per line, optional customer lookup (searches the mock customer list), quick discount chips, tax/total breakdown
- **Payment**: Cash / Card / GCash / Maya buttons, plus a Split Payment modal that validates amounts sum to the total
- **Receipt**: confirmation modal with a printable-style receipt preview and a mock "print" action (toast notification — no real printer call)
- Reachable from the Admin sidebar ("Open POS") or directly at `/pos`

**Not yet built** (next phase, per the original spec): Customer Dashboard. The folder structure and routing are set up to extend into it — just say the word and I'll pick up from here.

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
- **Admin dashboard** lives at `/admin`. All edits (products, orders, stock, promotions) update in-memory React state only — refreshing the page resets them to the mock data.
- **POS** lives at `/pos` and keeps its own in-memory order — it does not share cart state with the storefront or Admin. "Print receipt" shows a toast instead of calling a real printer.
- Product photography is sourced from Unsplash for placeholder purposes; swap in your own brand photography before shipping.

## Design system

- **Colors**: espresso `#2B1B14`, parchment `#F2E9DC`, copper `#B5651D`, sage `#7C8B6F` — defined as CSS variables in `src/index.css`, including a dark-mode override.
- **Type**: Fraunces (display), Sora (body), IBM Plex Mono (prices/labels/utility).
- **Signature element**: a rotated "ink stamp" badge (`.stamp` class) used for best-seller/new callouts and the order-confirmed screen — a nod to loyalty punch cards.
