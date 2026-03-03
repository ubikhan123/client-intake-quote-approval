<<<<<<< HEAD
# ClientQuote — Client Intake → Quote → Approval

> A production-ready full-stack web app that transforms project briefs into professional, approvable quotes in seconds.

[![Built with Next.js](https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://prisma.io)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk)](https://clerk.com)

---

## What It Does

1. **Client fills a multi-step intake form** — project type, pages, complexity, timeline, add-on features, and contact details
2. **Quote engine instantly generates** itemized pricing with rush fees and volume discounts
3. **Client receives a shareable link** to review their personalized quote page
4. **Client approves online** with digital name signature + checkbox — locks the quote and records timestamp
5. **Admin manages everything** via a protected dashboard — filter leads, edit quotes inline, update statuses
6. **PDF export** — download a professional branded quote PDF from both the public quote page and admin

---

## Screenshots

> _Screenshots will be added after first deploy_

| Landing Page | Quote Form | Public Quote | Admin Dashboard |
|---|---|---|---|
| `screenshot-landing.png` | `screenshot-form.png` | `screenshot-quote.png` | `screenshot-admin.png` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (custom dark glassmorphism design) |
| Database | PostgreSQL via Prisma ORM |
| Auth | Clerk (admin routes only) |
| PDF | pdfkit (server-side generation) |
| Validation | Zod |
| Testing | Jest + ts-jest |
| Deploy | Vercel + Neon/Supabase PostgreSQL |

---

## Local Setup

### Prerequisites
- Node.js >= 18
- PostgreSQL database (local, [Supabase](https://supabase.com), or [Neon](https://neon.tech))
- [Clerk account](https://dashboard.clerk.com)

### 1. Clone and install

```bash
git clone https://github.com/your-username/clientquote.git
cd clientquote
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3. Set up database

```bash
npx prisma db push
npx prisma generate
npm run db:seed
```

### 4. Run dev server

```bash
npm run dev
```

Visit:

- `http://localhost:3000` — Landing page
- `http://localhost:3000/quote` — Client intake form
- `http://localhost:3000/admin` — Admin dashboard (requires Clerk sign-in)

---

## Running Tests

```bash
npm test
npm run test:coverage
```

Tests cover 8 scenarios: base pricing, feature add-ons, rush fees (+20%), volume discounts (-10%), stacked fees, all 6 features, and delivery estimate generation.

---

## How the Quote Rules Engine Works

**File:** `src/lib/quoteEngine.ts`

### Pricing Logic

```
Base Cost = pages x price_per_page[complexity]
  simple=$50/pg  standard=$90/pg  premium=$140/pg

Feature Add-ons:
  auth: +$120 | adminPanel: +$200 | payments: +$250
  blogCMS: +$120 | multilingual: +$100 | animations: +$80

Subtotal = Base + Feature Add-ons
Rush Fee = +20% of subtotal (if rush = true)
Volume Discount = -10% of subtotal (if pages >= 10)
Total = Subtotal + Rush Fee - Discount
```

---

## API Reference

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/leads` | None | Submit intake form, creates Lead + Quote |
| GET | `/api/quote/[token]` | None | Fetch quote by public token |
| POST | `/api/quote/[token]/approve` | None | Approve quote |
| GET | `/api/quote/[token]/pdf` | None | Download PDF |
| GET | `/api/admin/leads` | Clerk | List leads with ?status= filter |
| PATCH | `/api/admin/leads/[id]` | Clerk | Update lead status |
| PATCH | `/api/admin/quote/[leadId]` | Clerk | Update quote items |

---

## Deployment on Vercel

1. Push repo to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables from `.env.example`
4. Deploy (Vercel auto-detects Next.js)
5. Run `npm run db:seed` locally pointing at production DB

**Live Demo:** _Add Vercel URL here after deploy_

---

## License

MIT
=======
# client-intake-quote-approval
>>>>>>> d08b86c54b4a7531b463258e361b20db0d57c928

## Live Demo
https://client-intake-quote-approval-oaa6.vercel.app/
