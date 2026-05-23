'use client'

/**
 * ComplexityZooLab — where each named problem lives in P / NP-complete / unknown (L01).
 *
 * The K17 exam keeps asking «which of {Hamilton, SAT, Huffman, Vertex Cover,
 * Shortest Path, ...} is/isn't in P / NP-complete?». A student who reads each
 * problem in isolation never builds the map. This viz lays the whole zoo out
 * at once: three zones (P, in-NP-but-unknown, NP-complete), each holding the
 * named problems with a one-click justification + the lecture that covers
 * them. Pass `focus="sat"` (or any other id) from a problem solution to
 * pre-select that problem so the student lands on the right entry. Built
 * for L01 — but every later lecture that references P/NP can reuse it.
 */

import { useState } from 'react'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

type ZooClass = 'P' | 'NPC' | 'unknown'

type ZooProblem = {
  id: string
  name: string
  greekName: string
  klass: ZooClass
  /** One-line "why is it here". */
  why: string
  /** Lecture slug (if covered explicitly in K17). */
  lecture?: string
  lectureLabel?: string
}

const PROBLEMS: ZooProblem[] = [
  // In P
  {
    id: 'sorting',
    name: 'Sorting',
    greekName: 'Ταξινόμηση',
    klass: 'P',
    why: 'Mergesort σε O(n log n) — και αποδεικτικά Ω(n log n) στο μοντέλο των συγκρίσεων.',
    lecture: 'lectures/L03-divide-and-conquer-i',
    lectureLabel: 'L03',
  },
  {
    id: 'shortest-path',
    name: 'Shortest Path',
    greekName: 'Συντομότερο μονοπάτι',
    klass: 'P',
    why: 'Dijkstra σε O(m log n) με θετικά βάρη· Bellman-Ford σε O(mn) ακόμη και με αρνητικά.',
    lecture: 'lectures/L09-graphs-iv',
    lectureLabel: 'L09',
  },
  {
    id: 'mst',
    name: 'MST',
    greekName: 'Ελάχιστο συνδετικό δέντρο',
    klass: 'P',
    why: 'Prim ή Kruskal σε O(m log n) — άπληστος αλγόριθμος, ιδιότητα αποκοπής.',
    lecture: 'lectures/L09-graphs-iv',
    lectureLabel: 'L09',
  },
  {
    id: 'max-st',
    name: 'Max Spanning Tree',
    greekName: 'Μέγιστο συνδετικό δέντρο',
    klass: 'P',
    why: 'Ίδιο με το ελάχιστο — απλά αντίστρεψε τα βάρη και τρέξε Kruskal/Prim.',
    lecture: 'lectures/L09-graphs-iv',
    lectureLabel: 'L09',
  },
  {
    id: 'huffman',
    name: 'Huffman',
    greekName: 'Κωδικοποίηση Huffman',
    klass: 'P',
    why: 'Άπληστος αλγόριθμος O(n log n) με σωρό. Βρίσκει βέλτιστο prefix code.',
    lecture: 'lectures/L13-greedy-iii',
    lectureLabel: 'L13',
  },
  {
    id: '2sat',
    name: '2-SAT',
    greekName: '2-Ικανοποιησιμότητα',
    klass: 'P',
    why: 'Παρόλο που το γενικό SAT είναι NP-πλήρες, η ειδική περίπτωση με 2 μεταβλητές ανά όρο λύνεται πολυωνυμικά μέσω SCC σε γράφημα συνεπαγωγών.',
  },
  {
    id: 'connectivity',
    name: 'BFS / DFS',
    greekName: 'Συνεκτικότητα / διάσχιση',
    klass: 'P',
    why: 'BFS και DFS σε O(m + n) — βασικά εργαλεία για συνεκτικότητα, διμερότητα, SCC.',
    lecture: 'lectures/L07-graphs-ii',
    lectureLabel: 'L07',
  },
  // In NP, status unknown
  {
    id: 'graph-iso',
    name: 'Graph Isomorphism',
    greekName: 'Ισομορφισμός γραφημάτων',
    klass: 'unknown',
    why: 'Στο NP. Δεν ξέρουμε αν είναι σε P· πιθανότατα ΟΧΙ NP-πλήρες (αν ήταν, η πολυωνυμική ιεραρχία θα κατέρρεε). Quasi-poly από τον Babai (2015).',
  },
  {
    id: 'integer-factor',
    name: 'Integer Factorization',
    greekName: 'Παραγοντοποίηση ακεραίων',
    klass: 'unknown',
    why: 'Στο NP. Άγνωστο αν είναι σε P. Δεν είναι γνωστό ότι είναι NP-πλήρες — αν ήταν, η κρυπτογραφία RSA θα ήταν αυτόματα σπασμένη.',
  },
  // NP-complete
  {
    id: 'sat',
    name: 'SAT',
    greekName: 'Ικανοποιησιμότητα Λογικών Προτάσεων',
    klass: 'NPC',
    why: 'Το αρχετυπικό NP-πλήρες (θεώρημα Cook-Levin, 1971). Κάθε άλλο πρόβλημα του NP ανάγεται σε αυτό.',
  },
  {
    id: 'vertex-cover',
    name: 'Vertex Cover',
    greekName: 'Κάλυμμα Κορυφών',
    klass: 'NPC',
    why: 'Βρες σύνολο ≤ k κορυφών που καλύπτει όλες τις ακμές. Κλασικό NP-πλήρες (αναγωγή από 3-SAT).',
  },
  {
    id: 'independent-set',
    name: 'Independent Set',
    greekName: 'Ανεξάρτητο σύνολο',
    klass: 'NPC',
    why: 'Βρες σύνολο k κορυφών χωρίς καμία ακμή μεταξύ τους. Συμπληρωματικό του Vertex Cover (S ανεξάρτητο ⇔ V\\S κάλυμμα), άρα κι αυτό NP-πλήρες. Με σταθερό k γίνεται πολυωνυμικό σε O(n^k).',
  },
  {
    id: 'mst-decision',
    name: 'MST (απόφαση)',
    greekName: 'Ελάχιστο συνδετικό δέντρο — απόφαση',
    klass: 'P',
    why: '«Υπάρχει συνδετικό δέντρο με συνολικό βάρος ≤ k;» Τρέξε Kruskal/Prim O(m log n), σύγκρινε με k. Πάει χέρι-χέρι με το πρόβλημα βελτιστοποίησης.',
    lecture: 'lectures/L09-graphs-iv',
    lectureLabel: 'L09',
  },
  {
    id: 'knapsack',
    name: 'Knapsack (απόφαση)',
    greekName: 'Σακίδιο',
    klass: 'NPC',
    why: 'Η έκδοση απόφασης είναι NP-πλήρης. Έχει ψευδοπολυωνυμικό DP O(nW), αλλά αυτό είναι εκθετικό ως προς το μέγεθος εισόδου σε bits.',
    lecture: 'lectures/L15-dp-ii',
    lectureLabel: 'L15',
  },
  {
    id: 'hamilton-cycle',
    name: 'Hamilton Cycle',
    greekName: 'Κύκλος Hamilton',
    klass: 'NPC',
    why: 'Υπάρχει κύκλος που επισκέπτεται κάθε κορυφή ακριβώς μία φορά; NP-πλήρες — σε αντίθεση με το κύκλο Euler που είναι σε P.',
  },
  {
    id: 'hamilton-path',
    name: 'Hamilton Path',
    greekName: 'Μονοπάτι Hamilton',
    klass: 'NPC',
    why: 'Όπως ο κύκλος, αλλά χωρίς την απαίτηση επιστροφής. Επίσης NP-πλήρες.',
  },
  {
    id: 'longest-path',
    name: 'Longest Path',
    greekName: 'Μακρύτερο μονοπάτι',
    klass: 'NPC',
    why: 'Σε αντίθεση με το συντομότερο, το μακρύτερο απλό μονοπάτι είναι NP-πλήρες — περιέχει το Hamilton Path ως ειδική περίπτωση.',
  },
  {
    id: 'tsp',
    name: 'TSP',
    greekName: 'Περιοδεύων πωλητής',
    klass: 'NPC',
    why: 'Βρες ελάχιστο κύκλο Hamilton σε ζυγισμένο γράφημα — NP-πλήρες.',
  },
]

const PROBLEMS_BY_ID = new Map(PROBLEMS.map((p) => [p.id, p]))

const ZONE_META: Record<
  ZooClass,
  {
    title: string
    subtitle: string
    border: string
    bg: string
    dot: string
    text: string
    chip: string
  }
> = {
  P: {
    title: 'Στο P',
    subtitle: 'έχουμε πολυωνυμικό αλγόριθμο',
    border: 'border-emerald-400/60',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    dot: 'bg-emerald-500',
    text: 'text-emerald-800 dark:text-emerald-200',
    chip: 'border-emerald-400 bg-emerald-100 text-emerald-900',
  },
  unknown: {
    title: 'Στο NP, αλλά άγνωστα',
    subtitle: 'δεν ξέρουμε αν P ή αν NP-πλήρη',
    border: 'border-amber-400/60',
    bg: 'bg-amber-50 dark:bg-amber-500/10',
    dot: 'bg-amber-500',
    text: 'text-amber-900 dark:text-amber-200',
    chip: 'border-amber-400 bg-amber-100 text-amber-900',
  },
  NPC: {
    title: 'NP-πλήρη',
    subtitle: 'πιστεύεται ότι ΔΕΝ έχουν πολυωνυμικό αλγόριθμο',
    border: 'border-rose-400/60',
    bg: 'bg-rose-50 dark:bg-rose-500/10',
    dot: 'bg-rose-500',
    text: 'text-rose-900 dark:text-rose-200',
    chip: 'border-rose-400 bg-rose-100 text-rose-900',
  },
}

const FILTER_LABELS: Record<'all' | ZooClass, string> = {
  all: 'Όλα',
  P: 'Στο P',
  unknown: 'Άγνωστα',
  NPC: 'NP-πλήρη',
}

type Filter = 'all' | ZooClass

export function ComplexityZooLab({ focus }: { focus?: string }) {
  const [selectedId, setSelectedId] = useState<string | null>(focus ?? null)
  const [filter, setFilter] = useState<Filter>('all')

  const selected = selectedId ? PROBLEMS_BY_ID.get(selectedId) ?? null : null

  function pick(id: string) {
    setSelectedId((cur) => (cur === id ? null : id))
  }

  function Zone({ klass }: { klass: ZooClass }) {
    const meta = ZONE_META[klass]
    const list = PROBLEMS.filter((p) => p.klass === klass)
    const dimmed = filter !== 'all' && filter !== klass
    return (
      <div
        className={cn(
          'rounded-lg border-2 p-3 transition-opacity',
          meta.border,
          meta.bg,
          dimmed && 'opacity-35',
        )}
      >
        <div className={cn('mb-1 flex items-center gap-2', meta.text)}>
          <span className={cn('inline-block h-3 w-3 rounded-full', meta.dot)} />
          <span className="text-sm font-bold uppercase tracking-wider">
            {meta.title}
          </span>
        </div>
        <p className={cn('mb-2 text-[11px] opacity-75', meta.text)}>
          {meta.subtitle}
        </p>
        <ul className="space-y-1">
          {list.map((p) => {
            const isSel = selectedId === p.id
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => pick(p.id)}
                  className={cn(
                    'w-full rounded-md border px-2 py-1 text-left text-sm font-semibold transition-colors',
                    isSel
                      ? cn(meta.chip, 'ring-2 ring-offset-1 ring-amber-300')
                      : cn(
                          'border-border bg-bg-elevated text-fg-muted hover:bg-bg-soft',
                        ),
                  )}
                >
                  {p.greekName}
                  <span className="ml-1 text-[10px] font-normal opacity-60">
                    {p.name}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  return (
    <section className="my-6 rounded-xl border border-border bg-bg-elevated p-4 shadow-sm">
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm font-semibold tracking-tight text-fg">
          Ζωολογικός κήπος πολυπλοκότητας — που ζει κάθε πρόβλημα
        </div>
        <div className="flex gap-0.5 rounded-md border border-border p-0.5">
          {(['all', 'P', 'unknown', 'NPC'] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'rounded px-2 py-0.5 text-[11px] font-medium transition-colors',
                filter === f
                  ? 'bg-accent text-accent-fg'
                  : 'text-fg-muted hover:bg-bg-soft',
              )}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-xs text-fg-subtle">
        Όλα τα παρακάτω είναι στο{' '}
        <strong className="text-fg-muted">NP</strong> — δηλαδή «έχουν λύση που
        επαληθεύεται σε πολυωνυμικό χρόνο». Το NP χωρίζεται σε τρεις ζώνες.
        Κάνε κλικ σε οποιοδήποτε όνομα για να δεις γιατί ζει εκεί που ζει.
      </p>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Zone klass="P" />
        <Zone klass="unknown" />
        <Zone klass="NPC" />
      </div>

      <div
        aria-live="polite"
        className={cn(
          'mt-3 min-h-[5.25rem] rounded-lg border px-3 py-2.5 text-sm leading-relaxed',
          selected
            ? cn(
                'border-l-4',
                ZONE_META[selected.klass].border,
                ZONE_META[selected.klass].bg,
              )
            : 'border-dashed border-border bg-bg-soft/50 text-fg-muted',
        )}
      >
        {selected ? (
          <>
            <div className="mb-1 flex flex-wrap items-center gap-1.5">
              <span className="text-base font-bold text-fg">
                {selected.greekName}
              </span>
              <span className="text-xs text-fg-subtle">({selected.name})</span>
              <span
                className={cn(
                  'rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider',
                  ZONE_META[selected.klass].chip,
                )}
              >
                {selected.klass === 'P'
                  ? 'στο P'
                  : selected.klass === 'NPC'
                    ? 'NP-πλήρες'
                    : 'στο NP, άγνωστο'}
              </span>
              {selected.lecture && selected.lectureLabel && (
                <Link
                  href={`/${selected.lecture}`}
                  className="inline-flex items-center gap-1 rounded border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent hover:bg-accent/15"
                >
                  {selected.lectureLabel}
                  <ExternalLink className="h-2.5 w-2.5 opacity-60" aria-hidden />
                </Link>
              )}
            </div>
            <p className="text-fg-muted">{selected.why}</p>
          </>
        ) : (
          <span>
            Κάνε κλικ σε ένα πρόβλημα για να δεις σε ποια ζώνη ζει και γιατί.
            Παράδειγμα παγίδας: το <em>συντομότερο</em> μονοπάτι είναι στο P,
            αλλά το <em>μακρύτερο</em> είναι NP-πλήρες.
          </span>
        )}
      </div>
    </section>
  )
}
