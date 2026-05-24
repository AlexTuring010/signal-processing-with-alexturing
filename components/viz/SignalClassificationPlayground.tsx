'use client'

import { useEffect, useRef, useState } from 'react'
import { getThemeColors, setupCanvas, lerp } from '@/lib/canvas'
import { cn } from '@/lib/utils'

/**
 * The «ταξινομία sandbox»: student picks a signal from a curated library,
 * the viz shows the time-domain plot and turns on all 6 classification badges
 * that slide 4 lists (Συνεχούς/Διακριτού · Πραγματικό/Μιγαδικό · Άρτιο/Περιττό
 * · Αιτιατό · Περιοδικό · Ενέργειας/Ισχύος). Per-badge «γιατί;» justification
 * is rendered on hover/focus.
 *
 * Why this viz exists: the prof's slide-4 classification list is the spine of
 * the lecture, but in static prose each badge sits in its own sub-section and
 * the student never sees them all activated at once for a single signal. This
 * viz consolidates the chapter: ένα σήμα → 6 ετικέτες ταυτόχρονα.
 */

type Symmetry = 'even' | 'odd' | 'neither'
type EnergyPower = 'energy' | 'power' | 'neither'

type Classification = {
  time: 'continuous' | 'discrete'
  values: 'real' | 'complex'
  symmetry: Symmetry
  causal: boolean
  periodic: { yes: boolean; period?: string }
  ep: EnergyPower
  E?: string
  P?: string
}

type Reasons = {
  value: string
  time: string
  values: string
  symmetry: string
  causal: string
  periodic: string
  ep: string
}

type SignalSpec = {
  id: string
  label: string
  formula: string
  fn: (t: number) => number
  /** Optional imag part for complex signals — used for plot only. */
  fnImag?: (t: number) => number
  classification: Classification
  reasons: Reasons
}

const SIGNALS: SignalSpec[] = [
  {
    id: 'cos',
    label: 'cos(2π t)',
    formula: '\\cos(2\\pi t)',
    fn: (t) => Math.cos(2 * Math.PI * t),
    classification: {
      time: 'continuous',
      values: 'real',
      symmetry: 'even',
      causal: false,
      periodic: { yes: true, period: 'T = 1' },
      ep: 'power',
      P: 'A²/2 = 1/2',
    },
    reasons: {
      value: 'Καθαρό cosine — η canonical δοκιμαστική περίπτωση.',
      time: 'Ορίζεται για κάθε πραγματικό t.',
      values: 'cos παίρνει μόνο πραγματικές τιμές στο [−1, 1].',
      symmetry: 'cos(−t) = cos(t) → άρτιο.',
      causal: 'cos είναι ορισμένο για κάθε t — συμπεριλαμβανομένων αρνητικών χρόνων, άρα όχι αιτιατό.',
      periodic: 'cos(2π(t + 1)) = cos(2π t + 2π) = cos(2π t). Θεμελιώδης περίοδος T = 1 s.',
      ep: 'Η ενέργεια αποκλίνει (ταλάντωση στο άπειρο), αλλά η μέση ισχύς είναι πεπερασμένη και θετική. Άρα power signal.',
    },
  },
  {
    id: 'sin',
    label: 'sin(2π t)',
    formula: '\\sin(2\\pi t)',
    fn: (t) => Math.sin(2 * Math.PI * t),
    classification: {
      time: 'continuous',
      values: 'real',
      symmetry: 'odd',
      causal: false,
      periodic: { yes: true, period: 'T = 1' },
      ep: 'power',
      P: 'A²/2 = 1/2',
    },
    reasons: {
      value: 'cosine ολισθημένο κατά π/2.',
      time: 'Ορίζεται για κάθε πραγματικό t.',
      values: 'Όλες οι τιμές πραγματικές στο [−1, 1].',
      symmetry: 'sin(−t) = −sin(t) → περιττό.',
      causal: 'Δεν είναι μηδέν για t < 0.',
      periodic: 'Ίδια θεμελιώδης περίοδος με cos — T = 1.',
      ep: 'Ίδια λογική με cos: ενέργεια άπειρη, μέση ισχύς A²/2.',
    },
  },
  {
    id: 'rect',
    label: 'Π(t/2)',
    formula: '\\Pi(t/2)',
    fn: (t) => (Math.abs(t) <= 1 ? 1 : 0),
    classification: {
      time: 'continuous',
      values: 'real',
      symmetry: 'even',
      causal: false,
      periodic: { yes: false },
      ep: 'energy',
      E: '2',
    },
    reasons: {
      value: 'Πεπερασμένης διάρκειας ορθογώνιος παλμός — ο πρωτότυπος «τοπικά εστιασμένος» στιγμιότυπο.',
      time: 'Ορίζεται για κάθε t (μηδέν εκτός [−1, 1]).',
      values: 'Παίρνει τιμές 0 ή 1.',
      symmetry: 'Π(−t/2) = Π(t/2) — συμμετρικός γύρω από t = 0.',
      causal: 'Έχει μη μηδενική τιμή για t ∈ [−1, 0) — άρα όχι αιτιατό.',
      periodic: 'Παλμός μίας μόνο φοράς — δεν επαναλαμβάνεται.',
      ep: '∫|x|² dt = ∫_{−1}^{1} 1 dt = 2 → πεπερασμένη ενέργεια. Energy signal.',
    },
  },
  {
    id: 'expU',
    label: 'e^(−t) · u(t)',
    formula: 'e^{-t} u(t)',
    fn: (t) => (t >= 0 ? Math.exp(-t) : 0),
    classification: {
      time: 'continuous',
      values: 'real',
      symmetry: 'neither',
      causal: true,
      periodic: { yes: false },
      ep: 'energy',
      E: '1/2',
    },
    reasons: {
      value: 'Το κλασικό «causal φθίνον εκθετικό» — εμφανίζεται σε impulse response, χρόνο πτώσης, RC δίκτυα.',
      time: 'Ορίζεται για κάθε t (μηδέν για t < 0).',
      values: 'Πραγματικές τιμές (≥ 0).',
      symmetry: 'Ένα μέρος του είναι 0, το άλλο φθίνον εκθετικό — ούτε άρτιο ούτε περιττό. Σπάει σε άρτιο + περιττό μέρος.',
      causal: 'x(t) = 0 για κάθε t < 0 — επομένως αιτιατό. Το u(t) είναι ο «διακόπτης».',
      periodic: 'Φθίνει μονότονα στο 0 — όχι επανάληψη.',
      ep: '∫₀^∞ e^{−2t} dt = 1/2 — πεπερασμένη ενέργεια. Energy signal.',
    },
  },
  {
    id: 'ramp',
    label: 't · u(t)',
    formula: 't \\cdot u(t)',
    fn: (t) => (t >= 0 ? t : 0),
    classification: {
      time: 'continuous',
      values: 'real',
      symmetry: 'neither',
      causal: true,
      periodic: { yes: false },
      ep: 'neither',
    },
    reasons: {
      value: 'Η ράμπα — το «μη-φραγμένο μετά την έναρξη» παράδειγμα.',
      time: 'Ορίζεται για κάθε t.',
      values: 'Πραγματικές τιμές (≥ 0).',
      symmetry: 'Ίδια λογική με e^{−t}u(t) — ένα μέρος μηδέν, άλλο μέρος γραμμικό.',
      causal: 'Μηδέν για t < 0.',
      periodic: 'Αυξάνεται γραμμικά → όχι επανάληψη.',
      ep: 'E = ∫₀^∞ t² dt = ∞. P = lim (1/2T)∫_{0}^{T} t² dt = lim T²/24 = ∞. Ούτε ενέργειας, ούτε ισχύος.',
    },
  },
  {
    id: 'expAbs',
    label: 'e^(−|t|)',
    formula: 'e^{-|t|}',
    fn: (t) => Math.exp(-Math.abs(t)),
    classification: {
      time: 'continuous',
      values: 'real',
      symmetry: 'even',
      causal: false,
      periodic: { yes: false },
      ep: 'energy',
      E: '1',
    },
    reasons: {
      value: 'Δύο-πλευρο φθίνον εκθετικό — εμφανίζεται σε bandpass θόρυβο autocorrelation, Laplace filter responses.',
      time: 'Ορίζεται για κάθε t.',
      values: 'Πραγματικές τιμές (≥ 0).',
      symmetry: '|−t| = |t| → e^{−|−t|} = e^{−|t|}. Άρτιο.',
      causal: 'Όχι — έχει μη μηδενικές τιμές για t < 0.',
      periodic: 'Φθίνει στο 0 και προς τα δύο άπειρα.',
      ep: 'E = 2 ∫₀^∞ e^{−2t} dt = 2 · 1/2 = 1. Energy signal.',
    },
  },
  {
    id: 'irrational-sum',
    label: 'cos(2π t) + cos(2π √2 t)',
    formula: '\\cos(2\\pi t) + \\cos(2\\pi\\sqrt{2}\\,t)',
    fn: (t) => Math.cos(2 * Math.PI * t) + Math.cos(2 * Math.PI * Math.SQRT2 * t),
    classification: {
      time: 'continuous',
      values: 'real',
      symmetry: 'even',
      causal: false,
      periodic: { yes: false },
      ep: 'power',
      P: 'A²/2 + B²/2 = 1',
    },
    reasons: {
      value: 'Δύο cosines με άρρητο λόγο συχνοτήτων — η παγίδα του «μοιάζει περιοδικό αλλά δεν είναι».',
      time: 'Ορίζεται για κάθε t.',
      values: 'Πραγματικές.',
      symmetry: 'Άθροισμα δύο άρτιων → άρτιο.',
      causal: 'Όχι.',
      periodic: 'T₁/T₂ = √2 (άρρητος) → δεν υπάρχει κοινή περίοδος. Δεν είναι περιοδικό.',
      ep: 'Ενέργεια κάθε όρου άπειρη. Ισχύς αθροίσματος: επειδή οι συχνότητες είναι διαφορετικές, οι διασταυρωτικοί όροι μηδενίζονται και P = A²/2 + B²/2 = 1.',
    },
  },
  {
    id: 'complex-exp',
    label: 'e^(j 2π t)',
    formula: 'e^{j 2\\pi t}',
    fn: (t) => Math.cos(2 * Math.PI * t),
    fnImag: (t) => Math.sin(2 * Math.PI * t),
    classification: {
      time: 'continuous',
      values: 'complex',
      symmetry: 'neither',
      causal: false,
      periodic: { yes: true, period: 'T = 1' },
      ep: 'power',
      P: '|A|² = 1',
    },
    reasons: {
      value: 'Το πρώτο μιγαδικό σήμα. Phasor που στρίβει με γωνιακή ταχύτητα 2π. Η γλώσσα των LTI συστημάτων.',
      time: 'Ορίζεται για κάθε t.',
      values: 'Μιγαδικές τιμές: Re = cos(2π t), Im = sin(2π t).',
      symmetry: 'e^{−j 2π t} = συζυγής του e^{j 2π t} — όχι άρτιο ούτε περιττό. (Για μιγαδικά συχνά μιλάμε για conjugate symmetry αντί άρτιο/περιττό.)',
      causal: 'Όχι.',
      periodic: 'e^{j 2π(t+1)} = e^{j 2π t} · e^{j 2π} = e^{j 2π t}. T = 1.',
      ep: '|x(t)|² = 1 για κάθε t → P = 1. Energy = ∞.',
    },
  },
  {
    id: 'discrete-cos-pi3',
    label: 'cos(π n / 3) — διακριτό',
    formula: '\\cos\\!\\left(\\tfrac{\\pi n}{3}\\right)',
    fn: (n) => Math.cos((Math.PI * n) / 3),
    classification: {
      time: 'discrete',
      values: 'real',
      symmetry: 'even',
      causal: false,
      periodic: { yes: true, period: 'N = 6' },
      ep: 'power',
      P: '1/2',
    },
    reasons: {
      value: 'Διακριτό cosine. Προσοχή: στο διακριτό η περιοδικότητα έχει αυστηρότερη συνθήκη.',
      time: 'Ορίζεται μόνο σε ακεραίους n.',
      values: 'Πραγματικές.',
      symmetry: 'cos(−πn/3) = cos(πn/3) → άρτιο.',
      causal: 'Όχι.',
      periodic: 'ω = π/3 → 2π/ω = 6 — ρητός & ακέραιος. Άρα N = 6: cos(π(n+6)/3) = cos(πn/3 + 2π) = cos(πn/3). ✓',
      ep: 'Discrete power: lim (1/(2M+1)) Σ |x[n]|² = 1/2.',
    },
  },
  {
    id: 'discrete-cos-quarter',
    label: 'cos(n/4) — διακριτό',
    formula: '\\cos\\!\\left(\\tfrac{n}{4}\\right)',
    fn: (n) => Math.cos(n / 4),
    classification: {
      time: 'discrete',
      values: 'real',
      symmetry: 'even',
      causal: false,
      periodic: { yes: false },
      ep: 'power',
      P: '1/2',
    },
    reasons: {
      value: 'Η παγίδα του prof (slide 12). Στο συνεχές το cos(t/4) ΕΙΝΑΙ περιοδικό. Στο διακριτό; ΟΧΙ.',
      time: 'Ορίζεται μόνο σε ακεραίους n.',
      values: 'Πραγματικές.',
      symmetry: 'cos(−n/4) = cos(n/4) → άρτιο.',
      causal: 'Όχι.',
      periodic: 'Για περιοδικό: ωN = 2πm → N = 2πm · 4 = 8πm. Επειδή π άρρητο, δεν υπάρχει m ∈ ℕ με N ∈ ℕ. ΟΧΙ περιοδικό!',
      ep: 'Παρόλο που δεν είναι περιοδικό, η μακροπρόθεσμη μέση τιμή του |x|² είναι 1/2 (cos² ισοκαταν.). Power signal.',
    },
  },
]

const SYMMETRY_LABEL: Record<Symmetry, string> = {
  even: 'Άρτιο',
  odd: 'Περιττό',
  neither: 'Ούτε',
}

const EP_LABEL: Record<EnergyPower, string> = {
  energy: 'Ενέργειας',
  power: 'Ισχύος',
  neither: 'Ούτε-ούτε',
}

export function SignalClassificationPlayground() {
  const [id, setId] = useState<string>('cos')
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [showWhy, setShowWhy] = useState<keyof Reasons | null>(null)

  const sig = SIGNALS.find((s) => s.id === id) ?? SIGNALS[0]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const colors = getThemeColors()
    if (!colors) return
    draw(canvas, colors, sig)
  }, [sig])

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold tracking-tight">
          Ταξινόμηση σήματος — έξι ετικέτες ταυτόχρονα
        </h4>
        <span className="text-[11px] text-fg-subtle">
          Διάλεξε σήμα, πάτησε «γιατί;» σε κάθε ετικέτα.
        </span>
      </div>

      <p className="mb-3 text-xs text-fg-muted">
        Ο prof στη <strong>slide 4</strong> δίνει την κανονική λίστα κατηγοριών. Δοκίμασε ένα σήμα από
        τη βιβλιοθήκη και δες πώς ανάβουν οι ετικέτες — μερικές παγίδες (όπως το cos(n/4) που είναι
        περιοδικό στο συνεχές αλλά <strong>όχι</strong> στο διακριτό) είναι ακριβώς αυτές που πέφτουν
        στις εξετάσεις.
      </p>

      {/* Signal picker */}
      <div
        role="radiogroup"
        aria-label="Επιλογή σήματος"
        className="mb-3 flex flex-wrap items-center gap-1 rounded-md border border-border bg-bg-soft p-1 text-[11px]"
      >
        {SIGNALS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={id === s.id}
            onClick={() => {
              setId(s.id)
              setShowWhy(null)
            }}
            className={cn(
              'rounded px-2 py-0.5 transition-colors',
              id === s.id ? 'bg-accent text-accent-fg' : 'text-fg-muted hover:text-fg',
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
        {/* Plot column */}
        <div>
          <div className="mb-2 rounded-md border border-accent/30 bg-accent-soft/10 px-3 py-2 text-center">
            <code className="font-mono text-[0.95rem]">x(t) = {sig.label}</code>
          </div>
          <canvas
            ref={canvasRef}
            style={{ height: 200 }}
            className="block h-[200px] w-full rounded-md border border-border bg-bg-soft/30"
            aria-label={`Time-domain plot of ${sig.label}`}
          />
          <div className="mt-2 rounded-md border border-border bg-bg-soft/40 px-3 py-2 text-[0.85rem] text-fg-muted">
            <strong className="text-fg">Τι είναι:</strong> {sig.reasons.value}
          </div>
        </div>

        {/* Classification badges */}
        <div className="space-y-1.5">
          <Badge
            label="Συνεχούς / Διακριτού χρόνου"
            value={sig.classification.time === 'continuous' ? 'Συνεχούς' : 'Διακριτού'}
            tone={sig.classification.time === 'continuous' ? 'info' : 'warn'}
            why={sig.reasons.time}
            isOpen={showWhy === 'time'}
            onToggle={() => setShowWhy(showWhy === 'time' ? null : 'time')}
          />
          <Badge
            label="Πραγματικό / Μιγαδικό"
            value={sig.classification.values === 'real' ? 'Πραγματικό' : 'Μιγαδικό'}
            tone={sig.classification.values === 'real' ? 'info' : 'accent'}
            why={sig.reasons.values}
            isOpen={showWhy === 'values'}
            onToggle={() => setShowWhy(showWhy === 'values' ? null : 'values')}
          />
          <Badge
            label="Άρτιο / Περιττό"
            value={SYMMETRY_LABEL[sig.classification.symmetry]}
            tone={
              sig.classification.symmetry === 'even'
                ? 'success'
                : sig.classification.symmetry === 'odd'
                  ? 'warn'
                  : 'neutral'
            }
            why={sig.reasons.symmetry}
            isOpen={showWhy === 'symmetry'}
            onToggle={() => setShowWhy(showWhy === 'symmetry' ? null : 'symmetry')}
          />
          <Badge
            label="Αιτιατό;"
            value={sig.classification.causal ? 'Ναι (causal)' : 'Όχι (non-causal)'}
            tone={sig.classification.causal ? 'success' : 'neutral'}
            why={sig.reasons.causal}
            isOpen={showWhy === 'causal'}
            onToggle={() => setShowWhy(showWhy === 'causal' ? null : 'causal')}
          />
          <Badge
            label="Περιοδικό;"
            value={
              sig.classification.periodic.yes
                ? `Ναι · ${sig.classification.periodic.period}`
                : 'Όχι'
            }
            tone={sig.classification.periodic.yes ? 'success' : 'neutral'}
            why={sig.reasons.periodic}
            isOpen={showWhy === 'periodic'}
            onToggle={() => setShowWhy(showWhy === 'periodic' ? null : 'periodic')}
          />
          <Badge
            label="Ενέργειας / Ισχύος"
            value={
              EP_LABEL[sig.classification.ep] +
              (sig.classification.E ? ` · E = ${sig.classification.E}` : '') +
              (sig.classification.P ? ` · P = ${sig.classification.P}` : '')
            }
            tone={
              sig.classification.ep === 'energy'
                ? 'success'
                : sig.classification.ep === 'power'
                  ? 'info'
                  : 'danger'
            }
            why={sig.reasons.ep}
            isOpen={showWhy === 'ep'}
            onToggle={() => setShowWhy(showWhy === 'ep' ? null : 'ep')}
          />
        </div>
      </div>
    </figure>
  )
}

type Tone = 'info' | 'success' | 'warn' | 'danger' | 'accent' | 'neutral'

const TONE_CLASSES: Record<Tone, string> = {
  info: 'border-blue-400/50 bg-blue-400/10 text-blue-800 dark:text-blue-200',
  success: 'border-emerald-400/50 bg-emerald-400/10 text-emerald-800 dark:text-emerald-200',
  warn: 'border-amber-400/50 bg-amber-400/10 text-amber-800 dark:text-amber-200',
  danger: 'border-rose-400/50 bg-rose-400/10 text-rose-800 dark:text-rose-200',
  accent: 'border-fuchsia-400/50 bg-fuchsia-400/10 text-fuchsia-800 dark:text-fuchsia-200',
  neutral: 'border-slate-400/50 bg-slate-400/10 text-slate-700 dark:text-slate-200',
}

function Badge({
  label,
  value,
  tone,
  why,
  isOpen,
  onToggle,
}: {
  label: string
  value: string
  tone: Tone
  why: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="rounded-md border border-border bg-bg-soft/40 px-3 py-2">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-fg-subtle">
          {label}
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          className="text-[11px] text-fg-muted underline-offset-2 hover:text-fg hover:underline"
        >
          {isOpen ? 'κλείσε' : 'γιατί;'}
        </button>
      </div>
      <div
        className={cn(
          'mt-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.85rem] font-semibold',
          TONE_CLASSES[tone],
        )}
      >
        {value}
      </div>
      {isOpen && (
        <p className="mt-2 text-[0.85rem] leading-relaxed text-fg-muted">{why}</p>
      )}
    </div>
  )
}

function draw(
  canvas: HTMLCanvasElement,
  colors: ReturnType<typeof getThemeColors>,
  sig: SignalSpec,
) {
  if (!colors) return
  const { ctx, w, h } = setupCanvas(canvas)
  ctx.clearRect(0, 0, w, h)

  const isDiscrete = sig.classification.time === 'discrete'

  // Axis range
  const tMin = isDiscrete ? -10 : -3
  const tMax = isDiscrete ? 10 : 3

  // Find y range from sampled values
  const samples: number[] = []
  if (isDiscrete) {
    for (let n = Math.floor(tMin); n <= Math.ceil(tMax); n++) samples.push(sig.fn(n))
  } else {
    for (let i = 0; i <= 400; i++) {
      const t = lerp(i, 0, 400, tMin, tMax)
      samples.push(sig.fn(t))
      if (sig.fnImag) samples.push(sig.fnImag(t))
    }
  }
  const ymin0 = Math.min(...samples, -0.1)
  const ymax0 = Math.max(...samples, 0.1)
  const pad = (ymax0 - ymin0) * 0.15
  const ymin = ymin0 - pad
  const ymax = ymax0 + pad

  const padding = { top: 12, right: 8, bottom: 22, left: 32 }
  const plotX = padding.left
  const plotY = padding.top
  const plotW = w - padding.left - padding.right
  const plotH = h - padding.top - padding.bottom

  // axes
  ctx.strokeStyle = colors.border
  ctx.lineWidth = 1
  ctx.strokeRect(plotX + 0.5, plotY + 0.5, plotW - 1, plotH - 1)

  const yZero = lerp(0, ymax, ymin, plotY, plotY + plotH)
  ctx.strokeStyle = colors.fgSubtle
  ctx.setLineDash([2, 4])
  ctx.beginPath()
  ctx.moveTo(plotX, yZero)
  ctx.lineTo(plotX + plotW, yZero)
  ctx.stroke()
  ctx.setLineDash([])

  // x = 0 vertical
  const xZero = lerp(0, tMin, tMax, plotX, plotX + plotW)
  ctx.beginPath()
  ctx.moveTo(xZero, plotY)
  ctx.lineTo(xZero, plotY + plotH)
  ctx.stroke()

  // labels
  ctx.fillStyle = colors.fgSubtle
  ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
  ctx.textAlign = 'right'
  ctx.fillText(ymax.toFixed(1), plotX - 4, plotY + 10)
  ctx.fillText(ymin.toFixed(1), plotX - 4, plotY + plotH - 2)
  ctx.textAlign = 'center'
  ctx.fillText(isDiscrete ? 'n' : 't', plotX + plotW / 2, plotY + plotH + 16)
  ctx.fillText(tMin.toString(), plotX, plotY + plotH + 16)
  ctx.fillText(tMax.toString(), plotX + plotW, plotY + plotH + 16)

  if (isDiscrete) {
    // stems
    for (let n = Math.ceil(tMin); n <= Math.floor(tMax); n++) {
      const v = sig.fn(n)
      const xx = lerp(n, tMin, tMax, plotX, plotX + plotW)
      const yy = lerp(v, ymax, ymin, plotY, plotY + plotH)
      ctx.strokeStyle = colors.accent
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(xx, yZero)
      ctx.lineTo(xx, yy)
      ctx.stroke()
      ctx.fillStyle = colors.accent
      ctx.beginPath()
      ctx.arc(xx, yy, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    // continuous curve
    const drawCurve = (fn: (t: number) => number, color: string, label?: string) => {
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()
      let prevDefined = false
      const steps = 400
      for (let i = 0; i <= steps; i++) {
        const t = lerp(i, 0, steps, tMin, tMax)
        const v = fn(t)
        const xx = lerp(t, tMin, tMax, plotX, plotX + plotW)
        const yy = lerp(v, ymax, ymin, plotY, plotY + plotH)
        const defined = isFinite(v)
        if (!defined) {
          prevDefined = false
          continue
        }
        if (!prevDefined) ctx.moveTo(xx, yy)
        else ctx.lineTo(xx, yy)
        prevDefined = true
      }
      ctx.stroke()
      if (label) {
        ctx.fillStyle = color
        ctx.font = '10px ui-sans-serif, system-ui, sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText(label, plotX + 6, plotY + 14)
      }
    }
    drawCurve(sig.fn, colors.accent, sig.fnImag ? 'Re' : undefined)
    if (sig.fnImag) {
      drawCurve(sig.fnImag, '#0284c7', 'Im')
    }
  }
}
