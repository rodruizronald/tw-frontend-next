# Ticos in Tech - Costa Rica Tech Jobs

A modern job board for tech professionals in Costa Rica. Built with Next.js 16, React 19, and Material UI.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **UI Library**: [Material UI (MUI)](https://mui.com/) v7
- **State Management**: [TanStack Query](https://tanstack.com/query) v5
- **Database**: [Supabase](https://supabase.com/)
- **Language**: TypeScript (strict mode)
- **Styling**: Emotion (via MUI)
- **Form Validation**: Zod
- **Logging**: Pino

## 📋 Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Supabase account (for database)

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd tw-frontend-next
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_LOG_LEVEL=debug
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## 📜 Available Scripts

| Script               | Description                   |
| -------------------- | ----------------------------- |
| `npm run dev`        | Start development server      |
| `npm run build`      | Create production build       |
| `npm run start`      | Start production server       |
| `npm run lint`       | Run ESLint                    |
| `npm run type-check` | Run TypeScript compiler check |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Home page (redirects to /jobs/search)
│   ├── globals.css         # Global styles
│   ├── robots.ts           # SEO robots.txt
│   ├── sitemap.ts          # SEO sitemap.xml
│   └── jobs/
│       └── search/
│           └── page.tsx    # Job search page
├── components/             # Shared UI components
│   ├── providers/          # Context providers
│   ├── Header/             # App header with search
│   ├── JobLayout/          # Main job layout
│   └── Pagination/         # Pagination component
├── features/               # Feature modules
│   └── jobs/               # Job search feature
│       ├── api/            # Repository & service layer
│       ├── components/     # Job-specific components
│       ├── hooks/          # Custom hooks
│       ├── constants/      # Constants
│       └── types/          # TypeScript types
├── lib/                    # Utilities and clients
│   ├── supabase/           # Supabase clients
│   ├── config/             # Configuration
│   ├── logging/            # Logger
│   ├── query/              # React Query client
│   └── theme/              # MUI theme
└── types/                  # Global type declarations
```

## 🔒 Environment Variables

| Variable                        | Description                       | Required |
| ------------------------------- | --------------------------------- | -------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL              | Yes      |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key            | Yes      |
| `NEXT_PUBLIC_SITE_URL`          | Site URL for SEO                  | Yes      |
| `NEXT_PUBLIC_API_BASE_URL`      | Backend API URL                   | No       |
| `NEXT_PUBLIC_LOG_LEVEL`         | Log level (error/warn/info/debug) | No       |
| `LOG_ENDPOINT`                  | Server-side logging endpoint      | No       |
| `LOG_API_KEY`                   | Server-side logging API key       | No       |

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

### Other Platforms

```bash
npm run build
npm run start
```

## 🧪 Testing

```bash
# Type checking
npm run type-check

# Linting
npm run lint
```

## 📄 License

Private - All rights reserved.
