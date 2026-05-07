'use client'

import { useEffect, useState } from 'react'
import { Check, FlaskConical, Lock, Play, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOrchardStore } from '@/lib/orchard/store'
import {
  ALL_RESEARCH,
  TIER_NAMES,
  getResearchNode,
  isAvailable,
  type ResearchNode,
  type ResearchTier,
} from '@/lib/orchard/research'
import { playOrchardSound } from '@/lib/orchard/audio'

/**
 * Research tab. Lists all 12 nodes by tier with inline status / actions.
 * Header shows 🧪 stock and the active job (if any) with a progress bar
 * + cancel control. Sized for the 280-px panel; scrolls vertically.
 */
export function ResearchPanel() {
  const research = useOrchardStore((s) => s.state.resources.research)
  const tree = useOrchardStore((s) => s.state.researchTree)
  const state = useOrchardStore((s) => s.state)
  const startResearch = useOrchardStore((s) => s.startResearch)
  const cancelResearch = useOrchardStore((s) => s.cancelResearch)

  // 500-ms heartbeat so the in-flight progress bar advances visibly.
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500)
    return () => window.clearInterval(id)
  }, [])

  const job = tree.inProgress
  const jobNode = job ? getResearchNode(job.id) : null
  const jobProgress = job
    ? Math.max(0, Math.min(1, (now - job.startedAt) / job.durationMs))
    : 0
  const jobRemainingMs = job
    ? Math.max(0, job.startedAt + job.durationMs - now)
    : 0

  const tiers: ResearchTier[] = [1, 2, 3, 4]

  return (
    <section className="flex h-full flex-col gap-2 overflow-y-auto p-2.5">
      <header>
        <h3 className="text-xs font-semibold">Έρευνα</h3>
        <p className="mt-0.5 text-[10px] leading-snug text-fg-muted">
          Ξεκλείδωσε μόνιμες αναβαθμίσεις. Οι μηλιές παράγουν 🧪 σιγά-σιγά.
        </p>
      </header>

      <div className="flex items-center justify-between rounded-xl border border-border bg-bg-soft/40 px-2 py-1.5 text-[11px]">
        <span className="font-medium">Διαθέσιμη έρευνα</span>
        <span className="font-semibold tabular-nums">
          🧪 {research.toFixed(1)}
        </span>
      </div>

      {job && jobNode && (
        <div className="rounded-xl border border-accent/40 bg-accent-soft/30 p-2">
          <div className="mb-1.5 flex items-center justify-between gap-1 text-[11px]">
            <span className="inline-flex items-center gap-1 font-semibold">
              <FlaskConical className="h-3 w-3 text-accent" aria-hidden="true" />
              {jobNode.name}
            </span>
            <button
              type="button"
              onClick={() => {
                playOrchardSound('click')
                cancelResearch()
              }}
              title="Ακύρωση (επιστροφή 50% κόστους)"
              aria-label="Ακύρωση έρευνας"
              className="inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] text-fg-subtle hover:bg-bg-soft hover:text-fg"
            >
              <XCircle className="h-3 w-3" />
              Ακύρωση
            </button>
          </div>
          <div className="relative h-1.5 overflow-hidden rounded-full bg-bg-elevated">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-300"
              style={{ width: `${jobProgress * 100}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-fg-subtle tabular-nums">
            {formatRemaining(jobRemainingMs)} απομένουν
          </p>
        </div>
      )}

      {tiers.map((tier) => {
        const nodes = ALL_RESEARCH.filter((n) => n.tier === tier)
        return (
          <div key={tier} className="flex flex-col gap-1">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-fg-subtle">
              Tier {tier} · {TIER_NAMES[tier]}
            </h4>
            <ul className="flex flex-col gap-1">
              {nodes.map((node) => (
                <NodeCard
                  key={node.id}
                  node={node}
                  done={tree.completed.includes(node.id)}
                  inProgress={tree.inProgress?.id === node.id}
                  available={isAvailable(state, node)}
                  research={research}
                  onStart={() => startResearch(node.id)}
                />
              ))}
            </ul>
          </div>
        )
      })}
    </section>
  )
}

function NodeCard({
  node,
  done,
  inProgress,
  available,
  research,
  onStart,
}: {
  node: ResearchNode
  done: boolean
  inProgress: boolean
  available: boolean
  research: number
  onStart: () => void
}) {
  const canAfford = research >= node.cost

  let lockedReason: string | null = null
  if (!available && !done && !inProgress) {
    if (node.requires.length > 0) {
      const reqNames = node.requires
        .map((id) => getResearchNode(id)?.name)
        .filter(Boolean)
      lockedReason = `Πρώτα: ${reqNames.join(' ή ')}`
    }
  }

  return (
    <li
      className={cn(
        'rounded-lg border p-1.5',
        done
          ? 'border-success/30 bg-success/10'
          : inProgress
            ? 'border-accent/40 bg-accent-soft/30'
            : available
              ? 'border-border bg-bg-soft/40'
              : 'border-dashed border-border/60 bg-bg-soft/20 opacity-70',
      )}
    >
      <div className="flex items-start gap-1.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[11px] font-semibold leading-tight">
            <span className="truncate">{node.name}</span>
            {done && <Check className="h-3 w-3 text-success" aria-hidden="true" />}
            {!done && !inProgress && !available && (
              <Lock className="h-3 w-3 text-fg-subtle" aria-hidden="true" />
            )}
          </div>
          <p className="mt-0.5 text-[10px] leading-snug text-fg-muted">
            {node.description}
          </p>
        </div>
        {!done && !inProgress && (
          <button
            type="button"
            onClick={onStart}
            disabled={!available || !canAfford}
            title={
              !available
                ? 'Δεν είναι διαθέσιμη'
                : !canAfford
                  ? `Χρειάζονται ${node.cost} 🧪`
                  : `Έναρξη (${node.cost} 🧪 · ${formatRemaining(node.durationMs)})`
            }
            className={cn(
              'inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-[10px] font-medium transition-transform',
              available && canAfford
                ? 'bg-accent text-accent-fg shadow-sm hover:scale-[1.02] active:scale-95'
                : 'cursor-not-allowed bg-bg-elevated text-fg-subtle',
            )}
          >
            <Play className="h-2.5 w-2.5 fill-current" aria-hidden="true" />
            {node.cost} 🧪
          </button>
        )}
      </div>
      {!done && !inProgress && (
        <p className="mt-1 text-[9px] text-fg-subtle">
          ⏱ {formatRemaining(node.durationMs)}
          {lockedReason && ` · 🔒 ${lockedReason}`}
        </p>
      )}
      {done && (
        <p className="mt-1 text-[9px] font-medium text-success">
          ✓ Ενεργό
        </p>
      )}
    </li>
  )
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return '—'
  const s = Math.ceil(ms / 1000)
  if (s < 60) return `${s}δ`
  const m = Math.floor(s / 60)
  const rs = s % 60
  if (m < 60) return rs === 0 ? `${m}λ` : `${m}λ ${rs}δ`
  const h = Math.floor(m / 60)
  const rm = m % 60
  return rm === 0 ? `${h}ω` : `${h}ω ${rm}λ`
}
