'use client'

/**
 * AM trade-off space.
 *
 * Each of the four AM variants is shown as a profile across three axes:
 *   - Power efficiency (η — how much of the transmitted power carries info)
 *   - Bandwidth efficiency (less B for the same W = better)
 *   - Receiver simplicity (envelope detector = highest)
 *
 * The student picks a variant chip to highlight it. The chart layout makes
 * trade-offs obvious at a glance: rows = axes (compare across variants),
 * columns = variants (read a single variant's strength/weakness profile).
 *
 * Why this matters here: the AM overview is the LAST place the student sees
 * all four variants together before plunging into each chapter individually.
 * Making the trade-off visible up front lets each later chapter answer "why
 * does this variant exist?" against a concrete picture, not in abstract.
 */

import { useState } from 'react'
import { cn } from '@/lib/utils'

type VariantId = 'am' | 'dsb-sc' | 'ssb' | 'vsb'

type Variant = {
  id: VariantId
  label: string
  /** 0..1 — fraction of transmitted power that carries info (η, normalised). */
  power: number
  /** 0..1 — 1 = best (smallest B/W ratio); 0 = worst. */
  bandwidth: number
  /** 0..1 — 1 = simplest receiver (envelope detector); 0 = most complex. */
  rxSimplicity: number
  /** Short verdict shown when the variant is highlighted. */
  verdict: string
}

const VARIANTS: Variant[] = [
  {
    id: 'am',
    label: 'Conventional AM',
    power: 0.25, // η ≤ 33% at best
    bandwidth: 0.5, // B = 2W
    rxSimplicity: 1.0, // envelope detector
    verdict:
      'Νικητής στη απλότητα δέκτη. Σπαταλά ισχύ. AM ραδιόφωνο: ο δέκτης πρέπει να κοστίζει ευρώ, όχι εκατοντάδες.',
  },
  {
    id: 'dsb-sc',
    label: 'DSB-SC',
    power: 1.0, // 100% στο μήνυμα
    bandwidth: 0.5, // B = 2W
    rxSimplicity: 0.45, // coherent demod
    verdict:
      'Όλη η ισχύς πάει στο μήνυμα — αλλά ίδιο bandwidth με AM και πιο πολύπλοκος δέκτης (coherent).',
  },
  {
    id: 'ssb',
    label: 'SSB',
    power: 1.0, // δεν υπάρχει carrier loss
    bandwidth: 1.0, // B = W — μισό!
    rxSimplicity: 0.20, // coherent + φίλτρο/Hilbert στον πομπό
    verdict:
      'Νικητής σε ισχύ ΚΑΙ bandwidth. Πληρώνει με το πιο πολύπλοκο σχήμα — πομπός χρειάζεται Hilbert ή sharp φίλτρο.',
  },
  {
    id: 'vsb',
    label: 'VSB',
    power: 0.55,
    bandwidth: 0.8, // B ≈ 1.25W
    rxSimplicity: 0.75, // envelope detector με μικρή παραμόρφωση
    verdict:
      'Συμβιβασμός: σχεδόν SSB σε bandwidth, σχεδόν AM σε πολυπλοκότητα δέκτη. Γιατί η αναλογική TV το επέλεξε.',
  },
]

type AxisId = 'power' | 'bandwidth' | 'rxSimplicity'

const AXES: { id: AxisId; label: string; hint: string }[] = [
  {
    id: 'power',
    label: 'Power efficiency',
    hint: 'πόση από την εκπεμπόμενη ισχύ κουβαλάει πληροφορία (η)',
  },
  {
    id: 'bandwidth',
    label: 'Bandwidth efficiency',
    hint: 'μικρότερο B για το ίδιο message bandwidth W',
  },
  {
    id: 'rxSimplicity',
    label: 'Receiver simplicity',
    hint: 'envelope detector vs coherent · χωρίς PLL vs με PLL',
  },
]

const VARIANT_COLORS: Record<VariantId, string> = {
  am: 'rgb(217, 119, 6)', // amber
  'dsb-sc': 'rgb(29, 78, 216)', // blue
  ssb: 'rgb(190, 18, 60)', // rose
  vsb: 'rgb(101, 163, 13)', // lime
}

export function AMTradeoffSpace() {
  const [highlight, setHighlight] = useState<VariantId | null>(null)

  const highlighted = highlight !== null ? VARIANTS.find((v) => v.id === highlight) ?? null : null

  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Ο χώρος των trade-offs — πού ζει η κάθε παραλλαγή
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Τρεις άξονες, τέσσερις παραλλαγές. Καμία δεν είναι «καλύτερη παντού» —
        η σχεδίαση συστήματος είναι να διαλέξεις σε ποια θυσία είσαι διατεθειμένος
        να μπεις. Πάτα μια παραλλαγή για να την φωτίσεις.
      </p>

      <div className="mb-3 flex flex-wrap gap-1">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            aria-pressed={highlight === v.id}
            onClick={() => setHighlight(highlight === v.id ? null : v.id)}
            className={cn(
              'rounded-full border px-3 py-1 text-[11px] font-medium transition',
              highlight === v.id
                ? 'border-fg bg-fg text-bg-elevated shadow-sm'
                : 'border-border bg-bg-elevated text-fg-muted hover:border-fg/40 hover:text-fg',
            )}
            style={
              highlight === v.id
                ? { backgroundColor: VARIANT_COLORS[v.id], borderColor: VARIANT_COLORS[v.id], color: 'white' }
                : undefined
            }
          >
            {v.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse text-[12px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="sticky left-0 z-10 bg-bg-elevated px-2 py-1.5 font-semibold text-fg-subtle">
                Άξονας →
              </th>
              {VARIANTS.map((v) => (
                <th
                  key={v.id}
                  className={cn(
                    'px-2 py-1.5 text-center font-semibold transition',
                    highlight === v.id && 'text-fg',
                  )}
                  style={highlight === v.id ? { color: VARIANT_COLORS[v.id] } : undefined}
                >
                  {v.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {AXES.map((axis) => (
              <tr key={axis.id} className="border-b border-border/60 align-top">
                <td className="sticky left-0 z-10 bg-bg-elevated px-2 py-2 align-top">
                  <div className="font-semibold tracking-tight">{axis.label}</div>
                  <div className="text-[10px] text-fg-subtle">{axis.hint}</div>
                </td>
                {VARIANTS.map((v) => {
                  const val = v[axis.id]
                  const dim = highlight !== null && highlight !== v.id
                  return (
                    <td key={v.id} className="px-2 py-2">
                      <Bar
                        value={val}
                        color={VARIANT_COLORS[v.id]}
                        dim={dim}
                      />
                      <div
                        className={cn(
                          'mt-0.5 text-[10px] tabular-nums',
                          dim ? 'text-fg-subtle/50' : 'text-fg-subtle',
                        )}
                      >
                        {Math.round(val * 100)}%
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {highlighted && (
        <div
          className="mt-3 rounded-md border px-3 py-2 text-[12px] leading-relaxed"
          style={{
            borderColor: VARIANT_COLORS[highlighted.id],
            backgroundColor: 'transparent',
          }}
        >
          <span className="font-semibold" style={{ color: VARIANT_COLORS[highlighted.id] }}>
            {highlighted.label}:
          </span>{' '}
          {highlighted.verdict}
        </div>
      )}

      <p className="mt-3 text-[11px] leading-relaxed text-fg-muted">
        Παρατήρησε: η <strong>SSB</strong> ισοπεδώνει τους δύο πρώτους άξονες —
        και θα πληρώσει για αυτό στο <code>/am/ssb</code>. Η{' '}
        <strong>Conventional AM</strong> ζει στην απλότητα δέκτη. Η{' '}
        <strong>VSB</strong> δεν είναι πρώτη πουθενά — αλλά είναι «καλούτσικη»
        παντού, γι' αυτό την επέλεξε η αναλογική TV.
      </p>
    </figure>
  )
}

function Bar({ value, color, dim }: { value: number; color: string; dim: boolean }) {
  return (
    <div
      className="relative h-3 w-full overflow-hidden rounded-sm bg-bg-soft"
      role="meter"
      aria-valuenow={Math.round(value * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="absolute inset-y-0 left-0 transition-[width] duration-300"
        style={{
          width: `${Math.max(2, value * 100)}%`,
          backgroundColor: color,
          opacity: dim ? 0.25 : 0.85,
        }}
      />
    </div>
  )
}
