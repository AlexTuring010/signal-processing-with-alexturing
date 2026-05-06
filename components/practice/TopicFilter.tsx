'use client'

import { TOPIC_LABELS, TOPIC_COLORS } from '@/content/practice/types'
import type { Topic } from '@/content/practice/types'

type Props = {
  selected: Set<Topic>
  onChange: (topic: Topic) => void
  onClear: () => void
  /** Optional counts to display next to each topic. */
  counts?: Partial<Record<Topic, number>>
}

const ALL_TOPICS: Topic[] = [
  'foundations',
  'modulation',
  'am',
  'fm',
  'random',
  'noise',
  'sampling',
]

export function TopicFilter({ selected, onChange, onClear, counts }: Props) {
  const allActive = selected.size === 0

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={onClear}
        className={`rounded-full border px-3 py-1 text-xs transition ${
          allActive
            ? 'border-accent bg-accent text-white'
            : 'border-border bg-bg-soft text-fg-muted hover:border-accent/50 hover:text-fg'
        }`}
      >
        Όλα τα topics
      </button>
      {ALL_TOPICS.map((topic) => {
        const isActive = selected.has(topic)
        const count = counts?.[topic]
        return (
          <button
            key={topic}
            type="button"
            onClick={() => onChange(topic)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              isActive
                ? TOPIC_COLORS[topic] + ' font-semibold'
                : 'border-border bg-bg-soft text-fg-muted hover:border-accent/40 hover:text-fg'
            }`}
          >
            {TOPIC_LABELS[topic]}
            {count != null && (
              <span className="ml-1.5 tabular-nums opacity-70">({count})</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
