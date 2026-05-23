'use client'

/**
 * MetroModelingViz — η ίδια κατάσταση, δύο διαφορετικά γραφήματα (L06).
 *
 * Το lecture λέει ότι η μοντελοποίηση είναι ΕΠΙΛΟΓΗ: η ίδια πραγματικότητα
 * γίνεται δύο διαφορετικά γραφήματα ανάλογα με την ερώτηση. Το παράδειγμα
 * του μετρό:
 *
 *   – «Πόσοι σταθμοί μέχρι;» → οι σταθμοί ΕΙΝΑΙ οι κορυφές, οι ακμές
 *     ενώνουν διαδοχικούς σταθμούς. Η απάντηση = μήκος μονοπατιού.
 *
 *   – «Πόσες αλλαγές γραμμής;» → οι γραμμές γίνονται οι κορυφές, οι ακμές
 *     ενώνουν δύο γραμμές που μοιράζονται σταθμό μετεπιβίβασης. Η απάντηση
 *     = μήκος μονοπατιού πάνω στο line-graph (αλλαγές = ακμές − 1).
 *
 * Δύο tabs δείχνουν το ίδιο δίκτυο μετρό με τις δύο όψεις. Ο μαθητής
 * διαλέγει σταθμό αφετηρίας και προορισμού και βλέπει ΖΩΝΤΑΝΑ:
 *   – πόσοι σταθμοί χωρίζουν τα δύο σημεία (tab A)
 *   – πόσες αλλαγές γραμμής απαιτούνται (tab B)
 *
 * Built for L06.
 */

import { useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type Station = {
  id: string
  name: string
  x: number
  y: number
  /** lines that touch this station */
  lines: string[]
}

const LINE_COLOR: Record<string, string> = {
  R: '#dc2626', // κόκκινη
  B: '#2563eb', // μπλε
  G: '#16a34a', // πράσινη
}
const LINE_NAME: Record<string, string> = {
  R: 'Κόκκινη',
  B: 'Μπλε',
  G: 'Πράσινη',
}

const STATIONS: Station[] = [
  // Red line (horizontal top)
  { id: 'r1', name: 'Α', x: 70, y: 90, lines: ['R'] },
  { id: 'r2', name: 'Β', x: 170, y: 90, lines: ['R'] },
  { id: 'rb', name: 'Γ ★', x: 270, y: 90, lines: ['R', 'B'] }, // interchange R-B
  { id: 'r3', name: 'Δ', x: 370, y: 90, lines: ['R'] },
  { id: 'r4', name: 'Ε', x: 470, y: 90, lines: ['R'] },
  // Blue line (vertical through interchange)
  { id: 'b1', name: 'Ζ', x: 270, y: 30, lines: ['B'] },
  { id: 'b2', name: 'Η', x: 270, y: 170, lines: ['B'] },
  { id: 'bg', name: 'Θ ★', x: 270, y: 230, lines: ['B', 'G'] }, // interchange B-G
  // Green line (horizontal bottom)
  { id: 'g1', name: 'Ι', x: 130, y: 230, lines: ['G'] },
  { id: 'g2', name: 'Κ', x: 200, y: 230, lines: ['G'] },
  { id: 'g3', name: 'Λ', x: 340, y: 230, lines: ['G'] },
  { id: 'g4', name: 'Μ', x: 410, y: 230, lines: ['G'] },
]
const ST_OF = new Map(STATIONS.map((s) => [s.id, s]))

/** edges = consecutive stations along a line (in physical order) */
const LINE_SEQUENCES: Record<string, string[]> = {
  R: ['r1', 'r2', 'rb', 'r3', 'r4'],
  B: ['b1', 'rb', 'b2', 'bg'],
  G: ['g1', 'g2', 'bg', 'g3', 'g4'],
}
const STATION_EDGES: { a: string; b: string; line: string }[] = (() => {
  const out: { a: string; b: string; line: string }[] = []
  for (const ln of Object.keys(LINE_SEQUENCES)) {
    const seq = LINE_SEQUENCES[ln]
    for (let i = 1; i < seq.length; i++) out.push({ a: seq[i - 1], b: seq[i], line: ln })
  }
  return out
})()

const LINES = ['R', 'B', 'G']
/** line-graph edges: pair of lines that share an interchange station */
const LINE_EDGES: { a: string; b: string; via: string }[] = (() => {
  const out: { a: string; b: string; via: string }[] = []
  for (const s of STATIONS) {
    if (s.lines.length >= 2) {
      for (let i = 0; i < s.lines.length; i++) {
        for (let j = i + 1; j < s.lines.length; j++) {
          out.push({ a: s.lines[i], b: s.lines[j], via: s.id })
        }
      }
    }
  }
  return out
})()
function lineAdj(id: string): string[] {
  const out: string[] = []
  for (const e of LINE_EDGES) {
    if (e.a === id) out.push(e.b)
    else if (e.b === id) out.push(e.a)
  }
  return out
}

function bfs(
  nodes: string[],
  adj: (id: string) => string[],
  src: string,
  dst: string,
): string[] | null {
  if (src === dst) return [src]
  const parent = new Map<string, string | null>([[src, null]])
  const queue: string[] = [src]
  while (queue.length) {
    const v = queue.shift()!
    for (const u of adj(v)) {
      if (parent.has(u)) continue
      parent.set(u, v)
      if (u === dst) {
        // reconstruct
        const path: string[] = []
        let cur: string | null = u
        while (cur !== null) {
          path.unshift(cur)
          cur = parent.get(cur) ?? null
        }
        return path
      }
      queue.push(u)
    }
  }
  return null
}

type Tab = 'stations' | 'lines'

export function MetroModelingViz() {
  const [tab, setTab] = useState<Tab>('stations')
  const [src, setSrc] = useState('r1') // Α
  const [dst, setDst] = useState('g4') // Μ

  // --- Tab A: stations are vertices -------------------------------------------------
  const stationAdj = (id: string): string[] => {
    const out: string[] = []
    for (const e of STATION_EDGES) {
      if (e.a === id) out.push(e.b)
      else if (e.b === id) out.push(e.a)
    }
    return out
  }
  const stationPath = useMemo(() => bfs(STATIONS.map((s) => s.id), stationAdj, src, dst), [src, dst])
  const stationPathSet = useMemo(() => new Set(stationPath ?? []), [stationPath])
  const stationEdgesUsed = useMemo(() => {
    const s = new Set<string>()
    if (!stationPath) return s
    for (let i = 1; i < stationPath.length; i++) {
      const a = stationPath[i - 1]
      const b = stationPath[i]
      s.add(a < b ? `${a}|${b}` : `${b}|${a}`)
    }
    return s
  }, [stationPath])

  // --- Tab B: lines are vertices ----------------------------------------------------
  /** path in the LINE graph from src-station's first line to dst-station's first line */
  const srcLines = ST_OF.get(src)!.lines
  const dstLines = ST_OF.get(dst)!.lines
  // pick the pair with the SHORTEST line-graph distance
  const linePath = useMemo(() => {
    let best: string[] | null = null
    for (const sl of srcLines) {
      for (const dl of dstLines) {
        const p = bfs(LINES, lineAdj, sl, dl)
        if (p && (best === null || p.length < best.length)) best = p
      }
    }
    return best
  }, [srcLines, dstLines])
  const linePathSet = useMemo(() => new Set(linePath ?? []), [linePath])

  const stationCount = stationPath ? stationPath.length : 0
  const changes = linePath ? Math.max(0, linePath.length - 1) : 0

  // pick handlers
  const [picking, setPicking] = useState<'src' | 'dst'>('src')
  function pick(id: string) {
    if (picking === 'src') {
      setSrc(id)
      setPicking('dst')
    } else {
      setDst(id)
      setPicking('src')
    }
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      {/* header */}
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Η ίδια κατάσταση, δύο διαφορετικά γραφήματα
        </div>
        <div className="inline-flex overflow-hidden rounded-md border border-border text-xs font-medium">
          {(['stations', 'lines'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                'px-2.5 py-1 transition-colors',
                tab === t
                  ? 'bg-accent text-accent-fg'
                  : 'bg-bg-elevated text-fg-subtle hover:bg-bg-soft',
              )}
            >
              {t === 'stations' ? 'Σταθμοί ως κορυφές' : 'Γραμμές ως κορυφές'}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Διάλεξε αφετηρία και προορισμό κάνοντας κλικ πάνω στους σταθμούς. Άλλαξε
        όψη — η ερώτηση που απαντάς αλλάζει εντελώς.
      </p>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        {/* map */}
        <div className="graph-canvas">
          <svg
            viewBox="0 0 540 280"
            className="mx-auto block h-auto w-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* the LINES drawn as track strokes */}
            {STATION_EDGES.map((e, i) => {
              const A = ST_OF.get(e.a)!
              const B = ST_OF.get(e.b)!
              const k = e.a < e.b ? `${e.a}|${e.b}` : `${e.b}|${e.a}`
              const used = tab === 'stations' && stationEdgesUsed.has(k)
              return (
                <line
                  key={`se${i}`}
                  x1={A.x}
                  y1={A.y}
                  x2={B.x}
                  y2={B.y}
                  stroke={LINE_COLOR[e.line]}
                  strokeWidth={used ? 7 : 4}
                  strokeOpacity={used ? 1 : 0.45}
                  strokeLinecap="round"
                />
              )
            })}
            {/* stations */}
            {STATIONS.map((s) => {
              const isSrc = s.id === src
              const isDst = s.id === dst
              const onStPath = tab === 'stations' && stationPathSet.has(s.id)
              const fill = isSrc
                ? '#9f1239'
                : isDst
                  ? '#0ea5e9'
                  : s.lines.length > 1
                    ? '#fef3c7'
                    : '#ffffff'
              const stroke = isSrc
                ? '#7e1031'
                : isDst
                  ? '#0369a1'
                  : s.lines.length > 1
                    ? '#d97706'
                    : '#1c1214'
              return (
                <g
                  key={s.id}
                  transform={`translate(${s.x} ${s.y})`}
                  className="cursor-pointer"
                  onClick={() => pick(s.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Σταθμός ${s.name}`}
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                      ev.preventDefault()
                      pick(s.id)
                    }
                  }}
                >
                  <circle r={18} fill="transparent" />
                  {onStPath && (
                    <circle r={15} fill="none" stroke="#9f1239" strokeWidth={2} strokeDasharray="2 2" />
                  )}
                  <circle r={11} fill={fill} stroke={stroke} strokeWidth={2.5} />
                  <text
                    x={0}
                    y={s.y < 200 ? -18 : 22}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={700}
                    fill={isSrc ? '#9f1239' : isDst ? '#0369a1' : '#1c1214'}
                  >
                    {s.name}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        {/* the line-graph view runs alongside in tab B */}
        <div className="space-y-3">
          {/* selection summary */}
          <div className="rounded-lg border border-border bg-bg-soft/40 px-3 py-2 text-sm">
            <div className="text-[11px] uppercase tracking-wider text-fg-subtle">
              Διαδρομή
            </div>
            <div className="font-mono text-fg">
              <span className="font-bold text-rose-700">{ST_OF.get(src)!.name}</span>
              <span className="mx-1 text-fg-subtle">→</span>
              <span className="font-bold text-sky-700">{ST_OF.get(dst)!.name}</span>
            </div>
            <div className="mt-0.5 text-[11px] text-fg-subtle">
              Επόμενο κλικ ορίζει: {picking === 'src' ? 'αφετηρία' : 'προορισμό'}
            </div>
          </div>

          {tab === 'stations' && (
            <>
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-50 px-3 py-2">
                <div className="text-[11px] uppercase tracking-wider text-emerald-700">
                  Σταθμοί που μεσολαβούν
                </div>
                <div className="font-mono text-3xl font-bold text-emerald-900">
                  {stationCount === 0 ? '—' : stationCount - 1}
                  <span className="ml-2 text-xs font-medium text-emerald-700">
                    (μήκος μονοπατιού)
                  </span>
                </div>
                {stationPath && (
                  <div className="mt-1 text-xs text-emerald-900">
                    {stationPath.map((id) => ST_OF.get(id)!.name).join(' → ')}
                  </div>
                )}
              </div>
              <div className="rounded-lg border border-border bg-bg-soft/30 px-3 py-2 text-xs leading-relaxed text-fg-muted">
                Αυτό το γράφημα μετράει <strong>σταθμούς</strong>. Οι κορυφές
                είναι σταθμοί, οι ακμές διαδοχικοί σταθμοί στην ίδια γραμμή. Το
                μήκος του μονοπατιού = αριθμός ενδιάμεσων στάσεων.
              </div>
            </>
          )}

          {tab === 'lines' && (
            <>
              <div className="rounded-lg border border-amber-500/40 bg-amber-50 px-3 py-2">
                <div className="text-[11px] uppercase tracking-wider text-amber-700">
                  Αλλαγές γραμμής
                </div>
                <div className="font-mono text-3xl font-bold text-amber-900">
                  {linePath === null ? '—' : changes}
                </div>
                {linePath && (
                  <div className="mt-1 text-xs text-amber-900">
                    {linePath.map((l) => LINE_NAME[l]).join(' → ')}
                  </div>
                )}
              </div>
              {/* mini line-graph drawing */}
              <div className="rounded-lg border border-border bg-bg-soft/30 p-2">
                <div className="mb-1 text-[11px] uppercase tracking-wider text-fg-subtle">
                  Γράφημα γραμμών (line graph)
                </div>
                <svg viewBox="0 0 280 110" className="mx-auto block h-auto w-full">
                  {LINE_EDGES.map((e, i) => {
                    const POS_L: Record<string, [number, number]> = {
                      R: [60, 30],
                      B: [200, 30],
                      G: [130, 90],
                    }
                    const used =
                      linePathSet.has(e.a) &&
                      linePathSet.has(e.b) &&
                      linePath &&
                      ((linePath.indexOf(e.a) + 1 === linePath.indexOf(e.b)) ||
                        (linePath.indexOf(e.b) + 1 === linePath.indexOf(e.a)))
                    return (
                      <g key={`le${i}`}>
                        <line
                          x1={POS_L[e.a][0]}
                          y1={POS_L[e.a][1]}
                          x2={POS_L[e.b][0]}
                          y2={POS_L[e.b][1]}
                          stroke={used ? '#b45309' : '#9b8a8d'}
                          strokeWidth={used ? 4.5 : 2.5}
                        />
                        <text
                          x={(POS_L[e.a][0] + POS_L[e.b][0]) / 2}
                          y={(POS_L[e.a][1] + POS_L[e.b][1]) / 2 + 4}
                          textAnchor="middle"
                          fontSize={9}
                          fontWeight={600}
                          fill="#5a4a4d"
                        >
                          μέσω {ST_OF.get(e.via)!.name}
                        </text>
                      </g>
                    )
                  })}
                  {(['R', 'B', 'G'] as const).map((l) => {
                    const P: Record<string, [number, number]> = {
                      R: [60, 30],
                      B: [200, 30],
                      G: [130, 90],
                    }
                    const here = linePathSet.has(l)
                    return (
                      <g key={l} transform={`translate(${P[l][0]} ${P[l][1]})`}>
                        <circle
                          r={18}
                          fill={LINE_COLOR[l]}
                          stroke={here ? '#b45309' : '#1c1214'}
                          strokeWidth={here ? 3 : 2}
                        />
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fontSize={11}
                          fontWeight={700}
                          fill="#ffffff"
                        >
                          {LINE_NAME[l]}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
              <div className="rounded-lg border border-border bg-bg-soft/30 px-3 py-2 text-xs leading-relaxed text-fg-muted">
                Εδώ οι κορυφές είναι <strong>γραμμές</strong>· υπάρχει ακμή
                ανάμεσα σε δύο γραμμές όταν μοιράζονται σταθμό μετεπιβίβασης
                (τα ★). Το μήκος του μονοπατιού − 1 = πόσες αλλαγές γραμμής.
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
