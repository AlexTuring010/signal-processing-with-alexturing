import type { MDXComponents } from 'mdx/types'
import type { HTMLAttributes, ReactNode } from 'react'
import { isValidElement } from 'react'
import { SectionComments } from '@/components/layout/SectionComments'
import { Callout } from '@/components/content/Callout'
import { Example } from '@/components/content/Example'
import { LabBox } from '@/components/content/LabBox'
import { Recap } from '@/components/content/Recap'
import { NextUp } from '@/components/content/NextUp'
import { ExamProblem } from '@/components/content/ExamProblem'
import { ExerciseProgress } from '@/components/content/ExerciseProgress'
import { Timeline } from '@/components/content/Timeline'
import { SourceDoc } from '@/components/content/SourceDoc'
import { LectureExercises } from '@/components/content/LectureExercises'
import { Algorithm } from '@/components/content/Algorithm'
import { Pseudocode } from '@/components/content/Pseudocode'
import { RecallCard } from '@/components/content/RecallCard'
import { ThinkingPattern } from '@/components/content/ThinkingPattern'
import { ExamRadar } from '@/components/content/ExamRadar'
import { GraphCanvas } from '@/components/viz/GraphCanvas'
import { TraversalGame } from '@/components/viz/TraversalGame'
import { BinarySearchViz } from '@/components/viz/BinarySearchViz'
import { BigOPlayground } from '@/components/viz/BigOPlayground'
import { MergeSortAnimator } from '@/components/viz/MergeSortAnimator'
import { RecurrenceClassifier } from '@/components/viz/RecurrenceClassifier'
import { InversionCounter } from '@/components/viz/InversionCounter'
import { ClosestPairScan } from '@/components/viz/ClosestPairScan'
import { GraphRepresentations } from '@/components/viz/GraphRepresentations'
import { BipartiteChecker } from '@/components/viz/BipartiteChecker'
import { DijkstraAnimator } from '@/components/viz/DijkstraAnimator'
import { BinaryHeapAnimator } from '@/components/viz/BinaryHeapAnimator'
import { IntervalScheduling } from '@/components/viz/IntervalScheduling'
import { TopologicalSortViz } from '@/components/viz/TopologicalSortViz'
import { HuffmanTreeBuilder } from '@/components/viz/HuffmanTreeBuilder'
import { WeightedIntervalDP } from '@/components/viz/WeightedIntervalDP'
import { KnapsackTable } from '@/components/viz/KnapsackTable'
import { RecallDrill, ClozeDrill, ReorderDrill } from '@/components/viz/RecallDrill'
import { Tabs } from '@/components/ui/Tabs'
import { Collapsible } from '@/components/ui/Collapsible'
import { Eq, InlineMath, BlockMath } from '@/components/math'
import { Collectible } from '@/components/collectibles/Collectible'

/**
 * Globally-available MDX components.
 *
 * Algorithms-specific visualizations (graph traversals, DP tables,
 * recursion trees, ...) will be added here as they are built lecture-
 * by-lecture under `components/viz/`. For now the bag contains only the
 * content/UI/math primitives.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Content building blocks
    Callout,
    Example,
    LabBox,
    Recap,
    NextUp,
    ExamProblem,
    ExerciseProgress,
    Timeline,
    SourceDoc,
    LectureExercises,

    // Algorithm learning kit — dual view, recall practice, interactive traces
    Algorithm,
    Pseudocode,
    RecallCard,
    ThinkingPattern,
    ExamRadar,
    GraphCanvas,
    TraversalGame,
    BinarySearchViz,
    BigOPlayground,
    MergeSortAnimator,
    RecurrenceClassifier,
    InversionCounter,
    ClosestPairScan,
    GraphRepresentations,
    BipartiteChecker,
    DijkstraAnimator,
    BinaryHeapAnimator,
    IntervalScheduling,
    TopologicalSortViz,
    HuffmanTreeBuilder,
    WeightedIntervalDP,
    KnapsackTable,
    RecallDrill,
    ClozeDrill,
    ReorderDrill,

    // Math
    Eq,
    InlineMath,
    BlockMath,

    // UI
    Tabs,
    Collapsible,

    // Collectibles
    Collectible,

    // Markdown table override: wrap in a scroll container so the table can
    // fill the available width on desktop and overflow horizontally on
    // narrow screens. Styling lives in app/globals.css under
    // `.prose-table-wrap` and `.prose-content table`.
    table: (props: HTMLAttributes<HTMLTableElement>) => (
      <div className="prose-table-wrap">
        <table {...props} />
      </div>
    ),

    // Auto-inject a "Comment on this section" button next to every h2/h3
    // that has a stable id (provided by rehype-slug).
    h2: HeadingWithCommentButton(2),
    h3: HeadingWithCommentButton(3),

    ...components,
  }
}

function HeadingWithCommentButton(level: 2 | 3) {
  const Tag = `h${level}` as 'h2' | 'h3'
  return function Heading({
    id,
    children,
    ...rest
  }: HTMLAttributes<HTMLHeadingElement>) {
    if (!id) {
      return <Tag {...rest}>{children}</Tag>
    }
    const sectionTitle = extractText(children).trim() || id
    return (
      <>
        <Tag id={id} {...rest} className="scroll-mt-20">
          {children}
        </Tag>
        <SectionComments anchor={id} sectionTitle={sectionTitle} />
      </>
    )
  }
}

function extractText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractText).join('')
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode }
    return extractText(props.children)
  }
  return ''
}
