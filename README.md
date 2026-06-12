# SEZC 2026 — South East Zonal Convention Website

> **Theme:** "Redefining Legal Practice" | **Location:** Owerri, Imo State

A full-stack Next.js web application for the LAWSAN South East Zonal Convention 2026 — featuring public registration, Paystack payment processing, automated PDF ticket generation, and a secure admin dashboard.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd sezc
npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env.local
```
Fill in your values in `.env.local` (see below for required keys).

### 3. Set Up Database
Get a free PostgreSQL database from [Neon](https://neon.tech) or [Supabase](https://supabase.com), then add the connection string to `DATABASE_URL` in `.env.local`.

```bash
npx prisma migrate dev --name init
```

### 4. Create First Admin User
```bash
node -e "
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
bcrypt.hash('your-password', 12).then(hash => {
  prisma.adminUser.create({
    data: { email: 'admin@sezc2026.com', name: 'Admin', passwordHash: hash }
  }).then(() => { console.log('Admin created!'); process.exit(0); });
});
"
```

### 5. Run Dev Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🔑 Required Environment Variables

| Variable | Description | Where to Get |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Neon / Supabase / Railway |
| `PAYSTACK_SECRET_KEY` | Paystack secret key | [dashboard.paystack.com](https://dashboard.paystack.com) |
| `PAYSTACK_PUBLIC_KEY` | Paystack public key | Paystack Dashboard |
| `PAYSTACK_WEBHOOK_SECRET` | Webhook signing secret | Paystack Dashboard → Webhooks |
| `RESEND_API_KEY` | Email sending API key | [resend.com](https://resend.com) |
| `NEXTAUTH_SECRET` | JWT signing secret | `openssl rand -base64 32` |
| `NEXT_PUBLIC_APP_URL` | Your app's base URL | e.g. `https://sezc2026.com` |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (main)/          # Public-facing pages
│   │   ├── page.tsx     # Homepage
│   │   └── register/    # Registration + success pages
│   ├── (admin)/         # Admin dashboard
│   │   └── admin/
│   │       ├── login/
│   │       └── dashboard/
│   └── api/             # API routes
│       ├── register/    # Registration + Paystack init
│       ├── tickets/     # Public ticket tiers
│       ├── verify/      # Payment verification
│       ├── ticket/      # PDF ticket download
│       ├── webhooks/    # Paystack webhook
│       └── admin/       # Admin CRUD APIs
├── components/
│   ├── layout/          # Navbar, Footer, AdminSidebar
│   └── ui/              # All page sections + admin components
├── lib/                 # Prisma, Paystack, utils, ticket generation
├── types/               # TypeScript types
└── middleware.ts         # Admin route protection
```

---

## 🎨 Design System

- **Primary:** Deep Navy Blue `#0a1628`
- **Accent:** Gold `#d4a832`
- **Typography:** Plus Jakarta Sans (body) + Playfair Display (headings)
- **UI Pattern:** Glassmorphism cards, gradient text, smooth animations

---

## 🚢 Deployment (Vercel)

1. Push to GitHub
2. Connect repo to [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Set Paystack webhook URL to: `https://yourdomain.com/api/webhooks/paystack`
5. Deploy!

---

*Built for LAWSAN South East Zonal Directorate of Projects, Programmes and Policies*
