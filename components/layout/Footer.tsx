import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-bg-soft/40">
      <div className="mx-auto flex max-w-screen-2xl flex-col items-start justify-between gap-2 px-4 py-6 text-sm text-fg-muted sm:flex-row sm:items-center sm:px-6">
        <p>
          Made with care for K21 classmates · NKUA, DIT
        </p>
        <div className="flex items-center gap-4">
          <Link href="/formulas" className="hover:text-fg">
            Τυπολόγιο
          </Link>
          <Link href="/practice" className="hover:text-fg">
            Practice
          </Link>
          <a
            href="https://github.com/alexturing010/signal-processing-with-alexturing"
            target="_blank"
            rel="noreferrer"
            className="hover:text-fg"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  )
}
