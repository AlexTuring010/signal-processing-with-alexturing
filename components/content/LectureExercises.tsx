import { EXERCISES } from '@/content/practice/exercises'
import { RECENT_SOURCES } from '@/content/practice/types'
import { ExerciseCard } from '@/components/practice/ExerciseCard'

type Props = {
  /** Lecture slug, e.g. "lectures/L02-asymptotic-analysis". */
  lectureSlug: string
}

/**
 * Renders the «Ασκήσεις από εξετάσεις» block on a lecture page.
 *
 * An exercise matches a lecture if the lecture's slug appears in its
 * `prerequisites` AND the lecture is among the *latest* prerequisites
 * (so that an exercise covering everything doesn't show up on every
 * single lecture page — only on the latest one it needs).
 *
 * Sort order: recent exam (2024/2025) first, then frontistirio, then
 * older past exams.
 */
export function LectureExercises({ lectureSlug }: Props) {
  const matching = EXERCISES.filter((ex) => {
    if (!ex.prerequisites.includes(lectureSlug)) return false
    // Only show on the lecture page that introduces the *last* needed lecture.
    // Compare slug suffixes lexicographically: "L02..." < "L03..." etc.
    const latest = ex.prerequisites.reduce((acc, s) => (s > acc ? s : acc), '')
    return latest === lectureSlug
  })

  const sorted = [...matching].sort((a, b) => {
    const aRecent = a.source && RECENT_SOURCES.has(a.source) ? 0 : 1
    const bRecent = b.source && RECENT_SOURCES.has(b.source) ? 0 : 1
    if (aRecent !== bRecent) return aRecent - bRecent
    // Frontistirio > old past exam (older material first within same group)
    const aOrigin = a.origin === 'frontistirio' ? 0 : 1
    const bOrigin = b.origin === 'frontistirio' ? 0 : 1
    if (aOrigin !== bOrigin) return aOrigin - bOrigin
    return a.id.localeCompare(b.id)
  })

  if (sorted.length === 0) {
    return (
      <aside className="not-prose mt-10 rounded-xl border border-dashed border-border bg-bg-soft/40 p-5 text-sm text-fg-muted">
        <p className="mb-1 font-semibold uppercase tracking-wider text-fg-subtle">
          Ασκήσεις από εξετάσεις
        </p>
        <p>
          Δεν υπάρχει άσκηση που να εξετάζει αποκλειστικά αυτή τη
          διάλεξη ως τελευταίο προαπαιτούμενο. Συνεχίζουμε στην επόμενη.
        </p>
      </aside>
    )
  }

  return (
    <section
      id="exercises"
      className="not-prose mt-10 scroll-mt-20 border-t border-border pt-6"
    >
      <header className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-fg-subtle">
          Ασκήσεις από εξετάσεις
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight">
          Από τη θεωρία στην εξεταστική
        </h2>
        <p className="mt-1 text-sm text-fg-muted">
          {sorted.length} άσκη{sorted.length === 1 ? 'ση' : 'σεις'} που
          χρησιμοποι{sorted.length === 1 ? 'εί' : 'ούν'} ως τελευταίο
          εργαλείο αυτή τη διάλεξη. Οι πρόσφατες εξεταστικές (2024/2025)
          φέρουν badge προτεραιότητας.
        </p>
      </header>
      <div className="space-y-4">
        {sorted.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>
    </section>
  )
}
