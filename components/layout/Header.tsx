import Link from 'next/link'
import { Github, Radio } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { SearchBar } from './SearchBar'
import { MobileNav } from './MobileNav'

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-3 px-3 sm:px-4 lg:px-6">
        <MobileNav />

        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <Radio className="h-5 w-5 text-accent" aria-hidden="true" />
          <span className="hidden sm:inline">Signal Processing</span>
          <span className="hidden text-fg-subtle sm:inline">·</span>
          <span className="text-accent">AlexTuring</span>
        </Link>

        <div className="flex flex-1 justify-center">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="https://github.com/alexturing010/signal-processing-with-alexturing"
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-fg-muted hover:bg-bg-soft hover:text-fg"
            aria-label="Repository στο GitHub"
            title="GitHub"
          >
            <Github className="h-4 w-4" />
          </a>
        </div>
      </div>
    </header>
  )
}
