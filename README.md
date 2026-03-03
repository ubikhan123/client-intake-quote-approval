# ClientQuote — Client Intake → Quote → Approval

> A production-ready full-stack web app that transforms project briefs into professional, approvable quotes in seconds.

[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://prisma.io)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6C47FF?logo=clerk)](https://clerk.com)

**Live Demo:** https://client-intake-quote-approval-oaa6.vercel.app/

---

## What It Does

1. **Client fills a multi-step intake form** — project type, pages, complexity, timeline, add-on features, and contact details
2. **Quote engine instantly generates** itemized pricing with rush fees and volume discounts
3. **Client receives a shareable link** to review their personalized quote page
4. **Client approves online** with digital name signature + checkbox — locks the quote and records timestamp
5. **Admin manages everything** via a protected dashboard — filter leads, edit quotes inline, update statuses
6. **PDF export** — download a professional branded quote PDF from both the public quote page and admin

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 (dark glassmorphism design) |
| Database | PostgreSQL via Prisma v7 ORM |
| Auth | Clerk (admin routes only) |
| PDF | pdfkit (server-side generation) |
| Validation | Zod v4 |
| Testing | Jest + ts-jest (8 passing tests) |
| Deploy | Vercel + Neon/Supabase PostgreSQL |

---

## Local Setup

### Prerequisites
- Node.js >= 18
- PostgreSQL database ([Neon](https://neon.tech) free tier works great)
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

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
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

- `http://localhost:3000` — Landing page
- `http://localhost:3000/quote` — Client intake form
- `http://localhost:3000/admin` — Admin dashboard (requires Clerk sign-in)

---

## Running Tests

```bash
npm test
```

8 scenarios: base pricing, feature add-ons, rush fees (+20%), volume discounts (-10%), stacked fees, all 6 features, delivery estimates.

---

## Quote Engine Pricing Logic

```
Base Cost = pages × price_per_page[complexity]
  simple=$50/pg  standard=$90/pg  premium=$140/pg

Feature Add-ons:
  auth: +$120 | adminPanel: +$200 | payments: +$250
  blogCMS: +$120 | multilingual: +$100 | animations: +$80

Rush Fee = +20% of subtotal (timeline ≤ 1 week)
Volume Discount = −10% of subtotal (pages ≥ 10)
Total = Subtotal + Rush Fee − Discount
```

---

## API Reference

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/leads` | None | Submit intake form |
| GET | `/api/quote/[token]` | None | Fetch quote by token |
| POST | `/api/quote/[token]/approve` | None | Approve quote |
| GET | `/api/quote/[token]/pdf` | None | Download PDF |
| GET | `/api/admin/leads` | Clerk | List leads |
| PATCH | `/api/admin/leads/[id]` | Clerk | Update lead status |
| PATCH | `/api/admin/quote/[leadId]` | Clerk | Update quote items |

---

## Deployment on Vercel

1. Push repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add env vars: `DATABASE_URL`, Clerk keys, `NEXT_PUBLIC_APP_URL`
4. Deploy

---

## License

MIT
