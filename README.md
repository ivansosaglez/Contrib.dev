# Contrib.dev — GitHub Issue Explorer

A modern web app to explore open source GitHub issues and find your next contribution. Built with Next.js 16, TailwindCSS 4, and shadcn/ui.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?logo=tailwindcss)

## Features

- **Full-text search** across issue titles and descriptions
- **Label filter** — default `good first issue`, fully customizable
- **Language filter** — 15 popular languages supported
- **Min Stars filter** — target repos with a proven audience
- **Status filter** — Open, Closed, or All issues
- **Sort & Order** — by Best Match, Created, Updated, or Comments
- **Active filter badges** — see and remove filters at a glance
- **URL-based state** — filters are shareable via URL
- **Dark/Light/System theme** toggle
- **Pagination** — up to 34 pages (GitHub API limit: 1,000 results)
- **Responsive layout** — works on mobile and desktop

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | TailwindCSS 4 |
| UI Components | shadcn/ui (Radix UI) |
| Icons | Lucide React |
| Date formatting | date-fns |
| Theming | next-themes |
| Data fetching | Native `fetch` + Next.js cache |

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure GitHub token (optional but recommended)

Without a token, the GitHub API allows **10 requests/minute** per IP. With a token, you get **5,000 requests/hour**.

```bash
cp .env.example .env.local
```

Then edit `.env.local` and set your token:

```
GITHUB_TOKEN=ghp_your_token_here
```

To create a token:
1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **Generate new token (classic)**
3. Select only the `public_repo` scope
4. Copy and paste the token into `.env.local`

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects automatically to `/issues`.

### 4. Build for production

```bash
npm run build
npm run start
```

## Project Structure

```
├── app/
│   ├── page.tsx                    # Redirects / → /issues
│   ├── layout.tsx                  # Root layout + ThemeProvider
│   ├── globals.css                 # Tailwind + CSS variables (light/dark)
│   └── issues/
│       ├── page.tsx                # Main server component: parses params, fetches data
│       ├── components/
│       │   ├── FiltersPanel.tsx    # Client component: all search/filter controls
│       │   ├── IssueCard.tsx       # Issue card with labels, state, author
│       │   ├── PaginationControls.tsx
│       │   └── LoadingSkeleton.tsx
│       └── lib/
│           ├── types.ts            # TypeScript interfaces for GitHub API
│           ├── github.ts           # fetch wrapper with error handling + auth
│           └── queryBuilder.ts     # Builds GitHub Search API query strings
├── components/
│   ├── mode-toggle.tsx             # Light/Dark/System theme switcher
│   ├── theme-provider.tsx          # next-themes wrapper
│   └── ui/                         # shadcn/ui components
└── lib/
    └── utils.ts                    # cn() utility for Tailwind class merging
```

## How Filters Map to the GitHub Search API

The app uses the [GitHub Search Issues API](https://docs.github.com/en/rest/search/search#search-issues-and-pull-requests).

| Filter | URL param | GitHub query |
|---|---|---|
| Search text | `?q=text` | `type:issue text` |
| Label | `?label=bug` | `label:"bug"` |
| Language | `?language=go` | `language:go` |
| Min Stars | `?minStars=100` | `stars:>=100` |
| Status | `?state=closed` | `state:closed` |
| Sort | `?sort=updated` | `&sort=updated` |
| Order | `?order=asc` | `&order=asc` |
| Page | `?page=2` | `&page=2` |

## Rate Limits

| Scenario | Limit |
|---|---|
| No token | 10 requests / minute |
| With `GITHUB_TOKEN` | 5,000 requests / hour |
| Results per search | Max 1,000 (GitHub hard limit) |

Responses are cached for **60 seconds** via Next.js `fetch` caching. Changing any filter invalidates the cache automatically.

## Available Scripts

```bash
npm run dev      # Start development server (with hot reload)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```
