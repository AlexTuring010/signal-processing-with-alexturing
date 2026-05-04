import type { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'

type Props = {
  title?: string
  children: ReactNode
}

export function Recap({ title = 'Τι μάθαμε', children }: Props) {
  return (
    <section className="mt-10 rounded-lg border border-success/30 bg-success/5 px-5 py-4">
      <h2 className="mb-2 flex items-center gap-2 text-base font-semibold tracking-tight !mt-0">
        <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
        {title}
      </h2>
      <div className="text-[0.95rem] leading-relaxed [&>ul]:!my-0 [&>ul>li]:my-1">
        {children}
      </div>
    </section>
  )
}
