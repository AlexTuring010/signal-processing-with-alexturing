import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  /** Identifier of the registered visualization (e.g. "am-demo", "fourier-explorer"). */
  name: string
  /** Optional caption shown below the placeholder. */
  caption?: string
  className?: string
}

/**
 * Mounts an interactive visualization by name. During bootstrap, we only have
 * the placeholder render path — once a real Viz component is built, we'll
 * register it here and the placeholder falls away.
 */
export function Viz({ name, caption, className }: Props) {
  // Registry: { 'am-demo': <AMDemo />, ... } — empty for now.
  const registered: Record<string, React.ReactNode> = {}
  const node = registered[name]

  if (node) {
    return <div className={cn('my-6', className)}>{node}</div>
  }

  return (
    <figure
      className={cn(
        'my-6 overflow-hidden rounded-lg border border-dashed border-border bg-bg-soft',
        className,
      )}
    >
      <div className="flex aspect-[16/9] flex-col items-center justify-center gap-3 px-4 text-center">
        <Sparkles className="h-7 w-7 text-accent/70" aria-hidden="true" />
        <div>
          <div className="text-sm font-semibold tracking-tight text-fg">
            Interactive viz
          </div>
          <code className="mt-1 inline-block rounded bg-bg-elevated px-2 py-0.5 text-xs text-fg-muted">
            {name}
          </code>
          <p className="mt-2 text-xs text-fg-subtle">
            Έρχεται σύντομα — placeholder για το build harness.
          </p>
        </div>
      </div>
      {caption && (
        <figcaption className="border-t border-border bg-bg-elevated px-4 py-2 text-xs text-fg-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
