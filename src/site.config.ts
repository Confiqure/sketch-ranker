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
    'Head-to-head votes decide the definitive ranking of every I Think You Should Leave sketch. Pick the funnier one. Elo does the rest.',
  /** 1024×1024 logo card served from public/ — used for OG + Twitter share previews. */
  ogImage: '/og-image.jpg',
  themeColor: '#fdf3df', // --color-cream
} as const

/**
 * Shared microcopy for the Aurora cold-start states (sloppy-steaks energy).
 */
export const COPY = {
  /** Rotating cold-start lines. Index 0 renders first (it's in the prerendered
   *  HTML, so it must stay deterministic for hydration); the rest join the
   *  rotation client-side. All complete thoughts, none command the user. */
  warmingLines: [
    'Sloppy steaks take a minute.',
    'We are all trying to find the guy who paused this database.',
    'The patterns are so complicated.',
  ],
  warmingSub: 'The scoreboard is waking up.',
  snoozing:
    "The scoreboard doesn't even want to be around right now. Give it a second, then refresh.",
} as const

/**
 * Typed internal routes. Use these instead of hardcoded strings.
 */
export const ROUTES = {
  home: '/',
  vote: '/vote',
  leaderboard: '/leaderboard',
  profile: '/profile',
  admin: '/admin',
} as const
