'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { LogIn, User as UserIcon, ShieldCheck, ChevronDown } from 'lucide-react'

type Props = {
  user: {
    id: string
    displayName: string
    avatarUrl: string | null
    isModerator: boolean
  } | null
}

export function UserMenu({ user }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-bg-elevated px-3 text-xs font-semibold text-fg transition hover:border-accent/50 hover:text-accent"
      >
        <LogIn className="h-3.5 w-3.5" aria-hidden />
        Σύνδεση
      </Link>
    )
  }

  const initial = user.displayName.charAt(0).toUpperCase() || '?'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-bg-elevated pl-1 pr-2 text-xs font-semibold text-fg transition hover:border-accent/50"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Avatar url={user.avatarUrl} initial={initial} />
        <span className="hidden max-w-[120px] truncate sm:inline">{user.displayName}</span>
        <ChevronDown className="h-3 w-3 text-fg-subtle" aria-hidden />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-lg"
        >
          <div className="border-b border-border px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Avatar url={user.avatarUrl} initial={initial} />
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-fg">
                  {user.displayName}
                </div>
                {user.isModerator && (
                  <div className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300">
                    <ShieldCheck className="h-2.5 w-2.5" aria-hidden />
                    Moderator
                  </div>
                )}
              </div>
            </div>
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-fg transition hover:bg-bg-soft"
            role="menuitem"
          >
            <UserIcon className="h-3.5 w-3.5 text-fg-muted" aria-hidden />
            Το προφίλ μου
          </Link>
          <form method="post" action="/auth/sign-out">
            <button
              type="submit"
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-fg transition hover:bg-bg-soft"
              role="menuitem"
            >
              <LogIn className="h-3.5 w-3.5 rotate-180 text-fg-muted" aria-hidden />
              Αποσύνδεση
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

function Avatar({ url, initial }: { url: string | null; initial: string }) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        className="h-6 w-6 rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    )
  }
  return (
    <span
      aria-hidden
      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-accent to-blue-500 text-[11px] font-bold text-white"
    >
      {initial}
    </span>
  )
}
