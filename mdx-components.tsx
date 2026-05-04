import type { MDXComponents } from 'mdx/types'
import { Callout } from '@/components/content/Callout'
import { Example } from '@/components/content/Example'
import { LabBox } from '@/components/content/LabBox'
import { Recap } from '@/components/content/Recap'
import { NextUp } from '@/components/content/NextUp'
import { ExamProblem } from '@/components/content/ExamProblem'
import { Viz } from '@/components/viz/Viz'
import { Eq, InlineMath, BlockMath } from '@/components/math'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Callout,
    Example,
    LabBox,
    Recap,
    NextUp,
    ExamProblem,
    Viz,
    Eq,
    InlineMath,
    BlockMath,
    ...components,
  }
}
