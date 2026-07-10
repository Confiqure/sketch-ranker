import Link from 'next/link'
import { useRouter } from 'next/router'
import { ROUTES, SITE } from '@/site.config'

const links = [
  { href: ROUTES.vote, label: 'Vote' },
  { href: ROUTES.leaderboard, label: 'Leaderboard' },
  { href: ROUTES.profile, label: 'Profile' },
]

// Site-wide top bar (rendered by _app). Admin lives at /admin — deliberately unlisted.
const NavBar = () => {
  const router = useRouter()
  return (
    <nav className="sticky top-0 z-10 w-full border-b-2 border-mustard/40 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href={ROUTES.home}
          className="font-goofy text-lg text-ink transition-colors hover:text-ketchup"
        >
          {SITE.name}
        </Link>
        <div className="flex gap-1 sm:gap-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors ${
                router.pathname === href
                  ? 'bg-ketchup text-white'
                  : 'text-ink/60 hover:bg-cream-deep hover:text-ink'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

export default NavBar
