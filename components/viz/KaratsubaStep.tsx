'use client'

/**
 * KaratsubaStep — walk Karatsuba's trick on a concrete 4-digit example.
 *
 * The page presents the identity (α+β)(γ+δ) = αγ+αδ+βγ+βδ as algebra and
 * declares «αδ+βγ = z₃ − z₁ − z₂». Students follow the symbols, then
 * look up and can't tell what just happened. The viz computes both
 * sides on real numbers — α = 13, β = 57, γ = 24, δ = 68 by default — so
 * the moment of substitution is visible: z₃ shrinks by exactly z₁+z₂
 * and the leftover IS αδ+βγ. Step it forward and the assembled product
 * lands on the lecture's 1357 · 2468 = 3 349 076. Built for L04.
 */

import { useMemo, useState } from 'react'
import { RotateCcw, ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

type Preset = {
  id: string
  label: string
  x: number
  y: number
}

const PRESETS: Preset[] = [
  { id: 'lecture', label: '1357 × 2468 (διάλεξη)', x: 1357, y: 2468 },
  { id: 'palindromic', label: '1234 × 4321', x: 1234, y: 4321 },
  { id: 'big', label: '9876 × 5432', x: 9876, y: 5432 },
]

/** Split a 4-digit n into (α, β) where x = α·100 + β; m = 2. */
function split(n: number, m = 2): { hi: number; lo: number } {
  const p = 10 ** m
  return { hi: Math.floor(n / p), lo: n % p }
}

type StepInfo = {
  id: string
  title: string
  body: (data: ReturnType<typeof computeAll>) => React.ReactNode
}

function computeAll(x: number, y: number) {
  const m = 2 // we standardize on 4-digit × 4-digit, m = n/2 = 2
  const { hi: a, lo: b } = split(x, m)
  const { hi: g, lo: d } = split(y, m)
  const z1 = a * g
  const z2 = b * d
  const sumAB = a + b
  const sumGD = g + d
  const z3 = sumAB * sumGD
  const middleFromTrick = z3 - z1 - z2
  const middleFromDirect = a * d + b * g
  const result = z1 * 10 ** (2 * m) + middleFromTrick * 10 ** m + z2
  const truth = x * y
  return {
    x,
    y,
    m,
    a,
    b,
    g,
    d,
    z1,
    z2,
    sumAB,
    sumGD,
    z3,
    middleFromTrick,
    middleFromDirect,
    result,
    truth,
  }
}

function fmt(n: number): string {
  return n.toLocaleString('en-US').replace(/,/g, ' ')
}

function Pill({ children, tone }: { children: React.ReactNode; tone: 'a' | 'b' | 'g' | 'd' | 'z1' | 'z2' | 'z3' | 'm' | 'final' }) {
  const map: Record<typeof tone, string> = {
    a: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/40',
    b: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/40',
    g: 'bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/40',
    d: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40',
    z1: 'bg-rose-500/10 text-rose-600 dark:text-rose-300 border-rose-500/40',
    z2: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/40',
    z3: 'bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-500/40',
    m: 'bg-accent/15 text-accent border-accent/40',
    final: 'bg-accent/25 text-accent border-accent',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[12px] font-semibold',
        map[tone],
      )}
    >
      {children}
    </span>
  )
}

const STEPS: StepInfo[] = [
  {
    id: 'split',
    title: 'Σπάσε τα ψηφία στα δύο μισά',
    body: (d) => (
      <div className="space-y-2 text-sm">
        <div>
          Με <span className="font-mono">m = {d.m}</span>, χωρίζουμε καθένα στα{' '}
          <span className="font-mono">{d.m}</span> πρώτα και τα{' '}
          <span className="font-mono">{d.m}</span> τελευταία ψηφία.
        </div>
        <div className="rounded border border-border bg-bg/50 p-2 font-mono text-[13px]">
          <div>
            {d.x} = <Pill tone="a">α = {d.a}</Pill> · 10² + <Pill tone="b">β = {d.b}</Pill>
          </div>
          <div className="mt-0.5">
            {d.y} = <Pill tone="g">γ = {d.g}</Pill> · 10² + <Pill tone="d">δ = {d.d}</Pill>
          </div>
        </div>
        <div className="text-xs text-fg-muted">
          Στόχος: το γινόμενο <span className="font-mono">{d.x} · {d.y}</span> με{' '}
          <strong>3</strong> πολλαπλασιασμούς μικρότερων αριθμών, όχι 4.
        </div>
      </div>
    ),
  },
  {
    id: 'z1',
    title: 'Πρώτος πολλαπλασιασμός: z₁ = α · γ',
    body: (d) => (
      <div className="space-y-2 text-sm">
        <div className="font-mono">
          <Pill tone="z1">z₁</Pill> = <Pill tone="a">α</Pill> · <Pill tone="g">γ</Pill> = {d.a} · {d.g} ={' '}
          <Pill tone="z1">{d.z1}</Pill>
        </div>
        <div className="text-xs text-fg-muted">
          Αυτό το γινόμενο θα γίνει το «μεγάλο» μέρος του αποτελέσματος — πολλαπλασιάζεται με{' '}
          <span className="font-mono">10²ᵐ = 10⁴</span> στη συναρμολόγηση.
        </div>
      </div>
    ),
  },
  {
    id: 'z2',
    title: 'Δεύτερος πολλαπλασιασμός: z₂ = β · δ',
    body: (d) => (
      <div className="space-y-2 text-sm">
        <div className="font-mono">
          <Pill tone="z2">z₂</Pill> = <Pill tone="b">β</Pill> · <Pill tone="d">δ</Pill> = {d.b} · {d.d} ={' '}
          <Pill tone="z2">{d.z2}</Pill>
        </div>
        <div className="text-xs text-fg-muted">
          Αυτό θα γίνει το «μικρό» μέρος — μπαίνει χωρίς μετατόπιση στη συναρμολόγηση.
        </div>
      </div>
    ),
  },
  {
    id: 'z3',
    title: 'Τρίτος πολλαπλασιασμός: z₃ = (α + β)(γ + δ)',
    body: (d) => (
      <div className="space-y-2 text-sm">
        <div className="font-mono">
          <Pill tone="a">α</Pill> + <Pill tone="b">β</Pill> = {d.a} + {d.b} = <span className="font-bold">{d.sumAB}</span>
        </div>
        <div className="font-mono">
          <Pill tone="g">γ</Pill> + <Pill tone="d">δ</Pill> = {d.g} + {d.d} = <span className="font-bold">{d.sumGD}</span>
        </div>
        <div className="font-mono">
          <Pill tone="z3">z₃</Pill> = ({d.sumAB})({d.sumGD}) = <Pill tone="z3">{d.z3}</Pill>
        </div>
        <div className="rounded border border-violet-500/30 bg-violet-500/5 p-2 text-xs">
          <strong>Παρατήρηση.</strong> Αναπτύσσοντας τον τύπο: ({d.a}+{d.b})({d.g}+{d.d}) ={' '}
          αγ + αδ + βγ + βδ = <span className="font-mono">{d.a * d.g}</span> +{' '}
          <span className="font-mono">{d.a * d.d}</span> + <span className="font-mono">{d.b * d.g}</span>{' '}
          + <span className="font-mono">{d.b * d.d}</span> = {d.z3}.
          {' '}Μέσα του κρύβονται και τα τέσσερα γινόμενα — τα δύο που θέλουμε και τα δύο μεσαία.
        </div>
      </div>
    ),
  },
  {
    id: 'middle',
    title: 'Τραβάμε έξω το μεσαίο: z₃ − z₁ − z₂',
    body: (d) => (
      <div className="space-y-2 text-sm">
        <div className="font-mono">
          <Pill tone="m">μεσαίο</Pill> = <Pill tone="z3">z₃</Pill> − <Pill tone="z1">z₁</Pill> −{' '}
          <Pill tone="z2">z₂</Pill> = {d.z3} − {d.z1} − {d.z2} = <Pill tone="m">{d.middleFromTrick}</Pill>
        </div>
        <div className="rounded border border-emerald-500/40 bg-emerald-500/10 p-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
            <Check className="h-3.5 w-3.5" /> Έλεγχος ταυτότητας
          </div>
          <div className="mt-1 font-mono text-[12.5px]">
            αδ + βγ = ({d.a})({d.d}) + ({d.b})({d.g}) = {d.a * d.d} + {d.b * d.g} ={' '}
            <span className="font-bold">{d.middleFromDirect}</span>
          </div>
          <div className="mt-0.5 text-fg">
            {d.middleFromDirect === d.middleFromTrick ? (
              <>
                Οι δύο τρόποι δίνουν τον <em>ίδιο</em> αριθμό — {d.middleFromTrick}. Πληρώσαμε{' '}
                <strong>μία</strong> αφαίρεση αντί για έναν πολλαπλασιασμό.
              </>
            ) : (
              <>Σφάλμα — οι δύο πλευρές δεν συμφωνούν.</>
            )}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'assemble',
    title: 'Συναρμολόγηση: x · y = z₁·10²ᵐ + μεσαίο·10ᵐ + z₂',
    body: (d) => {
      const shift2m = d.z1 * 10 ** (2 * d.m)
      const shiftM = d.middleFromTrick * 10 ** d.m
      return (
        <div className="space-y-2 text-sm">
          <div className="space-y-0.5 font-mono text-[13px]">
            <div>
              <Pill tone="z1">z₁</Pill> · 10⁴ = {d.z1} · 10⁴ ={' '}
              <span className="font-semibold">{fmt(shift2m)}</span>
            </div>
            <div>
              <Pill tone="m">μεσαίο</Pill> · 10² = {d.middleFromTrick} · 10² ={' '}
              <span className="font-semibold">{fmt(shiftM)}</span>
            </div>
            <div>
              <Pill tone="z2">z₂</Pill> = <span className="font-semibold">{fmt(d.z2)}</span>
            </div>
            <div className="border-t border-fg/20 pt-1">
              άθροισμα = <Pill tone="final">{fmt(d.result)}</Pill>
            </div>
          </div>
          {d.result === d.truth ? (
            <div className="rounded border border-emerald-500/40 bg-emerald-500/10 p-2 text-xs">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
                <Check className="h-3.5 w-3.5" /> Επαλήθευση
              </div>
              <div className="mt-0.5 font-mono">
                {d.x} · {d.y} = {fmt(d.truth)} — ταιριάζει.
              </div>
            </div>
          ) : (
            <div className="rounded border border-rose-500/40 bg-rose-500/10 p-2 text-xs">
              Σφάλμα — Karatsuba {fmt(d.result)} ≠ {fmt(d.truth)}.
            </div>
          )}
          <div className="text-xs text-fg-muted">
            Χρησιμοποιήσαμε <strong>3</strong> πολλαπλασιασμούς (z₁, z₂, z₃) αντί για 4 — αυτό
            είναι όλο το κέρδος. Οι προσθέσεις/αφαιρέσεις/μετατοπίσεις κοστίζουν{' '}
            <span className="font-mono">O(n)</span>.
          </div>
        </div>
      )
    },
  },
]

export function KaratsubaStep() {
  const [presetIdx, setPresetIdx] = useState(0)
  const [step, setStep] = useState(0)

  const data = useMemo(
    () => computeAll(PRESETS[presetIdx].x, PRESETS[presetIdx].y),
    [presetIdx],
  )

  function pickPreset(i: number) {
    setPresetIdx(i)
    setStep(0)
  }

  const cur = STEPS[step]

  return (
    <div className="my-6 rounded-2xl border border-border bg-bg-elevated p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent">
          Πολλαπλασιασμός
        </span>
        <span className="text-sm font-semibold">Karatsuba — βήμα-βήμα στην ίδια πράξη</span>
      </div>

      {/* preset row */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.id}
            onClick={() => pickPreset(i)}
            className={cn(
              'rounded-lg border px-2.5 py-1.5 text-xs font-semibold',
              presetIdx === i
                ? 'border-accent bg-accent/15 text-accent'
                : 'border-border bg-bg-elevated hover:bg-bg',
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1.1fr]">
        {/* permanent state board */}
        <div className="rounded-xl border border-border bg-bg/40 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
            Στιγμιότυπο
          </div>
          <div className="mt-2 space-y-1.5 font-mono text-[12.5px]">
            <div className="flex items-center gap-2">
              <span className="w-10 text-fg-muted">x =</span>
              <span>{data.x}</span>
              <span className="text-fg-muted">→</span>
              <Pill tone="a">α={data.a}</Pill>
              <Pill tone="b">β={data.b}</Pill>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-10 text-fg-muted">y =</span>
              <span>{data.y}</span>
              <span className="text-fg-muted">→</span>
              <Pill tone="g">γ={data.g}</Pill>
              <Pill tone="d">δ={data.d}</Pill>
            </div>
            <hr className="my-1 border-border/60" />
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="w-10 text-fg-muted">z₁ =</span>
              {step >= 1 ? <Pill tone="z1">{data.z1}</Pill> : <span className="text-fg-muted">—</span>}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="w-10 text-fg-muted">z₂ =</span>
              {step >= 2 ? <Pill tone="z2">{data.z2}</Pill> : <span className="text-fg-muted">—</span>}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="w-10 text-fg-muted">z₃ =</span>
              {step >= 3 ? <Pill tone="z3">{data.z3}</Pill> : <span className="text-fg-muted">—</span>}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="w-10 text-fg-muted">μεσ. =</span>
              {step >= 4 ? (
                <Pill tone="m">{data.middleFromTrick}</Pill>
              ) : (
                <span className="text-fg-muted">—</span>
              )}
            </div>
            <hr className="my-1 border-border/60" />
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="w-10 text-fg-muted">x·y =</span>
              {step >= 5 ? (
                <Pill tone="final">{fmt(data.result)}</Pill>
              ) : (
                <span className="text-fg-muted">—</span>
              )}
            </div>
          </div>

          {/* identity panel (always visible once z's are set) */}
          {step >= 4 && (
            <div className="mt-3 rounded border border-violet-500/30 bg-violet-500/5 p-2 text-[11px]">
              <div className="font-semibold">Η ταυτότητα-κλειδί</div>
              <div className="mt-0.5 font-mono">
                αδ + βγ = z₃ − z₁ − z₂ = {data.middleFromTrick}
              </div>
              <div className="mt-0.5 text-fg-muted">
                3 πολλαπλασιασμοί (z₁, z₂, z₃) + λίγες προσθαφαιρέσεις παράγουν και τα 4 γινόμενα
                της αφελούς διάσπασης.
              </div>
            </div>
          )}
        </div>

        {/* per-step pane */}
        <div className="rounded-xl border border-border bg-bg/40 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
            Βήμα {step + 1} / {STEPS.length}
          </div>
          <div className="mt-1 text-sm font-semibold">{cur.title}</div>
          <div className="mt-2">{cur.body(data)}</div>
        </div>
      </div>

      {/* controls */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setStep(0)}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-elevated px-3 py-1.5 text-xs font-semibold hover:bg-bg"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Από την αρχή
        </button>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-bg-elevated px-3 py-1.5 text-xs font-semibold hover:bg-bg disabled:opacity-50"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Πίσω
        </button>
        <button
          onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
          className="inline-flex items-center gap-1 rounded-lg border border-accent/40 bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/25 disabled:opacity-50"
        >
          Επόμενο
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
