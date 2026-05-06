'use client'

import { useMemo, useState } from 'react'
import { GraduationCap, Search } from 'lucide-react'
import type { Exercise, Topic } from '@/content/practice/types'
import { TopicFilter } from './TopicFilter'
import { ExerciseCard } from './ExerciseCard'

type Props = {
  exercises: Exercise[]
}

type SourceFilter = 'all' | 'lectures' | 'past-exams'

export function ExerciseLibrary({ exercises }: Props) {
  const [topics, setTopics] = useState<Set<Topic>>(new Set())
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')

  const handleTopicToggle = (t: Topic) => {
    setTopics((prev) => {
      const next = new Set(prev)
      if (next.has(t)) next.delete(t)
      else next.add(t)
      return next
    })
  }

  // Topic counts for the filter chips
  const topicCounts = useMemo(() => {
    const c: Partial<Record<Topic, number>> = {}
    for (const ex of exercises) c[ex.topic] = (c[ex.topic] ?? 0) + 1
    return c
  }, [exercises])

  // Filter
  const filtered = useMemo(() => {
    return exercises.filter((ex) => {
      if (topics.size > 0 && !topics.has(ex.topic)) return false
      if (sourceFilter === 'lectures' && ex.source) return false
      if (sourceFilter === 'past-exams' && !ex.source) return false
      return true
    })
  }, [exercises, topics, sourceFilter])

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="rounded-xl border border-border bg-bg-elevated p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-fg">
          <Search className="h-4 w-4 text-fg-muted" aria-hidden />
          Φίλτρα
        </div>
        <div className="space-y-3">
          <div>
            <div className="mb-2 text-xs uppercase tracking-wider text-fg-subtle">
              Κατά topic
            </div>
            <TopicFilter
              selected={topics}
              onChange={handleTopicToggle}
              onClear={() => setTopics(new Set())}
              counts={topicCounts}
            />
          </div>
          <div>
            <div className="mb-2 text-xs uppercase tracking-wider text-fg-subtle">
              Κατά πηγή
            </div>
            <div className="flex flex-wrap gap-2">
              <SourceChip
                active={sourceFilter === 'all'}
                onClick={() => setSourceFilter('all')}
                label="Όλες"
              />
              <SourceChip
                active={sourceFilter === 'lectures'}
                onClick={() => setSourceFilter('lectures')}
                label="Από διαλέξεις"
              />
              <SourceChip
                active={sourceFilter === 'past-exams'}
                onClick={() => setSourceFilter('past-exams')}
                label="Παλαιότερα θέματα"
                icon={<GraduationCap className="h-3 w-3" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Result count */}
      <div className="text-sm text-fg-muted">
        Δείχνει{' '}
        <span className="font-semibold text-fg tabular-nums">{filtered.length}</span>{' '}
        από <span className="tabular-nums">{exercises.length}</span> ασκήσεις.
      </div>

      {/* Exercise list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-bg-soft/50 p-8 text-center text-sm text-fg-muted">
          Καμία άσκηση δεν ταιριάζει στα τρέχοντα φίλτρα.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
        </div>
      )}
    </div>
  )
}

function SourceChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean
  onClick: () => void
  label: string
  icon?: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
        active
          ? 'border-accent bg-accent text-white'
          : 'border-border bg-bg-soft text-fg-muted hover:border-accent/50 hover:text-fg'
      }`}
    >
      {icon}
      {label}
    </button>
  )
}
