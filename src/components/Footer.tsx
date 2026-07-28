export default function Footer() {
  return (
    <footer className="mt-12 border-t-2 border-mustard/40 bg-cream py-8 text-center text-sm text-ink/70">
      Made with{' '}
      <span role="img" aria-label="love">
        ❤️
      </span>{' '}
      by{' '}
      <a
        href="https://dylanwheeler.net"
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-mustard underline-offset-4 transition-colors hover:text-ketchup"
      >
        Dylan
      </a>
      {' · '}
      <a
        href="https://github.com/Confiqure/sketch-ranker"
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-mustard underline-offset-4 transition-colors hover:text-ketchup"
      >
        Source
      </a>
    </footer>
  )
}
