'use client'

/**
 * PythagoreanQuadHash — Φροντιστηριακό #5 / άσκηση 10.
 *
 * The O(n²) trick made operational. Rearrange a²+b²+c²=d² to a²+b²=d²−c²,
 * then BUILD a hash of all left-hand values in O(n²) and QUERY all right-hand
 * values in O(n²). Without the hash, each query would be a linear scan and the
 * algorithm collapses back to O(n⁴) — that's the punchline.
 *
 * The input is the smallest distinct Pythagorean quadruple: (1, 4, 8, 9), since
 * 1² + 4² + 8² = 1 + 16 + 64 = 81 = 9². The build phase deposits 10 unordered
 * pairs into the hash. The query phase walks the 6 (c, d) pairs with c<d and
 * three of them hit — all decoding back to the same quadruple, showing the
 * algorithm doesn't care which two array slots play the role of (a, b) vs
 * (c, d). Built for L10 (Phase D).
 */

import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

const ARR = [1, 4, 8, 9]
const N = ARR.length

type BuildStep = {
  kind: 'build'
  i: number
  j: number
  key: number
}

type QueryStep = {
  kind: 'query'
  i: number
  j: number
  target: number
  /** Hash entry that matched (if any) — the (a, b) pair whose square-sum equals target. */
  match?: { a: number; b: number }
}

function makeSteps() {
  const build: BuildStep[] = []
  const firstInsert = new Map<number, [number, number]>()
  for (let i = 0; i < N; i++) {
    for (let j = i; j < N; j++) {
      const key = ARR[i] ** 2 + ARR[j] ** 2
      build.push({ kind: 'build', i, j, key })
      if (!firstInsert.has(key)) firstInsert.set(key, [i, j])
    }
  }
  const query: QueryStep[] = []
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const target = ARR[j] ** 2 - ARR[i] ** 2
      const hit = firstInsert.get(target)
      query.push({
        kind: 'query',
        i,
        j,
        target,
        match: hit ? { a: hit[0], b: hit[1] } : undefined,
      })
    }
  }
  return { build, query }
}

const { build: BUILD_STEPS, query: QUERY_STEPS } = makeSteps()
const N_BUILD = BUILD_STEPS.length
const N_QUERY = QUERY_STEPS.length
const TOTAL = 1 /* intro */ + N_BUILD + 1 /* transition */ + N_QUERY + 1 /* done */

type Phase = 'intro' | 'build' | 'transition' | 'query' | 'done'

function phaseOf(step: number): { phase: Phase; idx: number } {
  if (step === 0) return { phase: 'intro', idx: -1 }
  if (step <= N_BUILD) return { phase: 'build', idx: step - 1 }
  if (step === N_BUILD + 1) return { phase: 'transition', idx: -1 }
  if (step <= N_BUILD + 1 + N_QUERY) return { phase: 'query', idx: step - N_BUILD - 2 }
  return { phase: 'done', idx: -1 }
}

export function PythagoreanQuadHash() {
  const [step, setStep] = useState(0)

  const { phase, idx } = phaseOf(step)

  // Build hash table from build steps up to and including the current one.
  const hash = useMemo(() => {
    const m = new Map<number, [number, number]>()
    const upTo = phase === 'build' ? idx + 1 : phase === 'intro' ? 0 : N_BUILD
    for (let k = 0; k < upTo; k++) {
      const s = BUILD_STEPS[k]
      if (!m.has(s.key)) m.set(s.key, [s.i, s.j])
    }
    return m
  }, [phase, idx])

  const matches = useMemo(() => {
    if (phase === 'intro' || phase === 'build' || phase === 'transition') return []
    const out: { qi: number; qj: number; a: number; b: number }[] = []
    const upTo = phase === 'query' ? idx + 1 : N_QUERY
    for (let k = 0; k < upTo; k++) {
      const s = QUERY_STEPS[k]
      if (s.match) out.push({ qi: s.i, qj: s.j, a: s.match.a, b: s.match.b })
    }
    return out
  }, [phase, idx])

  // Currently highlighted indices (in the input array).
  const hot = (() => {
    if (phase === 'build') {
      const s = BUILD_STEPS[idx]
      return { aIdx: s.i, bIdx: s.j, cIdx: -1, dIdx: -1 }
    }
    if (phase === 'query') {
      const s = QUERY_STEPS[idx]
      const m = s.match
      return {
        aIdx: m ? m.a : -1,
        bIdx: m ? m.b : -1,
        cIdx: s.i,
        dIdx: s.j,
      }
    }
    return { aIdx: -1, bIdx: -1, cIdx: -1, dIdx: -1 }
  })()

  const caption = (() => {
    if (phase === 'intro') {
      return (
        <>
          <strong>Είσοδος.</strong> Πίνακας {`A = [1, 4, 8, 9]`}. Ψάχνουμε
          αν υπάρχει τετράδα δεικτών {`(a, b, c, d)`} (με επανάληψη επιτρεπτή) ώστε
          {' '}<code>A[a]² + A[b]² + A[c]² = A[d]²</code>. Αναδιατάσσουμε σε
          {' '}<code>a²+b² = d²−c²</code> και ψάχνουμε ζεύγη που συμφωνούν.
        </>
      )
    }
    if (phase === 'build') {
      const s = BUILD_STEPS[idx]
      const a = ARR[s.i]
      const b = ARR[s.j]
      const already = idx > 0 && BUILD_STEPS.slice(0, idx).some((p) => p.key === s.key)
      return (
        <>
          <strong>Φάση 1 — εισαγωγή.</strong> Ζεύγος ({a}, {b}). Κλειδί ={' '}
          <code>{a}² + {b}² = {s.key}</code>. {already
            ? <>Υπάρχει ήδη με αυτό το κλειδί — αρκεί ένα αντιπρόσωπο ανά τιμή.</>
            : <>Μπαίνει στον <code>H</code> με αναφορά στο ζεύγος ({a}, {b}).</>}
        </>
      )
    }
    if (phase === 'transition') {
      return (
        <>
          <strong>Ο πίνακας <code>H</code> έχει χτιστεί.</strong> Δεξιά βλέπεις
          τα {hash.size} διακριτά κλειδιά. Δαπανήσαμε <code>O(n²)</code> και
          μπαίνουμε στη Φάση 2 — άλλη μία σάρωση <code>O(n²)</code> πάνω στα
          ζεύγη ({'c'}, {'d'}) με {'c'} &lt; {'d'}, ρωτώντας αν το{' '}
          <code>d²−c²</code> υπάρχει στον <code>H</code>.
        </>
      )
    }
    if (phase === 'query') {
      const s = QUERY_STEPS[idx]
      const c = ARR[s.i]
      const d = ARR[s.j]
      if (s.match) {
        const a = ARR[s.match.a]
        const b = ARR[s.match.b]
        return (
          <>
            <strong>Φάση 2 — αναζήτηση.</strong> Ζεύγος ({c}, {d}). Στόχος ={' '}
            <code>{d}² − {c}² = {s.target}</code>. <strong className="text-success">Βρέθηκε</strong>{' '}
            στον <code>H</code>: αντιστοιχεί στο ζεύγος ({a}, {b}). Δηλαδή{' '}
            <code>{a}² + {b}² + {c}² = {a * a + b * b + c * c} = {d}²</code> ✓.
            Τετράδα ({a}, {b}, {c}, {d}).
          </>
        )
      }
      return (
        <>
          <strong>Φάση 2 — αναζήτηση.</strong> Ζεύγος ({c}, {d}). Στόχος ={' '}
          <code>{d}² − {c}² = {s.target}</code>. <strong className="text-fg-muted">Δεν υπάρχει</strong>{' '}
          στον <code>H</code> — δεν συμπλήρωσε κανένα ζεύγος (α, β) σε τετράδα.
        </>
      )
    }
    return (
      <>
        <strong>Τέλος.</strong> Βρήκαμε {matches.length} αντιστοιχίσεις, και οι τρεις
        αποκωδικοποιούνται στην ίδια τετράδα (1, 4, 8, 9). Επαλήθευση:{' '}
        <code>1² + 4² + 8² = 1 + 16 + 64 = 81 = 9²</code>. Κόστος{' '}
        <code>O(n²) + O(n²) = O(n²)</code> — χωρίς το hash η Φάση 2 θα γινόταν{' '}
        <code>O(n⁴)</code>.
      </>
    )
  })()

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Πυθαγόρεια τετράδα — χτίσε hash, μετά ρώτα
        </div>
        <span className="shrink-0 rounded-md bg-accent/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-accent">
          {phase === 'intro' ? 'Εισαγωγή'
            : phase === 'build' ? `Φάση 1 · ${idx + 1}/${N_BUILD}`
            : phase === 'transition' ? 'Η ουρά αλλάζει'
            : phase === 'query' ? `Φάση 2 · ${idx + 1}/${N_QUERY}`
            : 'Ολοκληρώθηκε'}
        </span>
      </div>

      {/* Input array */}
      <div className="mb-3 flex flex-wrap items-center justify-center gap-1.5">
        <span className="mr-1 text-xs uppercase tracking-wider text-fg-subtle">A =</span>
        {ARR.map((v, k) => {
          const role: string[] = []
          if (k === hot.aIdx) role.push('a')
          if (k === hot.bIdx) role.push('b')
          if (k === hot.cIdx) role.push('c')
          if (k === hot.dIdx) role.push('d')
          const isAB = k === hot.aIdx || k === hot.bIdx
          const isCD = k === hot.cIdx || k === hot.dIdx
          return (
            <div
              key={k}
              className={cn(
                'flex w-[3.25rem] flex-col items-center rounded-md border-2 py-1 transition-colors',
                isAB && isCD
                  ? 'border-fuchsia-500 bg-fuchsia-500/15 text-fg'
                  : isAB
                    ? 'border-amber-500 bg-amber-500/15 text-fg'
                    : isCD
                      ? 'border-sky-500 bg-sky-500/15 text-fg'
                      : 'border-border bg-bg-soft text-fg-muted',
              )}
            >
              <span className="text-sm font-bold">{v}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                {role.length ? role.join('=') : `A[${k}]`}
              </span>
            </div>
          )
        })}
      </div>

      <div className="grid gap-3 md:grid-cols-[1fr,1fr]">
        {/* Current pair / equation panel */}
        <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
            {phase === 'build' ? 'Τρέχον ζεύγος (α, β)' : phase === 'query' ? 'Τρέχον ζεύγος (c, d)' : 'Εξίσωση'}
          </div>
          <div className="mt-1 font-mono text-base text-fg">
            {phase === 'build' && (() => {
              const s = BUILD_STEPS[idx]
              return <>({ARR[s.i]}, {ARR[s.j]}) → α² + β² = <span className="font-bold text-amber-600 dark:text-amber-400">{s.key}</span></>
            })()}
            {phase === 'query' && (() => {
              const s = QUERY_STEPS[idx]
              return <>({ARR[s.i]}, {ARR[s.j]}) → d² − c² = <span className="font-bold text-sky-600 dark:text-sky-400">{s.target}</span></>
            })()}
            {phase === 'intro' && <span className="text-fg-muted">a² + b² + c² = d²</span>}
            {phase === 'transition' && <span className="text-fg-muted">a² + b² = d² − c²</span>}
            {phase === 'done' && <span className="text-success">βρέθηκε</span>}
          </div>
          <div className="mt-2 text-xs leading-relaxed text-fg-muted">
            {phase === 'build'
              ? '↳ μπαίνει στον H ως κλειδί.'
              : phase === 'query'
                ? '↳ ψάχνουμε αυτήν την τιμή στον H.'
                : phase === 'transition'
                  ? 'Από εδώ και πέρα διαβάζουμε, δεν γράφουμε.'
                  : phase === 'done'
                    ? `${matches.length} αντιστοιχίσεις, η ίδια τετράδα.`
                    : 'Το άθροισμα από τη μία πλευρά. Η διαφορά από την άλλη.'}
          </div>
        </div>

        {/* Hash table */}
        <div className="rounded-lg border border-border bg-bg-soft/40 p-3">
          <div className="mb-1 flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
              Hash table H — κλειδί → (a, b)
            </div>
            <span className="rounded bg-bg-elevated px-1.5 py-0.5 text-[10px] font-bold text-fg-muted">
              {hash.size} εγγραφές
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 font-mono text-xs">
            {[...hash.entries()]
              .sort((a, b) => a[0] - b[0])
              .map(([key, [i, j]]) => {
                const isCurrentBuild =
                  phase === 'build' && BUILD_STEPS[idx].key === key
                const isCurrentQueryHit =
                  phase === 'query' && QUERY_STEPS[idx].match && QUERY_STEPS[idx].target === key
                return (
                  <div
                    key={key}
                    className={cn(
                      'flex items-center justify-between rounded px-1.5 py-0.5',
                      isCurrentQueryHit
                        ? 'bg-success/20 text-success font-bold'
                        : isCurrentBuild
                          ? 'bg-amber-500/15 text-fg'
                          : 'text-fg-muted',
                    )}
                  >
                    <span>{key}</span>
                    <span className="text-fg-subtle">→ ({ARR[i]}, {ARR[j]})</span>
                  </div>
                )
              })}
            {hash.size === 0 && (
              <div className="col-span-2 italic text-fg-subtle">— άδειο —</div>
            )}
          </div>
        </div>
      </div>

      {/* Match log */}
      {matches.length > 0 && (
        <div className="mt-3 rounded-lg border border-success/40 bg-success/5 p-3">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-success">
            Τετράδες που βρέθηκαν
          </div>
          <ul className="space-y-0.5 font-mono text-xs text-fg">
            {matches.map((m, k) => (
              <li key={k}>
                ({ARR[m.a]}, {ARR[m.b]}, {ARR[m.qi]}, {ARR[m.qj]}) ·{' '}
                {ARR[m.a] ** 2} + {ARR[m.b] ** 2} + {ARR[m.qi] ** 2} = {ARR[m.a] ** 2 + ARR[m.b] ** 2 + ARR[m.qi] ** 2} = {ARR[m.qj]}²
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Caption */}
      <div
        aria-live="polite"
        className="mt-3 min-h-[3.5rem] rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm leading-relaxed text-fg"
      >
        {caption}
      </div>

      {/* Controls */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-bg-elevated px-2.5 py-1 text-xs font-semibold text-fg hover:bg-bg-soft disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Πίσω
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(TOTAL - 1, s + 1))}
            disabled={step === TOTAL - 1}
            className="inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent hover:bg-accent/15 disabled:opacity-40"
          >
            Επόμενο <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setStep(0)}
            className="ml-1 inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] font-semibold text-fg-muted hover:bg-bg-soft"
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setStep(0)}
            className={cn(
              'rounded px-2 py-1 text-[11px] font-semibold',
              phase === 'intro' ? 'bg-fg/10 text-fg' : 'text-fg-muted hover:bg-bg-soft',
            )}
          >
            Εισαγωγή
          </button>
          <button
            type="button"
            onClick={() => setStep(1)}
            className={cn(
              'rounded px-2 py-1 text-[11px] font-semibold',
              phase === 'build' ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300' : 'text-fg-muted hover:bg-bg-soft',
            )}
          >
            Φάση 1
          </button>
          <button
            type="button"
            onClick={() => setStep(N_BUILD + 2)}
            className={cn(
              'rounded px-2 py-1 text-[11px] font-semibold',
              phase === 'query' ? 'bg-sky-500/15 text-sky-700 dark:text-sky-300' : 'text-fg-muted hover:bg-bg-soft',
            )}
          >
            Φάση 2
          </button>
          <button
            type="button"
            onClick={() => setStep(TOTAL - 1)}
            className={cn(
              'rounded px-2 py-1 text-[11px] font-semibold',
              phase === 'done' ? 'bg-success/15 text-success' : 'text-fg-muted hover:bg-bg-soft',
            )}
          >
            Τέλος
          </button>
        </div>
      </div>
    </section>
  )
}
