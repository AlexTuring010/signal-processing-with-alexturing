import Link from 'next/link'
import {
  Sigma,
  Dice5,
  Radio,
  Waves,
  Activity,
  Binary,
  type LucideIcon,
} from 'lucide-react'

type Item = {
  title: string
  href: string
  blurb: string
  weight: 1 | 2 | 3
  Icon: LucideIcon
  available: boolean
}

const ITEMS: Item[] = [
  {
    title: 'Foundations',
    href: '/foundations/signals',
    blurb: 'Signals, Fourier, LTI. Θα μάθεις να βλέπεις σήματα και στους δύο φακούς.',
    weight: 2,
    Icon: Sigma,
    available: true,
  },
  {
    title: 'Randomness & Noise',
    href: '/randomness/why',
    blurb: 'Γιατί ο πραγματικός κόσμος δεν είναι ποτέ καθαρός — και πώς το μοντελοποιούμε.',
    weight: 2,
    Icon: Dice5,
    available: false,
  },
  {
    title: 'AM',
    href: '/am/conventional',
    blurb: 'Amplitude modulation. Η πιο διάσημη μέθοδος και η πιο εξεταζόμενη.',
    weight: 3,
    Icon: Radio,
    available: false,
  },
  {
    title: 'FM',
    href: '/fm/idea',
    blurb: 'Frequency modulation. Πιο ανθεκτική στον θόρυβο, και βαριά εξεταστέα.',
    weight: 3,
    Icon: Waves,
    available: false,
  },
  {
    title: 'Sampling',
    href: '/sampling/theorem',
    blurb: 'Πώς το αναλογικό γίνεται ψηφιακό — και τι χάνεις στη διαδικασία.',
    weight: 2,
    Icon: Activity,
    available: false,
  },
  {
    title: 'Digital',
    href: '/digital/intro',
    blurb: 'Light coverage — μια πρώτη επαφή με ψηφιακή μετάδοση.',
    weight: 1,
    Icon: Binary,
    available: false,
  },
]

function WeightBadge({ weight }: { weight: 1 | 2 | 3 }) {
  return (
    <span
      className="inline-flex items-center gap-0.5 text-xs"
      title={`Βαρύτητα στις εξετάσεις: ${weight}/3`}
    >
      {Array.from({ length: 3 }).map((_, i) => (
        <span
          key={i}
          className={i < weight ? 'opacity-100' : 'opacity-25'}
          aria-hidden="true"
        >
          {i < weight ? '🔥' : '·'}
        </span>
      ))}
      <span className="sr-only">Βαρύτητα στις εξετάσεις: {weight} από 3</span>
    </span>
  )
}

export function RoadmapGrid() {
  return (
    <div className="my-5 grid gap-3 sm:grid-cols-2">
      {ITEMS.map((item) => {
        const Card = (
          <div className="flex h-full flex-col rounded-lg border border-border bg-bg-elevated p-4 transition-colors group-hover:border-accent/50 group-hover:bg-accent-soft/20">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent-soft/60 text-accent">
                <item.Icon className="h-4 w-4" aria-hidden="true" />
              </div>
              <WeightBadge weight={item.weight} />
            </div>
            <h4 className="text-base font-semibold tracking-tight">{item.title}</h4>
            <p className="mt-1 flex-1 text-sm text-fg-muted">{item.blurb}</p>
            {!item.available && (
              <span className="mt-2 inline-flex w-fit rounded-full bg-bg-soft px-2 py-0.5 text-[10px] uppercase tracking-wider text-fg-subtle">
                coming soon
              </span>
            )}
          </div>
        )
        return item.available ? (
          <Link key={item.title} href={item.href} className="group block">
            {Card}
          </Link>
        ) : (
          <div key={item.title} className="group cursor-default opacity-80">
            {Card}
          </div>
        )
      })}
    </div>
  )
}
