import Link from 'next/link'
import { GraduationCap, ListChecks, Brain, ChevronRight } from 'lucide-react'
import { ExerciseLibrary } from '@/components/practice/ExerciseLibrary'
import { EXERCISES } from '@/content/practice/exercises'
import { QUIZ_BANK } from '@/content/practice/quiz-bank'

export const metadata = {
  title: 'Practice — λυμένα παραδείγματα + quiz',
  description:
    'Λυμένες ασκήσεις φιλτραρισμένες κατά topic και κατά πηγή (διαλέξεις vs παλαιά θέματα), με ένα δεύτερο tab για Σωστό/Λάθος + πολλαπλής επιλογής quiz σε τρία modes.',
}

export default function PracticePage() {
  const lectureCount = EXERCISES.filter((e) => !e.source).length
  const examCount = EXERCISES.length - lectureCount

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <header className="mb-8">
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-accent-soft/60 text-accent">
          <GraduationCap className="h-5 w-5" aria-hidden />
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Practice hub
        </h1>
        <p className="mt-3 max-w-2xl text-fg-muted">
          Λυμένες ασκήσεις από τις διαλέξεις και παλαιότερα θέματα εξετάσεων, με
          φίλτρο κατά topic ώστε να εστιάζεις σε όποιο σημείο σου φαίνεται
          αδύναμο. Κάθε άσκηση δείχνει τα <strong>prerequisites</strong> με
          links στις σχετικές ενότητες της θεωρίας.
        </p>
      </header>

      {/* Quick navigation cards */}
      <div className="mb-10 grid gap-3 sm:grid-cols-2">
        <a
          href="#exercises"
          className="group rounded-xl border border-border bg-bg-elevated p-5 transition hover:border-accent/50 hover:shadow-md"
        >
          <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-accent-soft/60 text-accent">
            <ListChecks className="h-5 w-5" aria-hidden />
          </div>
          <h2 className="font-semibold tracking-tight">
            Λυμένες ασκήσεις{' '}
            <span className="text-fg-subtle">({EXERCISES.length})</span>
          </h2>
          <p className="mt-1 text-sm text-fg-muted">
            {lectureCount} από διαλέξεις · {examCount} παλαιότερα θέματα. Κλικ
            για να δεις τη λύση.
          </p>
        </a>
        <Link
          href="/practice/quiz"
          className="group rounded-xl border border-border bg-bg-elevated p-5 transition hover:border-accent/50 hover:shadow-md"
        >
          <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-purple-500/15 text-purple-600 dark:text-purple-300">
            <Brain className="h-5 w-5" aria-hidden />
          </div>
          <h2 className="flex items-center gap-1 font-semibold tracking-tight">
            Quiz mode{' '}
            <span className="text-fg-subtle">({QUIZ_BANK.length})</span>
            <ChevronRight className="ml-auto h-4 w-4 text-fg-subtle transition group-hover:translate-x-0.5 group-hover:text-accent" />
          </h2>
          <p className="mt-1 text-sm text-fg-muted">
            Σωστό/Λάθος + πολλαπλής επιλογής. Τρία modes: static, timed, ή
            μία-την-φορά με χρονόμετρο.
          </p>
        </Link>
      </div>

      {/* Exercise library */}
      <section id="exercises" className="scroll-mt-20">
        <h2 className="mb-4 text-xl font-bold tracking-tight">Λυμένες ασκήσεις</h2>
        <ExerciseLibrary exercises={EXERCISES} />
      </section>

      {/* Footer tips */}
      <section className="mt-12 rounded-xl border border-border bg-bg-soft/60 p-5 text-sm leading-relaxed text-fg-muted">
        <h3 className="mb-2 text-base font-semibold text-fg">
          Συμβουλές εξετάσεων
        </h3>
        <ul className="ml-5 list-disc space-y-1">
          <li>Πρώτα διάβασε όλα τα θέματα και ξεκίνα από τα εύκολα.</li>
          <li>
            Στις True/False, προσοχή στη παγίδα «λευκός θόρυβος = Gaussian»
            (ψευδές — διαφορετικά concepts).
          </li>
          <li>
            <strong>Carson:</strong> <code>B = 2(β+1)W</code> — μάθε το απέξω.
          </li>
          <li>
            <strong>AM efficiency:</strong> πάντα{' '}
            <code>η ≤ 1/3 ≈ 33%</code> για conventional AM.
          </li>
          <li>
            <strong>Bessel zeros</strong> για carrier vanish: β ≈ 2.405, 5.520,
            8.654.
          </li>
        </ul>
      </section>
    </div>
  )
}
