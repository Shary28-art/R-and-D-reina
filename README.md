# R&D by Reina — Luxury Event Rental E-Commerce

Production-oriented Next.js storefront for **R&D by Reina** with scalable catalog data, cart, event-date availability, Zelle checkout, and API hooks for email and future admin.

## Quick start

```bash
cd rd-by-reina
npm install
npm run dev
```

Open http://localhost:3000.

## Environment

Copy `.env.example` to `.env.local` and set:

* `EMAIL_*` — email provider (see `src/lib/email.ts`; logs to console when unset)
* `NEXT_PUBLIC_ZELLE_RECIPIENT` — displayed Zelle payee

## Architecture

| Area               | Location                                         |
| ------------------ | ------------------------------------------------ |
| Product catalog    | `src/data/products.ts`, `src/data/categories.ts` |
| Filtering / search | `src/lib/product-catalog.ts`                     |
| Mock inventory     | `src/lib/inventory.ts` (replace with API)        |
| Cart (persisted)   | `src/store/cart-store.ts`                        |
| Orders (demo)      | `src/lib/orders-store.ts` + `src/app/api/orders` |
| Email stubs        | `src/lib/email.ts`                               |

Product URLs: `/rentals/[category]/[slug]`
Example: `/rentals/chairs/black-gold-luxury-chair`

## Placeholder content

Unsplash images and `[PLACEHOLDER]` policy copy are marked for replacement with R&D by Reina assets and official policies.

## Build

```bash
npm run build
npm start
```
