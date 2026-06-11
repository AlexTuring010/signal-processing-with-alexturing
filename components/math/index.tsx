/**
 * Math rendering helpers.
 *
 * For MDX bodies, math is most ergonomically written with `$...$` and `$$...$$`
 * — those are handled by remark-math + rehype-katex at build time and need no
 * component. These wrappers are for the cases where we want:
 *   - an explicit, named equation we can link to (`<Eq id="eq:am-signal">`)
 *   - to drop math into a TSX component (`<InlineMath>{'\\beta'}</InlineMath>`)
 */

import 'katex/dist/katex.min.css'
import katex from 'katex'
import { cn } from '@/lib/utils'

type Props = {
  children: string
  className?: string
}

export function InlineMath({ children, className }: Props) {
  const html = katex.renderToString(children, {
    throwOnError: false,
    displayMode: false,
    output: 'html',
  })
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}

/**
 * Renders a plain string that may contain inline `$...$` math segments.
 *
 * For component *props* (e.g. a Callout/Example `title`), MDX's build-time
 * `$...$` handling does not apply — the prop is just a string, so any math in
 * it would otherwise render as literal `$...$` text. Wrap such strings in
 * `<MathText>` to render the math. Strings with no `$` pass through unchanged.
 */
export function MathText({ children }: { children: string }) {
  if (!children.includes('$')) return <>{children}</>
  // split() with a capture group interleaves [text, math, text, math, ...]:
  // even indices are literal text, odd indices are the math between $…$.
  const parts = children.split(/\$([^$]+)\$/g)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? <InlineMath key={i}>{part}</InlineMath> : part,
      )}
    </>
  )
}

export function BlockMath({ children, className }: Props) {
  const html = katex.renderToString(children, {
    throwOnError: false,
    displayMode: true,
    output: 'html',
  })
  return (
    <div
      className={cn('my-5 overflow-x-auto', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

type EqProps = {
  id?: string
  children: string
  /** Optional small label rendered to the right (e.g. "(1)" or "Carson's rule") */
  label?: string
  className?: string
}

export function Eq({ id, children, label, className }: EqProps) {
  const html = katex.renderToString(children, {
    throwOnError: false,
    displayMode: true,
    output: 'html',
  })
  return (
    <div
      id={id}
      className={cn(
        'group relative my-5 flex items-center justify-center rounded-lg border border-border/60 bg-bg-soft/40 px-4 py-3',
        className,
      )}
    >
      <div className="flex-1 overflow-x-auto" dangerouslySetInnerHTML={{ __html: html }} />
      {label && (
        <span className="ml-3 shrink-0 text-sm text-fg-muted tabular-nums">{label}</span>
      )}
    </div>
  )
}
