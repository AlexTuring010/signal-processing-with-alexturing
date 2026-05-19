'use client'

import {
  Flame,
  Zap,
  ArrowRight,
  RotateCcw,
  ListChecks,
  GraduationCap,
  TrendingUp,
} from 'lucide-react'

type Stats = {
  solvedCount: number
  totalCount: number
  weightCovered: number
  totalWeight: number
  weightFraction: number
}

type Props = {
  total: number
  stats: Stats
  /** Saved position from a prior session, if any. */
  savedPosition: number | null
  onStart: () => void
  onResume: (n: number) => void
}

/**
 * Landing pitch for «Σώσε το εξάμηνο». Shown when no `?n` URL param is
 * present. Sells the just-in-time-learning angle hard, then offers either
 * «Ξεκίνα από την αρχή» or «Συνέχισε από την Άσκηση N» if there's saved
 * progress.
 */
export function SoseLanding({
  total,
  stats,
  savedPosition,
  onStart,
  onResume,
}: Props) {
  const hasSaved = savedPosition !== null
  const weightPct = Math.round(stats.weightFraction * 100)

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Hero */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs font-semibold tracking-wide text-rose-700 dark:text-rose-300">
          <Flame className="h-3.5 w-3.5" aria-hidden />
          Last-minute friendly
        </span>
        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
          Σώσε το{' '}
          <span className="bg-gradient-to-r from-rose-500 to-orange-400 bg-clip-text text-transparent">
            εξάμηνο
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-fg-muted">
          <em>Just-in-time learning</em> για όσους έχουν 10, 5, 3, ή 1 μέρα
          μέχρι την εξέταση. Δεν χρειάζεται να ξέρεις όλη τη θεωρία πριν
          αρχίσεις τις ασκήσεις.
        </p>
      </div>

      {/* The pitch — three cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <PitchCard
          Icon={ListChecks}
          title="1. Λύσε"
          body="Ξεκίνα από την πιο εύκολη άσκηση. Δοκίμασέ την, ακόμα κι αν δεν ξέρεις τίποτα."
          color="from-blue-500/20 to-blue-400/5 text-blue-700 dark:text-blue-300"
        />
        <PitchCard
          Icon={Zap}
          title="2. Διάβασε ό,τι λείπει"
          body="Σου λέμε ακριβώς ποιο κομμάτι θεωρίας χρειάζεσαι για ΑΥΤΗ την άσκηση. Επιστρέφεις με ένα κλικ."
          color="from-amber-500/20 to-amber-400/5 text-amber-700 dark:text-amber-300"
        />
        <PitchCard
          Icon={TrendingUp}
          title="3. Επόμενη"
          body="Κάθε άσκηση που λύνεις = ένα νέο εργαλείο που μπορεί να πέσει στην εξέταση. Σου μετράμε το πραγματικό βάρος."
          color="from-emerald-500/20 to-emerald-400/5 text-emerald-700 dark:text-emerald-300"
        />
      </div>

      {/* Why it works */}
      <div className="mt-10 rounded-xl border border-border bg-bg-elevated p-6">
        <h2 className="mb-3 text-xl font-bold tracking-tight">
          Γιατί δουλεύει
        </h2>
        <ul className="space-y-2 text-[15px] leading-relaxed text-fg-muted">
          <li>
            <strong className="text-fg">Είναι ασφαλέστερο.</strong> Το να
            διαβάσεις 200 σελίδες θεωρίας πριν δεις άσκηση δεν εγγυάται ότι
            θα ξέρεις τι να κάνεις στην εξέταση. Το να λύσεις 30 ασκήσεις
            σε εγγυάται ότι έχεις 30 εργαλεία.
          </li>
          <li>
            <strong className="text-fg">Είναι σε σωστή σειρά.</strong> Οι
            ασκήσεις είναι ταξινομημένες <em>ανά θεωρητική δυσκολία</em>.
            Οι πρώτες χρειάζονται μόνο ασυμπτωτική ανάλυση· οι τελευταίες
            DP πάνω σε γραφήματα. Δεν θα κολλήσεις σε DP χωρίς να έχεις
            δει greedy.
          </li>
          <li>
            <strong className="text-fg">Παρακολουθούμε αληθινό βάρος.</strong>{' '}
            Όχι «έχεις λύσει το 30%» αλλά «έχεις καλύψει το 32% του
            εξεταστικού βάρους βάσει 6 παλαιών εξεταστικών». Πραγματικός
            αριθμός που σου λέει πόσο έχεις απομείνει.
          </li>
          <li>
            <strong className="text-fg">Κάθε άσκηση έρχεται με coaching.</strong>{' '}
            Δεν είναι απλά «να η λύση». Σε κάθε πρόβλημα παίρνεις «τι κρατάς»
            (το pattern), «πώς θα το αναγνωρίσεις στην εξέταση», και 2-3
            παρόμοιες ασκήσεις για περισσότερη εξάσκηση.
          </li>
        </ul>
      </div>

      {/* CTA */}
      <div className="mt-10 flex flex-col items-center gap-3">
        {hasSaved ? (
          <>
            <button
              type="button"
              onClick={() => onResume(savedPosition)}
              className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-rose-600"
            >
              <RotateCcw className="h-5 w-5" aria-hidden />
              Συνέχισε από την Άσκηση {savedPosition}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={onStart}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 py-2.5 text-sm font-medium text-fg-muted transition hover:border-accent/50 hover:text-fg"
            >
              <GraduationCap className="h-4 w-4" aria-hidden />
              Ξεκίνα από την αρχή
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-rose-600"
          >
            <Flame className="h-5 w-5" aria-hidden />
            Ξεκίνα — Άσκηση 1 από {total}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        )}

        {hasSaved && stats.solvedCount > 0 && (
          <p className="mt-1 text-sm text-fg-muted">
            Έχεις ήδη λύσει{' '}
            <strong className="font-mono text-fg tabular-nums">
              {stats.solvedCount}/{stats.totalCount}
            </strong>{' '}
            ·{' '}
            <strong className="font-mono text-fg tabular-nums">
              {weightPct}%
            </strong>{' '}
            του εξεταστικού βάρους καλυμμένο
          </p>
        )}
      </div>

      {/* Honest fine print */}
      <p className="mt-12 text-center text-xs text-fg-subtle">
        Το «εξεταστικό βάρος» υπολογίζεται από τα παλαιότερα θέματα του
        K17 (Ιούνιος/Σεπτέμβριος 2020 → 2025, πρόοδοι, αρχείο
        Ζησιμόπουλου). Δεν είναι πρόβλεψη για το επόμενο εξεταστικό —
        είναι μέτρηση του τι έχεις ήδη δουλέψει.
      </p>
    </div>
  )
}

function PitchCard({
  Icon,
  title,
  body,
  color,
}: {
  Icon: typeof Flame
  title: string
  body: string
  color: string
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-gradient-to-br p-5 ${color}`}
    >
      <Icon className="mb-3 h-6 w-6" aria-hidden />
      <h3 className="mb-1.5 text-base font-bold tracking-tight text-fg">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-fg-muted">{body}</p>
    </div>
  )
}
