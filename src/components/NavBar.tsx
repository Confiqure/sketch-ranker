import Link from 'next/link'
import { useRouter } from 'next/router'

const links = [
  { href: '/vote', label: 'Vote' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/profile', label: 'Profile' },
]

// Site-wide top bar (rendered by _app). Admin lives at /admin — deliberately unlisted.
const NavBar = () => {
  const router = useRouter()
  return (
    <nav className="sticky top-0 z-10 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold text-gray-800 hover:text-blue-600">
          Sketch Ranker
        </Link>
        <div className="flex gap-1 sm:gap-2">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                router.pathname === href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
