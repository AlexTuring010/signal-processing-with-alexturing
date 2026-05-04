type Item = {
  year: string
  title: string
  blurb?: string
}

type Props = {
  items: Item[]
}

export function Timeline({ items }: Props) {
  return (
    <ol className="relative my-2 ml-2 border-l-2 border-border pl-4">
      {items.map((item, i) => (
        <li key={i} className="mb-4 last:mb-0">
          <div className="absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full border-2 border-accent bg-bg" />
          <div className="text-sm font-semibold tracking-tight text-fg">
            <span className="text-fg-subtle tabular-nums">{item.year}</span>{' '}
            <span className="ml-1">·</span> {item.title}
          </div>
          {item.blurb && (
            <p className="mt-0.5 text-sm text-fg-muted">{item.blurb}</p>
          )}
        </li>
      ))}
    </ol>
  )
}
