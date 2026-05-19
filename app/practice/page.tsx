import Link from 'next/link'
import {
  GraduationCap,
  ListChecks,
  Brain,
  ChevronRight,
  Flame,
} from 'lucide-react'
import { ExerciseLibrary } from '@/components/practice/ExerciseLibrary'
import {
  FormulaSheetPanel,
  FormulaSheetButton,
} from '@/components/practice/FormulaSheetPanel'
import { Comments } from '@/components/layout/Comments'
import { SectionCommentsProvider } from '@/components/layout/section-comments-context'
import { EXERCISES } from '@/content/practice/exercises'
import { QUIZ_BANK } from '@/content/practice/quiz-bank'

export const metadata = {
  title: 'Practice — λυμένα παραδείγματα + quiz',
  description:
    'Λυμένες ασκήσεις με προτεραιότητα στα παλαιά θέματα εξετάσεων (Σεπτ\'25, Ιαν\'26, Ιουν\'25, Πρόοδοι A+B Μαΐου\'25). Φιλτράρισμα κατά topic, εξεταστική, πηγή. Quiz mode σε 3 τρόπους εξάσκησης. Το τυπολόγιο εμφανίζεται κάτω αριστερά κάθε στιγμή.',
}

export default function PracticePage() {
  const pastExamCount = EXERCISES.filter((e) => e.origin === 'past-exam').length
  const lectureCount = EXERCISES.filter((e) => e.origin === 'lecture').length
  const aiCount = EXERCISES.filter((e) => e.origin === 'ai-generated').length

  return (
    <>
      <FormulaSheetPanel />
      <FormulaSheetButton />

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
            Όλα τα παλαιότερα θέματα εξετάσεων, λυμένα βήμα-βήμα και ταγμένα
            με <strong>χρονιά</strong> και <strong>βάρος (%)</strong>. Όταν
            υπάρχει <em>κατά πρώτο λόγο</em> πραγματικό εξεταστικό υλικό, αυτό
            προβάλλεται πρώτο. Παλαιότερα παραδείγματα από διαλέξεις σου
            χρησιμεύουν επικουρικά.
          </p>
        </header>

        {/* Quick navigation cards */}
        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          <Link
            href="/practice/sose-to-eksamino"
            className="group relative rounded-xl border-2 border-rose-500/40 bg-gradient-to-br from-rose-500/10 to-bg-elevated p-5 transition hover:border-rose-500 hover:shadow-md"
          >
            <span className="absolute -top-2 right-3 inline-flex items-center gap-1 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
              <Flame className="h-2.5 w-2.5" aria-hidden />
              Νέο
            </span>
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-300">
              <Flame className="h-5 w-5" aria-hidden />
            </div>
            <h2 className="flex items-center gap-1 font-semibold tracking-tight">
              Σώσε το εξάμηνο
              <ChevronRight className="ml-auto h-4 w-4 text-fg-subtle transition group-hover:translate-x-0.5 group-hover:text-rose-500" />
            </h2>
            <p className="mt-1 text-sm text-fg-muted">
              Just-in-time learning για last-minute. 75 ασκήσεις σε σειρά
              θεωρητικής δυσκολίας με coaching ανά πρόβλημα.
            </p>
          </Link>
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
              <strong>{pastExamCount}</strong> παλαιά θέματα ·{' '}
              <strong>{lectureCount}</strong> από διαλέξεις
              {aiCount > 0 && ` · ${aiCount} AI παραλλαγές`}.
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
              Σωστό/Λάθος + πολλαπλής επιλογής. 3 modes: static, timed,
              one-at-a-time.
            </p>
          </Link>
        </div>

        {/* Exercise library */}
        <section id="exercises" className="scroll-mt-20">
          <h2 className="mb-4 text-xl font-bold tracking-tight">
            Λυμένες ασκήσεις
          </h2>
          <SectionCommentsProvider>
            <ExerciseLibrary exercises={EXERCISES} />
          </SectionCommentsProvider>
        </section>

        {/* Footer tips with section refs */}
        <section className="mt-12 rounded-xl border border-border bg-bg-soft/60 p-5 text-sm leading-relaxed text-fg-muted">
          <h3 className="mb-2 text-base font-semibold text-fg">
            Συμβουλές εξετάσεων
          </h3>
          <ul className="ml-5 list-disc space-y-1.5">
            <li>
              Πρώτα διάβασε όλα τα θέματα και ξεκίνα από τα εύκολα.
            </li>
            <li>
              <strong>Master Theorem:</strong> γρήγορα κατατάσσεις{' '}
              <code>T(n) = aT(n/b) + f(n)</code> σε case 1/2/3. →{' '}
              <Link
                href="/lectures/L03-divide-and-conquer-i"
                className="text-accent hover:underline"
              >
                L03 · D&C I
              </Link>
            </li>
            <li>
              <strong>Dijkstra:</strong> δεν δουλεύει με αρνητικά βάρη — πήγαινε
              Bellman-Ford. →{' '}
              <Link
                href="/lectures/L08-graphs-iii"
                className="text-accent hover:underline"
              >
                L08 · Shortest paths
              </Link>
            </li>
            <li>
              <strong>Cut / cycle property:</strong> ο πυρήνας της απόδειξης
              ορθότητας Prim/Kruskal. →{' '}
              <Link
                href="/lectures/L09-graphs-iv"
                className="text-accent hover:underline"
              >
                L09 · MST
              </Link>
            </li>
            <li>
              <strong>Exchange argument:</strong> τυπικό σχήμα απόδειξης
              βελτιστότητας άπληστου αλγορίθμου. →{' '}
              <Link
                href="/lectures/L11-greedy-i"
                className="text-accent hover:underline"
              >
                L11 · Greedy I
              </Link>
            </li>
            <li>
              <strong>DP recipe:</strong> ορισμός subproblem → recurrence →
              base case → bottom-up πίνακας → ανάκτηση λύσης. →{' '}
              <Link
                href="/lectures/L14-dp-i"
                className="text-accent hover:underline"
              >
                L14 · DP I
              </Link>
            </li>
            <li>
              <strong>0/1 vs unbounded knapsack:</strong> διαφορά μόνο στη
              σειρά των δύο βρόχων. →{' '}
              <Link
                href="/lectures/L15-dp-ii"
                className="text-accent hover:underline"
              >
                L15 · DP II
              </Link>
            </li>
            <li>
              <strong>Pseudo-polynomial:</strong> γιατί το knapsack ΔΕΝ είναι
              πραγματικά πολυωνυμικό. →{' '}
              <Link
                href="/lectures/L15-dp-ii"
                className="text-accent hover:underline"
              >
                L15 · DP II
              </Link>
            </li>
          </ul>
        </section>

        {/* Comments */}
        <Comments slug="practice" pageTitle="Practice hub" />
      </div>
    </>
  )
}
