'use client'

import { cn } from '@/lib/utils'

type Props = {
  label: string
  emoji: string
  value: number
}

export function NeedBar({ label, emoji, value }: Props) {
  const v = Math.max(0, Math.min(100, Math.round(value)))
  const tone = v >= 60 ? 'success' : v >= 30 ? 'warn' : 'danger'

  return (
    <div className="flex items-center gap-2">
      <span aria-hidden="true" className="w-5 text-center text-sm leading-none">
        {emoji}
      </span>
      <span className="w-14 text-[11px] uppercase tracking-wide text-fg-subtle">{label}</span>
      <div
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={v}
        className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-bg-soft"
      >
        <div
          className={cn(
            'absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-300',
            tone === 'success' && 'bg-success',
            tone === 'warn' && 'bg-warn',
            tone === 'danger' && 'bg-danger',
          )}
          style={{ width: `${v}%` }}
        />
      </div>
      <span className="w-7 text-right text-[10px] tabular-nums text-fg-subtle">{v}</span>
    </div>
  )
}
