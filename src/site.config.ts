/**
 * Site-wide identity and social-share configuration.
 * Single source of truth — import this anywhere you need site metadata
 * (same pattern as dylanwheeler.net's site.config.ts).
 */
export const SITE = {
  name: 'Sketch Ranker',
  title: 'Comedy Sketch Ranker',
  domain: 'itysl.dylanwheeler.net',
  url: 'https://itysl.dylanwheeler.net',
  description:
    'Head-to-head votes decide the definitive ranking of every I Think You Should Leave sketch. Pick the funnier one — Elo does the rest.',
  /** 1024×1024 logo card served from public/ — used for OG + Twitter share previews. */
  ogImage: '/og-image.jpg',
  themeColor: '#fdf3df', // --color-cream
} as const

/**
 * Typed internal routes — use these instead of hardcoded strings.
 */
export const ROUTES = {
  home: '/',
  vote: '/vote',
  leaderboard: '/leaderboard',
  profile: '/profile',
  admin: '/admin',
} as const
