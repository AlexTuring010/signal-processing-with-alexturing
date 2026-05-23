'use client'

/**
 * Modulation Decision Tree.
 *
 * Lets the student answer three exam-relevant trade-off questions and watch
 * the matching AM variant light up. The goal is to make the choice between
 * Conventional AM / DSB-SC / SSB / VSB feel like a small design problem with
 * an answer, not a memorisation exercise.
 *
 * Each question maps to one row of a tiny scoring table — a variant earns +1
 * when an answer would favour it. The variant with the highest score lights
 * up; ties are surfaced honestly ("two variants are equally good — your call
 * goes by secondary considerations"). The same scoring table is shown below
 * the tree so the student can audit *why* the highlighted variant won.
 */

import { Fragment, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type AnswerId = 'yes' | 'no' | null

type VariantId = 'am' | 'dsb-sc' | 'ssb' | 'vsb'

type Variant = {
  id: VariantId
  label: string
  shortLabel: string
  caption: string
  realWorld: string
}

const VARIANTS: Record<VariantId, Variant> = {
  am: {
    id: 'am',
    label: 'Conventional AM (DSB-AM-TC)',
    shortLabel: 'AM',
    caption:
      'Carrier + δύο πλήρεις πλευρικές. Φθηνός δέκτης με envelope detector. Σπαταλά ισχύ στον carrier.',
    realWorld: 'AM ραδιόφωνο 540–1700 kHz · CB radio · VHF αεροπορίας',
  },
  'dsb-sc': {
    id: 'dsb-sc',
    label: 'DSB-SC (Double-Sideband Suppressed Carrier)',
    shortLabel: 'DSB-SC',
    caption:
      'Πετάμε τον carrier — 100% της ισχύος στο μήνυμα. Δέκτης χρειάζεται coherent demodulation.',
    realWorld: 'Stereo FM subcarrier · color TV chrominance',
  },
  ssb: {
    id: 'ssb',
    label: 'SSB (Single Sideband)',
    shortLabel: 'SSB',
    caption:
      'Πετάμε και τη μία πλευρά — μισό bandwidth από AM/DSB-SC. Πομπός + δέκτης πολύ πιο σύνθετοι (Hilbert ή φίλτρο).',
    realWorld: 'Shortwave HF radio · ραδιοερασιτεχνικά · στρατιωτικές HF',
  },
  vsb: {
    id: 'vsb',
    label: 'VSB (Vestigial Sideband)',
    shortLabel: 'VSB',
    caption:
      'Συμβιβασμός: μία πλήρης πλευρά + κατάλοιπο της άλλης + reduced carrier. Επιτρέπει envelope detector + κρατάει σχεδόν το bandwidth του SSB.',
    realWorld: 'NTSC αναλογική TV (μέχρι 2009 ΗΠΑ)',
  },
}

type Question = {
  id: string
  prompt: string
  hint: string
  /** When the answer is YES, these variants gain +1 to score (positive). */
  yesFavours: VariantId[]
  /** When the answer is NO, these variants gain +1 to score (positive). */
  noFavours: VariantId[]
  /** Plain-Greek interpretation chip shown after the user answers. */
  interpret: {
    yes: string
    no: string
  }
}

const QUESTIONS: Question[] = [
  {
    id: 'cheap-rx',
    prompt: 'Πρέπει ο δέκτης να είναι όσο το δυνατόν φθηνότερος / απλούστερος;',
    hint: 'π.χ. AM ραδιόφωνο σε κάθε κουζίνα — απλό κύκλωμα δίοδος + RC.',
    yesFavours: ['am', 'vsb'],
    noFavours: ['dsb-sc', 'ssb'],
    interpret: {
      yes: 'Χρειάζεσαι envelope detector → ο carrier πρέπει να υπάρχει.',
      no: 'Αντέχεις coherent demodulator → ο carrier είναι σπατάλη ισχύος.',
    },
  },
  {
    id: 'power-tight',
    prompt: 'Είναι η εκπεμπόμενη ισχύς πολύτιμη / περιορισμένη;',
    hint: 'π.χ. μπαταρία, δορυφορικός πομπός, ραδιοερασιτεχνικός σταθμός.',
    yesFavours: ['dsb-sc', 'ssb'],
    noFavours: ['am', 'vsb'],
    interpret: {
      yes: 'Δεν θέλεις να κάψεις ≥ 67% στον carrier → suppressed-carrier σχήματα.',
      no: 'Μπορείς να αντέξεις τη σπατάλη του carrier για να κερδίσεις σε απλότητα δέκτη.',
    },
  },
  {
    id: 'bw-tight',
    prompt: 'Είναι το διαθέσιμο bandwidth στενό / πολυσύχναστο;',
    hint: 'π.χ. HF spectrum, πολλά κανάλια στενά — κερδίζεις μισό εύρος.',
    yesFavours: ['ssb', 'vsb'],
    noFavours: ['am', 'dsb-sc'],
    interpret: {
      yes: 'Πρέπει να πετάξεις μία (ή σχεδόν μία) πλευρά → SSB ή VSB.',
      no: 'Μπορείς να κρατήσεις και τις δύο πλευρικές (B = 2W).',
    },
  },
]

/** A compact lookup that the student can audit. Built from the questions. */
const SCORING_GRID = QUESTIONS.map((q) => {
  const yesSet = new Set(q.yesFavours)
  const noSet = new Set(q.noFavours)
  return {
    id: q.id,
    prompt: q.prompt,
    cells: (Object.keys(VARIANTS) as VariantId[]).map((vid) => ({
      vid,
      yes: yesSet.has(vid),
      no: noSet.has(vid),
    })),
  }
})

export function ModulationDecisionTree() {
  const [answers, setAnswers] = useState<Record<string, AnswerId>>({
    'cheap-rx': null,
    'power-tight': null,
    'bw-tight': null,
  })

  const setAnswer = (qid: string, a: AnswerId) =>
    setAnswers((prev) => ({ ...prev, [qid]: a }))

  const allAnswered = Object.values(answers).every((a) => a !== null)

  const scores = useMemo(() => {
    const s: Record<VariantId, number> = { am: 0, 'dsb-sc': 0, ssb: 0, vsb: 0 }
    for (const q of QUESTIONS) {
      const a = answers[q.id]
      if (a === null) continue
      const favoured = a === 'yes' ? q.yesFavours : q.noFavours
      for (const v of favoured) s[v] += 1
    }
    return s
  }, [answers])

  const maxScore = Math.max(...Object.values(scores))
  const winners = (Object.keys(scores) as VariantId[]).filter(
    (v) => scores[v] === maxScore && maxScore > 0,
  )

  const reset = () =>
    setAnswers({ 'cheap-rx': null, 'power-tight': null, 'bw-tight': null })

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Decision tree — ποια AM παραλλαγή να διαλέξω;
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Απάντησε τα τρία ερωτήματα όπως θα τα έθετε η εφαρμογή σου. Η παραλλαγή
        που τα ικανοποιεί καλύτερα φωτίζει παρακάτω — και το{' '}
        <strong>γιατί</strong> γίνεται ορατό στον πίνακα βαθμολογίας.
      </p>

      <ol className="space-y-3">
        {QUESTIONS.map((q, idx) => {
          const a = answers[q.id]
          const interp = a === 'yes' ? q.interpret.yes : a === 'no' ? q.interpret.no : null
          return (
            <li
              key={q.id}
              className="overflow-hidden rounded-md border border-border bg-bg-soft/40"
            >
              <div className="flex flex-wrap items-baseline gap-2 border-b border-border bg-bg-soft px-3 py-1.5">
                <span className="text-[11px] font-semibold tracking-tight text-fg-subtle">
                  Ερώτηση {idx + 1}
                </span>
                <span className="text-[0.92rem] font-medium">{q.prompt}</span>
              </div>
              <div className="px-3 py-2.5">
                <p className="mb-2 text-[11px] text-fg-muted">{q.hint}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(['yes', 'no'] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setAnswer(q.id, a === value ? null : value)}
                      aria-pressed={a === value}
                      className={cn(
                        'rounded-full border px-3 py-1 text-xs font-medium transition',
                        a === value
                          ? 'border-accent bg-accent text-accent-fg shadow-sm'
                          : 'border-border bg-bg-elevated text-fg-muted hover:border-accent/40 hover:text-fg',
                      )}
                    >
                      {value === 'yes' ? 'Ναι' : 'Όχι'}
                    </button>
                  ))}
                </div>
                {interp && (
                  <p className="mt-2 rounded-md border border-accent/30 bg-accent-soft/30 px-2 py-1.5 text-[11px] leading-relaxed">
                    {interp}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            Τι λέει το tree
          </span>
          {(allAnswered || winners.length > 0) && (
            <button
              type="button"
              onClick={reset}
              className="text-[11px] text-fg-muted underline-offset-2 hover:text-fg hover:underline"
            >
              Καθάρισε
            </button>
          )}
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {(Object.keys(VARIANTS) as VariantId[]).map((vid) => {
            const v = VARIANTS[vid]
            const score = scores[vid]
            const isWinner = winners.includes(vid) && allAnswered
            const isContender = score === maxScore && maxScore > 0 && !allAnswered
            return (
              <div
                key={vid}
                className={cn(
                  'rounded-md border bg-bg-soft/40 p-2.5 transition',
                  isWinner
                    ? 'border-amber-400/70 bg-amber-50/70 shadow-sm dark:border-amber-400/40 dark:bg-amber-400/10'
                    : isContender
                      ? 'border-accent/40 bg-accent-soft/20'
                      : 'border-border opacity-70',
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[12px] font-semibold tracking-tight">
                    {v.label}
                  </span>
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-mono tabular-nums',
                      isWinner
                        ? 'bg-amber-500 text-white'
                        : 'bg-bg-elevated text-fg-muted',
                    )}
                    aria-label={`Score ${score} from 3`}
                  >
                    {score}/3
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-fg-muted">
                  {v.caption}
                </p>
                <p className="mt-1.5 text-[10px] uppercase tracking-wider text-fg-subtle">
                  {v.realWorld}
                </p>
              </div>
            )
          })}
        </div>

        {allAnswered && winners.length > 0 && (
          <div className="mt-3 rounded-md border border-amber-400/40 bg-amber-50/60 px-3 py-2 text-xs leading-relaxed dark:border-amber-400/30 dark:bg-amber-400/10">
            {winners.length === 1 ? (
              <>
                Κερδίζει η <strong>{VARIANTS[winners[0]].shortLabel}</strong> με{' '}
                {scores[winners[0]]}/3. Είναι το σχήμα που ικανοποιεί τους
                περισσότερους από τους περιορισμούς που έβαλες.
              </>
            ) : (
              <>
                Ισοπαλία ανάμεσα σε{' '}
                <strong>
                  {winners.map((w) => VARIANTS[w].shortLabel).join(' & ')}
                </strong>
                . Το tree δεν δίνει ξεκάθαρη νικήτρια — η τελική επιλογή
                γίνεται με δευτερεύοντα κριτήρια (π.χ. ιστορικά standards,
                κόστος πομπού).
              </>
            )}
          </div>
        )}
      </div>

      <details className="mt-3 rounded-md border border-border bg-bg-soft/40 px-3 py-2 text-xs">
        <summary className="cursor-pointer font-medium text-fg">
          Δες τον πίνακα βαθμολογίας
        </summary>
        <p className="mt-2 text-[11px] text-fg-muted">
          Κάθε «Ναι» ή «Όχι» χαρίζει +1 στις παραλλαγές που τη συγκεκριμένη
          απάντηση ευνοεί. Η νικήτρια είναι αυτή με το άθροισμα 3/3 (ή 2/3 με
          ισοπαλία).
        </p>
        <div className="mt-2 overflow-x-auto">
          <table className="min-w-full text-[11px]">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-2 py-1 font-semibold">Ερώτηση</th>
                <th className="px-2 py-1 font-semibold">Απάντηση</th>
                {(Object.keys(VARIANTS) as VariantId[]).map((vid) => (
                  <th key={vid} className="px-2 py-1 text-center font-semibold">
                    {VARIANTS[vid].shortLabel}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SCORING_GRID.map((row) => (
                <Fragment key={row.id}>
                  <tr className="border-b border-border/60">
                    <td
                      className="px-2 py-1 text-fg-muted"
                      rowSpan={2}
                      aria-label={row.prompt}
                    >
                      {row.prompt}
                    </td>
                    <td className="px-2 py-1 text-fg-muted">Ναι</td>
                    {row.cells.map((cell) => (
                      <td
                        key={`yes-${cell.vid}`}
                        className={cn(
                          'px-2 py-1 text-center font-mono',
                          cell.yes ? 'text-success' : 'text-fg-subtle',
                        )}
                      >
                        {cell.yes ? '+1' : '·'}
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-2 py-1 text-fg-muted">Όχι</td>
                    {row.cells.map((cell) => (
                      <td
                        key={`no-${cell.vid}`}
                        className={cn(
                          'px-2 py-1 text-center font-mono',
                          cell.no ? 'text-success' : 'text-fg-subtle',
                        )}
                      >
                        {cell.no ? '+1' : '·'}
                      </td>
                    ))}
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  )
}
