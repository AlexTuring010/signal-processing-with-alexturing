import Link from 'next/link'
import { Network } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { SearchBar } from './SearchBar'
import { MobileNav } from './MobileNav'
import { UserMenu } from './UserMenu'
import { MusicPlayer } from './MusicPlayer'
import { buildSearchIndex } from '@/lib/search/build-index'
import { createClient } from '@/lib/supabase/server'

export async function Header() {
  const searchIndex = buildSearchIndex()

  // Auth lookup is wrapped — a corrupted cookie or transient Supabase
  // error must not crash the whole page. We just render anonymously.
  let menuUser: {
    id: string
    displayName: string
    avatarUrl: string | null
    isModerator: boolean
  } | null = null

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url, role')
        .eq('id', user.id)
        .maybeSingle()
      menuUser = {
        id: user.id,
        displayName:
          profile?.display_name ?? user.email?.split('@')[0] ?? 'Φοιτητής',
        avatarUrl: profile?.avatar_url ?? null,
        isModerator: profile?.role === 'moderator',
      }
    }
  } catch {
    /* anonymous render — broken auth state isn't fatal here */
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur supports-[backdrop-filter]:bg-bg/70">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center gap-3 px-3 sm:px-4 lg:px-6">
        <MobileNav />

        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
        >
          <Network className="h-5 w-5 text-accent" aria-hidden="true" />
          <span className="hidden sm:inline">Algorithms and Complexity</span>
          <span className="hidden text-fg-subtle sm:inline">·</span>
          <span className="text-accent">Class Hub</span>
        </Link>

        <div className="flex flex-1 justify-center">
          <SearchBar index={searchIndex} />
        </div>

        <div className="flex items-center gap-2">
          <MusicPlayer />
          <ThemeToggle />
          <UserMenu user={menuUser} />
        </div>
      </div>
    </header>
  )
}
