import Link from 'next/link'
import PageMeta from '@/components/PageMeta'
import { ROUTES } from '@/site.config'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center">
      <PageMeta title="404" noIndex />
      <h1 className="font-goofy text-7xl text-ketchup sm:text-8xl">404</h1>
      <p className="mt-4 max-w-md text-lg text-ink/70">
        This page got voted off the leaderboard. It lost every single matchup.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href={ROUTES.home}
          className="rounded-xl bg-mustard px-6 py-3 font-semibold text-ink transition-all hover:animate-wiggle hover:bg-mustard-dark"
        >
          Take me home
        </Link>
        <Link
          href={ROUTES.vote}
          className="rounded-xl border-2 border-ink/15 bg-white px-6 py-3 font-semibold text-ink/80 transition-colors hover:bg-cream-deep"
        >
          Go vote instead
        </Link>
      </div>
    </main>
  )
}
