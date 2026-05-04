import { cn } from '@/lib/utils'

/**
 * Reusable input → box → output diagram. Used as a generic system illustration
 * across the systems chapter.
 */
export function SystemBoxDiagram({
  inputLabel = 'x(t)',
  outputLabel = 'y(t)',
  boxLabel = 'S',
  className,
}: {
  inputLabel?: string
  outputLabel?: string
  boxLabel?: string
  className?: string
}) {
  return (
    <figure className={cn('my-4 rounded-md border border-border bg-bg-elevated p-3', className)}>
      <svg viewBox="0 0 360 90" className="w-full" role="img" aria-label="Διάγραμμα συστήματος">
        <defs>
          <marker id="sys-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(var(--fg-muted))" />
          </marker>
        </defs>
        {/* input arrow */}
        <line x1="20" y1="45" x2="120" y2="45" stroke="rgb(var(--fg-muted))" strokeWidth="2" markerEnd="url(#sys-arrow)" />
        <text x="65" y="36" textAnchor="middle" className="fill-fg font-mono text-sm">{inputLabel}</text>
        {/* box */}
        <rect x="125" y="20" width="110" height="50" rx="6" fill="rgb(var(--accent-soft))" stroke="rgb(var(--accent))" strokeWidth="2" />
        <text x="180" y="50" textAnchor="middle" className="fill-fg text-base font-semibold tracking-tight">{boxLabel}</text>
        {/* output arrow */}
        <line x1="240" y1="45" x2="340" y2="45" stroke="rgb(var(--fg-muted))" strokeWidth="2" markerEnd="url(#sys-arrow)" />
        <text x="290" y="36" textAnchor="middle" className="fill-fg font-mono text-sm">{outputLabel}</text>
      </svg>
    </figure>
  )
}

/** Two LTI systems h₁, h₂ in cascade, equivalent to one box with h₁ ⊛ h₂. */
export function CascadeDiagram() {
  return (
    <figure className="my-4 rounded-md border border-border bg-bg-elevated p-3">
      <svg viewBox="0 0 460 130" className="w-full" role="img" aria-label="Cascade of two LTI systems">
        <defs>
          <marker id="cas-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(var(--fg-muted))" />
          </marker>
        </defs>
        {/* Top: cascade */}
        <line x1="10" y1="30" x2="80" y2="30" stroke="rgb(var(--fg-muted))" strokeWidth="2" markerEnd="url(#cas-arrow)" />
        <text x="42" y="22" textAnchor="middle" className="fill-fg font-mono text-xs">x(t)</text>
        <rect x="85" y="12" width="70" height="36" rx="5" fill="rgb(var(--accent-soft))" stroke="rgb(var(--accent))" strokeWidth="2" />
        <text x="120" y="35" textAnchor="middle" className="fill-fg font-mono text-sm">h₁(t)</text>
        <line x1="160" y1="30" x2="220" y2="30" stroke="rgb(var(--fg-muted))" strokeWidth="2" markerEnd="url(#cas-arrow)" />
        <rect x="225" y="12" width="70" height="36" rx="5" fill="rgb(var(--accent-soft))" stroke="rgb(var(--accent))" strokeWidth="2" />
        <text x="260" y="35" textAnchor="middle" className="fill-fg font-mono text-sm">h₂(t)</text>
        <line x1="300" y1="30" x2="380" y2="30" stroke="rgb(var(--fg-muted))" strokeWidth="2" markerEnd="url(#cas-arrow)" />
        <text x="340" y="22" textAnchor="middle" className="fill-fg font-mono text-xs">y(t)</text>

        {/* Equivalence sign */}
        <text x="225" y="72" textAnchor="middle" className="fill-fg-muted text-xl">≡</text>

        {/* Bottom: combined */}
        <line x1="10" y1="100" x2="120" y2="100" stroke="rgb(var(--fg-muted))" strokeWidth="2" markerEnd="url(#cas-arrow)" />
        <text x="65" y="92" textAnchor="middle" className="fill-fg font-mono text-xs">x(t)</text>
        <rect x="125" y="82" width="170" height="36" rx="5" fill="rgb(var(--accent-soft))" stroke="rgb(var(--accent))" strokeWidth="2" />
        <text x="210" y="105" textAnchor="middle" className="fill-fg font-mono text-sm">h₁(t) ⊛ h₂(t)</text>
        <line x1="300" y1="100" x2="380" y2="100" stroke="rgb(var(--fg-muted))" strokeWidth="2" markerEnd="url(#cas-arrow)" />
        <text x="340" y="92" textAnchor="middle" className="fill-fg font-mono text-xs">y(t)</text>
      </svg>
      <figcaption className="mt-1 text-center text-xs text-fg-muted">
        Δύο LTI σε σειρά ⟺ ένα LTI με h₁ ⊛ h₂.
      </figcaption>
    </figure>
  )
}

/** Two LTI systems h₁, h₂ in parallel (same input, summed outputs), equivalent to h₁ + h₂. */
export function ParallelDiagram() {
  return (
    <figure className="my-4 rounded-md border border-border bg-bg-elevated p-3">
      <svg viewBox="0 0 460 200" className="w-full" role="img" aria-label="Parallel composition of two LTI systems">
        <defs>
          <marker id="par-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(var(--fg-muted))" />
          </marker>
        </defs>
        {/* split node */}
        <circle cx="80" cy="65" r="3" fill="rgb(var(--fg))" />
        <line x1="10" y1="65" x2="80" y2="65" stroke="rgb(var(--fg-muted))" strokeWidth="2" />
        <text x="40" y="58" textAnchor="middle" className="fill-fg font-mono text-xs">x(t)</text>
        {/* up to h1 */}
        <line x1="80" y1="65" x2="80" y2="32" stroke="rgb(var(--fg-muted))" strokeWidth="2" />
        <line x1="80" y1="32" x2="135" y2="32" stroke="rgb(var(--fg-muted))" strokeWidth="2" markerEnd="url(#par-arrow)" />
        <rect x="140" y="14" width="70" height="36" rx="5" fill="rgb(var(--accent-soft))" stroke="rgb(var(--accent))" strokeWidth="2" />
        <text x="175" y="37" textAnchor="middle" className="fill-fg font-mono text-sm">h₁(t)</text>
        {/* down to h2 */}
        <line x1="80" y1="65" x2="80" y2="98" stroke="rgb(var(--fg-muted))" strokeWidth="2" />
        <line x1="80" y1="98" x2="135" y2="98" stroke="rgb(var(--fg-muted))" strokeWidth="2" markerEnd="url(#par-arrow)" />
        <rect x="140" y="80" width="70" height="36" rx="5" fill="rgb(var(--accent-soft))" stroke="rgb(var(--accent))" strokeWidth="2" />
        <text x="175" y="103" textAnchor="middle" className="fill-fg font-mono text-sm">h₂(t)</text>
        {/* sum junction */}
        <line x1="215" y1="32" x2="290" y2="32" stroke="rgb(var(--fg-muted))" strokeWidth="2" />
        <line x1="290" y1="32" x2="290" y2="59" stroke="rgb(var(--fg-muted))" strokeWidth="2" />
        <line x1="215" y1="98" x2="290" y2="98" stroke="rgb(var(--fg-muted))" strokeWidth="2" />
        <line x1="290" y1="98" x2="290" y2="71" stroke="rgb(var(--fg-muted))" strokeWidth="2" />
        <circle cx="290" cy="65" r="10" fill="rgb(var(--bg-elevated))" stroke="rgb(var(--accent))" strokeWidth="1.5" />
        <text x="290" y="69" textAnchor="middle" className="fill-fg text-sm font-semibold">+</text>
        {/* output */}
        <line x1="300" y1="65" x2="380" y2="65" stroke="rgb(var(--fg-muted))" strokeWidth="2" markerEnd="url(#par-arrow)" />
        <text x="340" y="58" textAnchor="middle" className="fill-fg font-mono text-xs">y(t)</text>

        {/* Equivalence sign */}
        <text x="225" y="148" textAnchor="middle" className="fill-fg-muted text-xl">≡</text>

        {/* Bottom: combined */}
        <line x1="10" y1="178" x2="120" y2="178" stroke="rgb(var(--fg-muted))" strokeWidth="2" markerEnd="url(#par-arrow)" />
        <text x="65" y="170" textAnchor="middle" className="fill-fg font-mono text-xs">x(t)</text>
        <rect x="125" y="160" width="170" height="36" rx="5" fill="rgb(var(--accent-soft))" stroke="rgb(var(--accent))" strokeWidth="2" />
        <text x="210" y="183" textAnchor="middle" className="fill-fg font-mono text-sm">h₁(t) + h₂(t)</text>
        <line x1="300" y1="178" x2="380" y2="178" stroke="rgb(var(--fg-muted))" strokeWidth="2" markerEnd="url(#par-arrow)" />
        <text x="340" y="170" textAnchor="middle" className="fill-fg font-mono text-xs">y(t)</text>
      </svg>
      <figcaption className="mt-1 text-center text-xs text-fg-muted">
        Δύο LTI παράλληλα ⟺ ένα LTI με h₁ + h₂.
      </figcaption>
    </figure>
  )
}
