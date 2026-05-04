import type { MDXComponents } from 'mdx/types'
import { Callout } from '@/components/content/Callout'
import { Example } from '@/components/content/Example'
import { LabBox } from '@/components/content/LabBox'
import { Recap } from '@/components/content/Recap'
import { NextUp } from '@/components/content/NextUp'
import { ExamProblem } from '@/components/content/ExamProblem'
import { Timeline } from '@/components/content/Timeline'
import { Viz } from '@/components/viz/Viz'
import { CommSystemDiagram } from '@/components/viz/CommSystemDiagram'
import { TimeFrequencyTeaser } from '@/components/viz/TimeFrequencyTeaser'
import { AntennaSizeDemo } from '@/components/viz/AntennaSizeDemo'
import { EMSpectrumExplorer } from '@/components/viz/EMSpectrumExplorer'
import { PeopleTalkingDiagram } from '@/components/viz/PeopleTalkingDiagram'
import { DuplexAnimation } from '@/components/viz/DuplexAnimation'
import { RoadmapGrid } from '@/components/viz/RoadmapGrid'
import { Tabs } from '@/components/ui/Tabs'
import { Collapsible } from '@/components/ui/Collapsible'
import { Eq, InlineMath, BlockMath } from '@/components/math'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Content building blocks
    Callout,
    Example,
    LabBox,
    Recap,
    NextUp,
    ExamProblem,
    Timeline,

    // Math
    Eq,
    InlineMath,
    BlockMath,

    // UI
    Tabs,
    Collapsible,

    // Visualizations
    Viz,
    CommSystemDiagram,
    TimeFrequencyTeaser,
    AntennaSizeDemo,
    EMSpectrumExplorer,
    PeopleTalkingDiagram,
    DuplexAnimation,
    RoadmapGrid,

    ...components,
  }
}
