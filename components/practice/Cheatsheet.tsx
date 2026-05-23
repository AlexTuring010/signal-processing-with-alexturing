'use client'

/**
 * Recommended Exam Cheatsheet — print-optimized view over `FORMULA_SHEET`.
 *
 * On screen: shows two "A4 paper" cards stacked vertically, with chrome
 * around them (header, print button, customisation toggles, banner).
 *
 * In print: the chrome and the surrounding site (header/footer/sidebar/
 * comments/tamagotchi) are hidden — only the two paper pages are sent to
 * the printer. The class `cheatsheet-print-mode` is set on `document.body`
 * while this component is mounted; `app/globals.css` `@media print` block
 * uses that class to scope chrome hiding to the cheatsheet route only.
 */

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Printer,
  Info,
  Sigma,
  AlertTriangle,
  ArrowRight,
  Lightbulb,
} from 'lucide-react'

import { FORMULA_BY_ID } from '@/content/practice/formulas'
import {
  CHEATSHEET_PAGES,
  CHEATSHEET_DECISION_TREE,
  CHEATSHEET_PITFALLS,
  type CheatsheetGroup,
  type CheatsheetFormulaSlot,
} from '@/content/practice/cheatsheet-spec'
import type { Topic } from '@/content/practice/types'
import { cn } from '@/lib/utils'

/**
 * Per-topic pastel band — visible both on screen and in print. Picked to
 * print legibly on a black-and-white printer (each band has distinct
 * left-border colour saturation, not just a tint).
 */
const TOPIC_BAND: Record<Topic, string> = {
  foundations: 'border-sky-500 bg-sky-50',
  modulation: 'border-violet-500 bg-violet-50',
  am: 'border-rose-500 bg-rose-50',
  fm: 'border-amber-500 bg-amber-50',
  random: 'border-emerald-500 bg-emerald-50',
  noise: 'border-orange-500 bg-orange-50',
}

const TOPIC_TEXT: Record<Topic, string> = {
  foundations: 'text-sky-900',
  modulation: 'text-violet-900',
  am: 'text-rose-900',
  fm: 'text-amber-900',
  random: 'text-emerald-900',
  noise: 'text-orange-900',
}

export function Cheatsheet() {
  // Toggle: include the τυπολόγιο mirror page or just the must-memorize page.
  // Defaults to "include everything" — recommended for the bring-your-own
  // case where a student wants ONE sheet covering both.
  const [includeTypology, setIncludeTypology] = useState(true)

  const pages = useMemo(() => {
    return includeTypology ? CHEATSHEET_PAGES : CHEATSHEET_PAGES.slice(0, 1)
  }, [includeTypology])

  return (
    <div className="not-prose">
      <Header
        includeTypology={includeTypology}
        setIncludeTypology={setIncludeTypology}
      />

      <div className="cheatsheet-paper-stack mt-6 space-y-8">
        {pages.map((page, idx) => (
          <PaperPage key={page.id} pageIndex={idx} totalPages={pages.length} page={page} />
        ))}
      </div>

      {/* Footer — only on screen, never printed. */}
      <p className="cheatsheet-no-print mt-10 text-center text-xs text-fg-muted">
        Tip · Στο Chrome print dialog διάλεξε <strong>A4</strong>,{' '}
        <strong>Background graphics: on</strong>, <strong>Margins: minimum/none</strong>{' '}
        για το πιο πιστό αποτέλεσμα.
      </p>
    </div>
  )
}

function Header({
  includeTypology,
  setIncludeTypology,
}: {
  includeTypology: boolean
  setIncludeTypology: (v: boolean) => void
}) {
  return (
    <header className="cheatsheet-no-print">
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft/60 text-accent">
        <Sigma className="h-5 w-5" aria-hidden />
      </div>
      <h1 className="text-3xl font-bold tracking-tight">
        Συνιστώμενη πινακίδα εξέτασης
      </h1>
      <p className="mt-3 max-w-3xl text-fg-muted">
        Ένα χαρτί που μπαίνει στην τσάντα σου: το επίσημο{' '}
        <Link href="/formulas" className="font-medium text-accent hover:underline">
          τυπολόγιο
        </Link>{' '}
        + τα formulas που <em>πρέπει</em> να ξέρεις (AM, FM, θόρυβος).
        Δομημένο για να βρίσκεις τον σωστό τύπο σε λίγα δευτερόλεπτα, όχι
        για διάβασμα.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
        >
          <Printer className="h-4 w-4" aria-hidden />
          Print to PDF
        </button>

        <div
          role="radiogroup"
          aria-label="Τι να συμπεριλάβω"
          className="inline-flex rounded-md border border-border bg-bg-elevated p-0.5 text-xs"
        >
          <ToggleButton
            active={includeTypology}
            onClick={() => setIncludeTypology(true)}
            label="Πλήρες (2 σελίδες)"
          />
          <ToggleButton
            active={!includeTypology}
            onClick={() => setIncludeTypology(false)}
            label="Μόνο πρέπει-να-θυμάσαι (1 σελίδα)"
          />
        </div>
      </div>

      {/* Honest banner — bring-your-own permission is hearsay. */}
      <div className="mt-5 flex max-w-3xl gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden />
        <div className="space-y-1.5 text-fg">
          <p>
            <strong>Σημείωση:</strong> σύμφωνα με συζητήσεις φοιτητών στο Δήλος
            (περασμένα έτη), ο καθηγητής επιτρέπει να φέρεις και{' '}
            <em>δικό σου</em> τυπολόγιο επιπλέον του επίσημου.{' '}
            <strong>Επιβεβαίωσε με τον καθηγητή πριν την εξέταση</strong> —
            δεν είναι 100% επιβεβαιωμένο για φέτος.
          </p>
          <p className="text-xs text-fg-muted">
            Σε κάθε περίπτωση, αυτή η πινακίδα είναι χρήσιμη σαν study sheet —
            όλο το υλικό σε ένα μέρος, οργανωμένο σε γκρουπ που ταιριάζουν με
            τα συνηθισμένα themes της εξέτασης.
          </p>
        </div>
      </div>
    </header>
  )
}

function ToggleButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        'rounded px-2.5 py-1 font-medium transition',
        active
          ? 'bg-accent text-white shadow-sm'
          : 'text-fg-muted hover:text-fg',
      )}
    >
      {label}
    </button>
  )
}

function PaperPage({
  page,
  pageIndex,
  totalPages,
}: {
  page: (typeof CHEATSHEET_PAGES)[number]
  pageIndex: number
  totalPages: number
}) {
  return (
    <article
      className={cn(
        'cheatsheet-paper',
        // Screen-only "paper" appearance — A4-ish proportions enforced via
        // min-height rather than aspect-ratio so dense content can't be
        // silently clipped on screen.
        'mx-auto bg-white text-slate-900 shadow-xl ring-1 ring-slate-200',
        'w-full max-w-[820px]',
        // Approximate A4 height at the 820px width cap (297/210 × 820 ≈ 1160).
        // min-height gives the "page" feel without hiding overflow.
        'min-h-[1160px]',
        // Page break in print — start each subsequent page on a fresh sheet.
        pageIndex > 0 && 'cheatsheet-page-break',
      )}
      data-page-index={pageIndex}
    >
      <div className="flex flex-col px-3 py-2">
        {/* Paper header */}
        <div className="flex items-baseline justify-between border-b border-slate-300 pb-0.5">
          <h2 className="text-[12px] font-bold tracking-tight text-slate-900">
            {page.label}
          </h2>
          <span className="text-[9px] text-slate-500">
            {pageIndex + 1} / {totalPages} · Συστήματα Επικοινωνιών K21
          </span>
        </div>
        <p className="text-[9px] italic text-slate-600">{page.kicker}</p>

        {/* Decision tree only on page 1 — full-width band above the grid */}
        {pageIndex === 0 && <DecisionTreeCard />}

        {/* Groups — column flow. 3 columns everywhere; short groups fit
            cleanly side-by-side, heavier groups (Conventional AM, FM) flow
            naturally across a longer column. CSS columns balances the
            heights and handles variable group sizes; break-inside-avoid on
            each group prevents mid-card splits. */}
        <div className="cheatsheet-grid mt-1.5 columns-3 gap-x-2">
          {page.groups.map((group) => (
            <div key={group.id} className="mb-1.5 break-inside-avoid">
              <CheatsheetGroupCard group={group} />
            </div>
          ))}
        </div>

        {/* Pitfalls callout only on page 2 — full-width band at the bottom,
            grouped with the τυπολόγιο since pitfalls are reminder content
            and the must-memorize page should stay maximally dense. */}
        {pageIndex === 1 && <PitfallsCard />}
      </div>
    </article>
  )
}

function DecisionTreeCard() {
  return (
    <section
      id="decision-tree"
      className="mt-1 rounded border border-slate-400 bg-slate-50 px-1.5 py-1"
      aria-label="Πρώτο πράγμα που σκέφτομαι"
    >
      <div className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-700">
        <Lightbulb className="h-2.5 w-2.5" aria-hidden />
        Πρώτο πράγμα που σκέφτομαι
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-0 text-[8.5px] leading-[1.15] text-slate-800">
        {CHEATSHEET_DECISION_TREE.map((row, i) => (
          <li key={i} className="flex items-baseline gap-1">
            <span className="shrink-0 text-slate-600">{row.trigger}</span>
            <ArrowRight className="h-2 w-2 shrink-0 text-slate-400" aria-hidden />
            <span className="font-medium text-slate-900">{row.goTo}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function PitfallsCard() {
  return (
    <section
      className="mt-1 rounded border-2 border-red-500 bg-red-50 px-1.5 py-1"
      aria-label="Δεν ξεχνάω"
    >
      <div className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-red-800">
        <AlertTriangle className="h-2.5 w-2.5" aria-hidden />
        ΔΕΝ ξεχνάω
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-0 text-[8.5px] leading-[1.15] text-slate-800">
        {CHEATSHEET_PITFALLS.map((p, i) => (
          <li key={i}>
            <span className="mr-0.5 text-red-700">•</span>
            {p}
          </li>
        ))}
      </ul>
    </section>
  )
}

function CheatsheetGroupCard({ group }: { group: CheatsheetGroup }) {
  return (
    <section
      id={group.id}
      className={cn(
        'cheatsheet-group break-inside-avoid rounded border-l-[3px] px-1.5 py-1',
        TOPIC_BAND[group.topic],
      )}
    >
      <div className="flex items-baseline justify-between gap-1.5 leading-tight">
        <h3 className={cn('text-[10.5px] font-bold tracking-tight', TOPIC_TEXT[group.topic])}>
          {group.title}
        </h3>
      </div>
      <p className="text-[8.5px] italic leading-tight text-slate-700">
        Όταν δεις · {group.radar}
      </p>

      <ul className="mt-0.5 list-none space-y-0.5 pl-0">
        {group.slots.map((slot) => (
          <FormulaSlotItem key={slot.id} slot={slot} />
        ))}
      </ul>

      {group.footnote && (
        <p className="mt-0.5 border-t border-slate-300/70 pt-0.5 text-[8.5px] leading-tight text-slate-700">
          {group.footnote}
        </p>
      )}
    </section>
  )
}

function FormulaSlotItem({ slot }: { slot: CheatsheetFormulaSlot }) {
  const entry = FORMULA_BY_ID[slot.id]
  if (!entry) {
    return (
      <li className="text-[10px] italic text-red-600">
        ⚠️ Missing formula entry: {slot.id}
      </li>
    )
  }
  const title = slot.shortTitle ?? entry.title

  return (
    <li className="cheatsheet-formula leading-[1.05]">
      <div className="text-[9.5px] font-semibold text-slate-900">{title}</div>
      <div className="cheatsheet-math text-slate-900 leading-[1.05]">{entry.content}</div>
      {slot.note && (
        <div className="text-[8.5px] leading-tight text-slate-700">
          {slot.note}
        </div>
      )}
    </li>
  )
}
