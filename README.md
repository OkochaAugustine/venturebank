# VentureBank

Luxury modern fintech banking platform built with Next.js App Router.

## Tech Stack

- **Next.js 15** (App Router, no `src` folder)
- **React 19** + **JavaScript**
- **Tailwind CSS** — luxury theme, glassmorphism, dark/light mode
- **Framer Motion** — animations
- **Recharts** — dashboard charts
- **MongoDB** + **Mongoose** — data layer
- **JWT** + **bcryptjs** — authentication (steps 10–11)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
venturebank/
├── app/
│   ├── (marketing)/          # Homepage & public pages
│   ├── (auth)/               # Login, register
│   ├── (dashboard)/          # User banking dashboard
│   ├── (admin)/              # Admin panel
│   ├── api/                  # API routes
│   ├── globals.css
│   └── layout.js
├── components/
│   ├── ui/                   # Reusable UI primitives
│   ├── layout/               # Navbar, footer, sidebar
│   ├── home/                 # Homepage sections
│   ├── dashboard/            # Dashboard widgets
│   ├── admin/                # Admin components
│   └── auth/                 # Auth forms
├── config/                   # Site config
├── context/                  # React context providers
├── hooks/                    # Custom hooks
├── lib/                      # Utilities, DB, auth
├── models/                   # Mongoose schemas
└── public/                   # Static assets
```

## Build Roadmap

| Step | Feature |
|------|---------|
| 1 | ✅ Project structure |
| 2 | Global layout |
| 3 | Navbar |
| 4 | Hero section |
| 5 | Homepage sections |
| 6 | Authentication pages |
| 7 | Dashboard |
| 8 | Banking features |
| 9 | Admin panel |
| 10 | MongoDB integration |
| 11 | API routes |
| 12 | Final polish |

## Routes

| Path | Description |
|------|-------------|
| `/` | Homepage |
| `/login` | Sign in |
| `/register` | Create account |
| `/dashboard` | User dashboard |
| `/dashboard/accounts` | Accounts |
| `/dashboard/transactions` | Transactions |
| `/dashboard/transfer` | Transfer money |
| `/admin` | Admin dashboard |
| `/api/health` | Health check |

## License

Private — VentureBank
