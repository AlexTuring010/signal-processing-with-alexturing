import type { ReactNode } from 'react'
import { Lightbulb, AlertTriangle, KeyRound, StickyNote } from 'lucide-react'
import { cn } from '@/lib/utils'

type CalloutType = 'intuition' | 'warning' | 'key' | 'note'

type Props = {
  type?: CalloutType
  title?: string
  children: ReactNode
}

const STYLES: Record<
  CalloutType,
  { icon: typeof Lightbulb; label: string; tone: string }
> = {
  intuition: {
    icon: Lightbulb,
    label: 'Διαίσθηση',
    tone: 'border-amber-300/60 bg-amber-50/70 text-amber-950 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100',
  },
  warning: {
    icon: AlertTriangle,
    label: 'Προσοχή',
    tone: 'border-red-300/60 bg-red-50/70 text-red-950 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-100',
  },
  key: {
    icon: KeyRound,
    label: 'Κλειδί',
    tone: 'border-blue-300/60 bg-blue-50/70 text-blue-950 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-100',
  },
  note: {
    icon: StickyNote,
    label: 'Σημείωση',
    tone: 'border-slate-300/60 bg-slate-50/70 text-slate-900 dark:border-slate-400/30 dark:bg-slate-400/10 dark:text-slate-100',
  },
}

export function Callout({ type = 'note', title, children }: Props) {
  const { icon: Icon, label, tone } = STYLES[type]
  return (
    <aside
      className={cn(
        'my-5 rounded-lg border-l-4 px-4 py-3.5 shadow-sm',
        'border border-l-current',
        tone,
      )}
    >
      <div className="mb-1.5 flex items-center gap-2 text-sm font-semibold tracking-tight">
        <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{title ?? label}</span>
      </div>
      <div className="text-[0.95rem] leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </aside>
  )
}
