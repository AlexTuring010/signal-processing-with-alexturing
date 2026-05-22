'use client'

/**
 * DecisionTreeLowerBound — see why Ω(n log n) is unavoidable for comparison sorts.
 *
 * The L03 page sketches the lower-bound proof in one paragraph: «κάθε
 * αλγόριθμος βασισμένος σε συγκρίσεις είναι ένα δέντρο απόφασης· οι n!
 * διατάξεις απαιτούν n! φύλλα· ένα δυαδικό δέντρο με n! φύλλα έχει ύψος
 * Ω(log n!)= Ω(n log n).» That's three concepts piled on top of each
 * other and asks the student to picture all of them at once.
 *
 * The viz takes them one at a time on the simplest non-trivial case, n = 3:
 *
 *   • Tab 1 — «Το δέντρο για n = 3». Six leaves (one per permutation of
 *     a,b,c). Each internal node is a single comparison. The user clicks
 *     a target permutation; the path from root to its leaf lights up,
 *     and the comparison counter ticks 1, 2, 3 — making «ύψος = 3»
 *     visceral.
 *
 *   • Tab 2 — «Γιατί δεν μπορεί να είναι κοντύτερο». An interactive
 *     ledger: n! permutations × 1 leaf each → tree needs ≥ n! leaves;
 *     a binary tree with L leaves has height ≥ ⌈log₂ L⌉; for n=3 that's
 *     ⌈log₂ 6⌉ = 3, matching the picture in Tab 1.
 *
 *   • Tab 3 — «Για κάθε n». Slider n = 2…15; live n!, ⌈log₂(n!)⌉, and
 *     the Stirling asymptotic n·log₂ n. Bar chart shows the lower-bound
 *     growth so the student sees the curve bend toward n log n.
 *
 * Built for L03.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type Tab = 'tree' | 'why' | 'general'

/** A permutation of a,b,c expressed as the sort order. */
type Perm = { id: string; order: string; description: string; path: PathStep[] }
type PathStep = { question: string; answer: 'yes' | 'no' }

/** Decision tree for sorting three elements. Each path = answers from root. */
const PERMUTATIONS: Perm[] = [
  {
    id: 'abc',
    order: 'a < b < c',
    description: 'a μικρότερο, c μεγαλύτερο',
    path: [
      { question: 'a < b ;', answer: 'yes' },
      { question: 'b < c ;', answer: 'yes' },
    ],
  },
  {
    id: 'acb',
    order: 'a < c < b',
    description: 'a μικρότερο, b μεγαλύτερο',
    path: [
      { question: 'a < b ;', answer: 'yes' },
      { question: 'b < c ;', answer: 'no' },
      { question: 'a < c ;', answer: 'yes' },
    ],
  },
  {
    id: 'cab',
    order: 'c < a < b',
    description: 'c μικρότερο, b μεγαλύτερο',
    path: [
      { question: 'a < b ;', answer: 'yes' },
      { question: 'b < c ;', answer: 'no' },
      { question: 'a < c ;', answer: 'no' },
    ],
  },
  {
    id: 'bac',
    order: 'b < a < c',
    description: 'b μικρότερο, c μεγαλύτερο',
    path: [
      { question: 'a < b ;', answer: 'no' },
      { question: 'a < c ;', answer: 'yes' },
    ],
  },
  {
    id: 'bca',
    order: 'b < c < a',
    description: 'b μικρότερο, a μεγαλύτερο',
    path: [
      { question: 'a < b ;', answer: 'no' },
      { question: 'a < c ;', answer: 'no' },
      { question: 'b < c ;', answer: 'yes' },
    ],
  },
  {
    id: 'cba',
    order: 'c < b < a',
    description: 'c μικρότερο, a μεγαλύτερο',
    path: [
      { question: 'a < b ;', answer: 'no' },
      { question: 'a < c ;', answer: 'no' },
      { question: 'b < c ;', answer: 'no' },
    ],
  },
]

/** Tree node positions chosen by hand so the layout is readable. */
type TreeNode = {
  id: string
  x: number
  y: number
  kind: 'q' | 'leaf'
  label: string // question or permutation
  /** the path of yes/no from root that reaches this node */
  pathFromRoot: Array<'yes' | 'no'>
}

const NODE: TreeNode[] = [
  // Level 0
  { id: 'root', x: 400, y: 30, kind: 'q', label: 'a < b ;', pathFromRoot: [] },
  // Level 1
  { id: 'L', x: 200, y: 100, kind: 'q', label: 'b < c ;', pathFromRoot: ['yes'] },
  { id: 'R', x: 600, y: 100, kind: 'q', label: 'a < c ;', pathFromRoot: ['no'] },
  // Level 2
  { id: 'LL', x: 100, y: 170, kind: 'leaf', label: 'a < b < c', pathFromRoot: ['yes', 'yes'] },
  { id: 'LR', x: 300, y: 170, kind: 'q', label: 'a < c ;', pathFromRoot: ['yes', 'no'] },
  { id: 'RL', x: 500, y: 170, kind: 'leaf', label: 'b < a < c', pathFromRoot: ['no', 'yes'] },
  { id: 'RR', x: 700, y: 170, kind: 'q', label: 'b < c ;', pathFromRoot: ['no', 'no'] },
  // Level 3
  { id: 'LRL', x: 250, y: 240, kind: 'leaf', label: 'a < c < b', pathFromRoot: ['yes', 'no', 'yes'] },
  { id: 'LRR', x: 350, y: 240, kind: 'leaf', label: 'c < a < b', pathFromRoot: ['yes', 'no', 'no'] },
  { id: 'RRL', x: 650, y: 240, kind: 'leaf', label: 'b < c < a', pathFromRoot: ['no', 'no', 'yes'] },
  { id: 'RRR', x: 750, y: 240, kind: 'leaf', label: 'c < b < a', pathFromRoot: ['no', 'no', 'no'] },
]

const EDGE: Array<{ from: string; to: string; label: 'yes' | 'no' }> = [
  { from: 'root', to: 'L', label: 'yes' },
  { from: 'root', to: 'R', label: 'no' },
  { from: 'L', to: 'LL', label: 'yes' },
  { from: 'L', to: 'LR', label: 'no' },
  { from: 'R', to: 'RL', label: 'yes' },
  { from: 'R', to: 'RR', label: 'no' },
  { from: 'LR', to: 'LRL', label: 'yes' },
  { from: 'LR', to: 'LRR', label: 'no' },
  { from: 'RR', to: 'RRL', label: 'yes' },
  { from: 'RR', to: 'RRR', label: 'no' },
]

function pathFitsPrefix(node: TreeNode, perm: Perm): boolean {
  if (node.pathFromRoot.length === 0) return true
  if (node.pathFromRoot.length > perm.path.length) return false
  return node.pathFromRoot.every((step, i) => step === perm.path[i].answer)
}

function edgeFitsPath(edge: { from: string; to: string }, perm: Perm | null): boolean {
  if (!perm) return false
  const toNode = NODE.find((n) => n.id === edge.to)!
  if (toNode.pathFromRoot.length > perm.path.length) return false
  return toNode.pathFromRoot.every((step, i) => step === perm.path[i].answer)
}

export function DecisionTreeLowerBound() {
  const [tab, setTab] = useState<Tab>('tree')
  const [chosen, setChosen] = useState<string | null>(null)
  const [generalN, setGeneralN] = useState(8)

  const perm = chosen ? PERMUTATIONS.find((p) => p.id === chosen) ?? null : null

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Δέντρο απόφασης — γιατί κάθε αλγόριθμος με συγκρίσεις χρειάζεται Ω(n log n)
        </div>
      </div>

      {/* tab strip */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        <TabBtn active={tab === 'tree'} onClick={() => setTab('tree')}>
          Το δέντρο για n = 3
        </TabBtn>
        <TabBtn active={tab === 'why'} onClick={() => setTab('why')}>
          Γιατί δεν μπορεί να είναι κοντύτερο
        </TabBtn>
        <TabBtn active={tab === 'general'} onClick={() => setTab('general')}>
          Για κάθε n
        </TabBtn>
      </div>

      {tab === 'tree' && (
        <TreeTab perm={perm} chosen={chosen} setChosen={setChosen} />
      )}
      {tab === 'why' && <WhyTab />}
      {tab === 'general' && <GeneralTab n={generalN} setN={setGeneralN} />}
    </section>
  )
}

/* ─────────────────────────────  Tab 1: tree  ─────────────────────────── */

function TreeTab({
  perm,
  chosen,
  setChosen,
}: {
  perm: Perm | null
  chosen: string | null
  setChosen: (id: string | null) => void
}) {
  const comparisons = perm?.path.length ?? 0

  return (
    <>
      <div className="mb-2.5 rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm text-fg-muted">
        Διάλεξε μια διάταξη των a, b, c. Το μονοπάτι από τη ρίζα στο φύλλο της φωτίζεται, και ο
        αριθμός συγκρίσεων είναι το <b>βάθος</b> εκείνου του μονοπατιού.
      </div>

      {/* permutation picker */}
      <div className="mb-2 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {PERMUTATIONS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setChosen(p.id === chosen ? null : p.id)}
            className={cn(
              'rounded-md border px-2 py-1 text-left text-xs transition-colors',
              chosen === p.id
                ? 'border-accent bg-accent/10 text-accent'
                : 'border-border text-fg-muted hover:text-fg',
            )}
          >
            <div className="font-mono font-semibold">{p.order}</div>
            <div className="mt-0.5 text-[10px] text-fg-subtle">{p.description}</div>
          </button>
        ))}
      </div>

      {/* tree svg */}
      <div className="rounded-lg border border-border bg-bg-soft/40 p-2">
        <svg viewBox="0 -10 800 280" className="w-full">
          {EDGE.map((e) => {
            const from = NODE.find((n) => n.id === e.from)!
            const to = NODE.find((n) => n.id === e.to)!
            const active = edgeFitsPath(e, perm)
            return (
              <g key={`${e.from}-${e.to}`}>
                <line
                  x1={from.x}
                  y1={from.y + 14}
                  x2={to.x}
                  y2={to.y - 6}
                  stroke={active ? 'rgb(var(--accent))' : 'rgb(var(--border-strong))'}
                  strokeWidth={active ? 2.5 : 1.2}
                />
                <text
                  x={(from.x + to.x) / 2 + (e.label === 'yes' ? -12 : 12)}
                  y={(from.y + to.y) / 2 + 4}
                  fontSize="10"
                  fontFamily="ui-sans-serif, sans-serif"
                  fontWeight={600}
                  fill={active ? 'rgb(var(--accent))' : 'rgb(var(--fg-muted))'}
                  textAnchor="middle"
                >
                  {e.label === 'yes' ? 'ναι' : 'όχι'}
                </text>
              </g>
            )
          })}
          {NODE.map((n) => {
            const active = perm ? pathFitsPrefix(n, perm) : false
            const isLeaf = n.kind === 'leaf'
            const isFinalLeaf = active && isLeaf && perm!.path.length === n.pathFromRoot.length
            const fill = isFinalLeaf
              ? 'rgb(var(--accent))'
              : active
                ? 'rgb(var(--accent) / 0.18)'
                : 'rgb(var(--bg-elevated))'
            const stroke = active ? 'rgb(var(--accent))' : 'rgb(var(--border-strong))'
            const textColor = isFinalLeaf ? 'rgb(var(--accent-fg))' : 'rgb(var(--fg))'
            return (
              <g key={n.id}>
                <ellipse
                  cx={n.x}
                  cy={n.y + 4}
                  rx={isLeaf ? 44 : 36}
                  ry={isLeaf ? 14 : 12}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isFinalLeaf ? 2.5 : 1.5}
                />
                <text
                  x={n.x}
                  y={n.y + 8}
                  fontSize="10.5"
                  fontFamily={isLeaf ? 'ui-monospace, monospace' : 'ui-sans-serif, sans-serif'}
                  fontWeight={isLeaf ? 700 : 600}
                  fill={textColor}
                  textAnchor="middle"
                >
                  {n.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* verdict */}
      <div
        className={cn(
          'mt-3 rounded-lg border px-3 py-2.5 text-sm leading-relaxed text-fg',
          perm ? 'border-accent/30 bg-accent/5' : 'border-border bg-bg-soft/40',
        )}
      >
        {perm ? (
          <>
            Η διάταξη <b className="font-mono">{perm.order}</b> εντοπίζεται μετά από{' '}
            <b className="font-mono">{comparisons}</b> συγκρίσεις · κάθε εσωτερικός κόμβος του
            μονοπατιού είναι μία σύγκριση που έπρεπε να γίνει.
          </>
        ) : (
          <>Διάλεξε μια διάταξη παραπάνω για να δεις το μονοπάτι και το βάθος του.</>
        )}
      </div>
    </>
  )
}

/* ─────────────────────────────  Tab 2: why  ─────────────────────────── */

function WhyTab() {
  return (
    <div className="grid gap-2.5">
      <Step
        n={1}
        title="Κάθε αλγόριθμος ταξινόμησης με συγκρίσεις είναι ένα δυαδικό δέντρο απόφασης."
        body="Κάθε εσωτερικός κόμβος είναι μία σύγκριση («a < b ;»). Δύο εξερχόμενες ακμές: ναι / όχι. Δεν έχει σημασία τι αλγόριθμος είναι από κάτω (mergesort, insertion, ή κάτι που δεν έχει εφευρεθεί ακόμα) — αν χρησιμοποιεί μόνο συγκρίσεις, μπορούμε να σχεδιάσουμε αυτό το δέντρο."
      />
      <Step
        n={2}
        title="Πρέπει να ξεχωρίζει όλες τις πιθανές διατάξεις της εισόδου."
        body="Οι n αριθμοί έχουν n! διαφορετικές σειρές. Δύο διαφορετικές διατάξεις πρέπει να καταλήγουν σε διαφορετικά φύλλα — αλλιώς ο αλγόριθμος δίνει την ίδια έξοδο και για τις δύο. Άρα το δέντρο έχει τουλάχιστον n! φύλλα. Για n = 3: 6 φύλλα."
      />
      <Step
        n={3}
        title="Ένα δυαδικό δέντρο με L φύλλα έχει ύψος ≥ ⌈log₂ L⌉."
        body="Είναι γεωμετρική παρατήρηση: σε ύψος h, ένα δυαδικό δέντρο έχει το πολύ 2ʰ φύλλα. Άρα 2ʰ ≥ L ⇒ h ≥ log₂ L. Για n = 3: h ≥ ⌈log₂ 6⌉ = ⌈2.58⌉ = 3."
      />
      <Step
        n={4}
        title="Το ύψος είναι ο μέγιστος αριθμός συγκρίσεων στη χείριστη περίπτωση."
        body="Το ύψος ενός φύλλου είναι ακριβώς πόσες συγκρίσεις χρειάστηκαν για να το βρούμε. Άρα η χείριστη περίπτωση = το βαθύτερο φύλλο = το ύψος. Για n = 3: ≥ 3 συγκρίσεις στη χειρότερη είσοδο."
      />
      <Step
        n={5}
        title="log₂(n!) = Θ(n log n) (Stirling)."
        body="Η ανισότητα log₂(n!) ≥ (n/2) · log₂(n/2) δίνει αμέσως Ω(n log n). Έτσι, για κάθε αλγόριθμο σύγκρισης, η χείριστη περίπτωση δεν μπορεί να είναι μικρότερη από Ω(n log n)."
      />
      <div className="rounded-lg border border-accent/30 bg-accent/5 px-3 py-2.5 text-sm leading-relaxed text-fg">
        <b>Πόρισμα.</b> Η mergesort είναι Θ(n log n)· το παραπάνω δίνει Ω(n log n) για όλους τους
        αλγορίθμους σύγκρισης. Τα δύο φράγματα ακουμπούν — άρα η mergesort είναι{' '}
        <b>ασυμπτωτικά βέλτιστη</b>.
      </div>
    </div>
  )
}

function Step({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2.5">
      <div className="flex items-start gap-2.5">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15 font-mono text-xs font-bold text-accent">
          {n}
        </span>
        <div>
          <div className="text-sm font-semibold text-fg">{title}</div>
          <p className="mt-1 text-sm leading-relaxed text-fg-muted">{body}</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────  Tab 3: general  ───────────────────── */

function GeneralTab({ n, setN }: { n: number; setN: (v: number) => void }) {
  // Compute n! using BigInt to handle up to n = 15 cleanly.
  const data = useMemo(() => {
    const out: Array<{ n: number; fact: bigint; bound: number; stirling: number }> = []
    for (let k = 2; k <= 15; k++) {
      let f = 1n
      for (let i = 2n; i <= BigInt(k); i++) f *= i
      const log2f = log2BigInt(f)
      out.push({ n: k, fact: f, bound: Math.ceil(log2f), stirling: k * Math.log2(k) })
    }
    return out
  }, [])

  const here = data.find((d) => d.n === n)!
  const maxBound = data[data.length - 1].bound

  return (
    <>
      <div className="mb-2.5 rounded-lg border border-border bg-bg-soft/50 px-3 py-2 text-sm text-fg-muted">
        Σύρε το <span className="font-mono">n</span> και δες το κάτω φράγμα{' '}
        <span className="font-mono">⌈log₂(n!)⌉</span> να ακολουθεί την καμπύλη{' '}
        <span className="font-mono">n·log₂ n</span> — όχι την <span className="font-mono">n</span>.
      </div>

      <div className="mb-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2.5">
        <div className="mb-1.5 flex items-center justify-between gap-2 text-sm">
          <span className="text-fg-muted">
            μέγεθος εισόδου <span className="font-mono">n</span>
          </span>
          <span className="font-mono text-sm font-bold text-fg">{n}</span>
        </div>
        <input
          type="range"
          min={2}
          max={15}
          step={1}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          aria-label="μέγεθος εισόδου n"
          className="h-1.5 w-full cursor-pointer accent-accent"
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <Cell label="n!" value={here.fact.toString()} hint="πλήθος διατάξεων" />
        <Cell
          label="⌈log₂(n!)⌉"
          value={here.bound.toString()}
          hint="ακριβές κάτω φράγμα"
          tone="accent"
        />
        <Cell label="n·log₂ n" value={here.stirling.toFixed(1)} hint="ασυμπτωτικός ρυθμός" />
      </div>

      <div className="mt-3 rounded-lg border border-border bg-bg-soft/40 px-3 py-2.5">
        <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">
          ⌈log₂(n!)⌉ για n = 2…15
        </div>
        <div className="flex items-end gap-1">
          {data.map((d) => (
            <div key={d.n} className="flex flex-1 flex-col items-center">
              <div
                className={cn(
                  'w-full rounded-t transition-colors',
                  d.n === n ? 'bg-accent' : 'bg-accent/30',
                )}
                style={{ height: `${(d.bound / maxBound) * 80 + 4}px` }}
              />
              <span className="mt-0.5 font-mono text-[9px] text-fg-subtle">{d.n}</span>
            </div>
          ))}
        </div>
        <div className="mt-1.5 text-center font-mono text-[11px] text-fg-muted">
          η μπάρα στο n = {n} είναι ακριβώς {here.bound} — τόσες συγκρίσεις τουλάχιστον
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2.5 text-sm leading-relaxed text-fg">
        <b>Όταν n = {n}</b>: κάθε αλγόριθμος σύγκρισης χρειάζεται <b>τουλάχιστον {here.bound}</b>{' '}
        συγκρίσεις στη χείριστη περίπτωση. Η μπάρα ακολουθεί ορατά την καμπύλη <i>n·log n</i>· δεν
        γίνεται να την κατεβάσεις σε γραμμική.
      </div>
    </>
  )
}

function Cell({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string
  hint?: string
  tone?: 'accent'
}) {
  return (
    <div
      className={cn(
        'rounded-lg border px-3 py-2',
        tone === 'accent'
          ? 'border-accent/40 bg-accent/5'
          : 'border-border bg-bg-soft/40',
      )}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider text-fg-subtle">{label}</div>
      <div className="mt-0.5 break-all font-mono text-sm font-bold text-fg">{value}</div>
      {hint && <div className="mt-0.5 font-mono text-[10px] text-fg-subtle">{hint}</div>}
    </div>
  )
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-border text-fg-muted hover:text-fg',
      )}
    >
      {children}
    </button>
  )
}

/** Approximation of log₂(b) for arbitrary BigInt b ≥ 1. */
function log2BigInt(b: bigint): number {
  // Convert by bit length: bit length k means value in [2^(k-1), 2^k).
  // Refine with the top 53 bits as a double.
  if (b <= 0n) return 0
  const bitLen = b.toString(2).length
  if (bitLen <= 53) return Math.log2(Number(b))
  const shift = BigInt(bitLen - 53)
  const top = Number(b >> shift)
  return Math.log2(top) + Number(shift)
}
