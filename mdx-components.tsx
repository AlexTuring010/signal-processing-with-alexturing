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
import { GenericSearchExplorer } from '@/components/viz/GenericSearchExplorer'
import { DfsTreeBuilder } from '@/components/viz/DfsTreeBuilder'
import { BfsLayerTheorem } from '@/components/viz/BfsLayerTheorem'
import { BfsEdgeProperty } from '@/components/viz/BfsEdgeProperty'
import { ComplexityTightVsLoose } from '@/components/viz/ComplexityTightVsLoose'
import { BinarySearchViz } from '@/components/viz/BinarySearchViz'
import { InstanceDimensionLab } from '@/components/viz/InstanceDimensionLab'
import { ComplexityCasesExplorer } from '@/components/viz/ComplexityCasesExplorer'
import { LogVsLinearRace } from '@/components/viz/LogVsLinearRace'
import { ComplexityZooLab } from '@/components/viz/ComplexityZooLab'
import { BigOPlayground } from '@/components/viz/BigOPlayground'
import { DefinitionPlayground } from '@/components/viz/DefinitionPlayground'
import { HierarchyRace } from '@/components/viz/HierarchyRace'
import { FasterComputerLab } from '@/components/viz/FasterComputerLab'
import { LimitRatioPlot } from '@/components/viz/LimitRatioPlot'
import { StrictVsLooseExplorer } from '@/components/viz/StrictVsLooseExplorer'
import { OscillatorComparison } from '@/components/viz/OscillatorComparison'
import { MergeSortAnimator } from '@/components/viz/MergeSortAnimator'
import { SortRace } from '@/components/viz/SortRace'
import { TwoPointerMerge } from '@/components/viz/TwoPointerMerge'
import { SplitRatioExplorer } from '@/components/viz/SplitRatioExplorer'
import { HanoiAnimator } from '@/components/viz/HanoiAnimator'
import { DecisionTreeLowerBound } from '@/components/viz/DecisionTreeLowerBound'
import { RecurrenceClassifier } from '@/components/viz/RecurrenceClassifier'
import { InversionCounter } from '@/components/viz/InversionCounter'
import { InversionTypeExplorer } from '@/components/viz/InversionTypeExplorer'
import { DominantColourBoard } from '@/components/viz/DominantColourBoard'
import { DominantColourProof } from '@/components/viz/DominantColourProof'
import { KaratsubaStep } from '@/components/viz/KaratsubaStep'
import { RecursionTreeBranching } from '@/components/viz/RecursionTreeBranching'
import { ClosestPairScan } from '@/components/viz/ClosestPairScan'
import { OneDClosestPair } from '@/components/viz/OneDClosestPair'
import { QuadrantSplitFail } from '@/components/viz/QuadrantSplitFail'
import { MedianLineSplit } from '@/components/viz/MedianLineSplit'
import { StripJustification } from '@/components/viz/StripJustification'
import { DeltaHalfBoxes } from '@/components/viz/DeltaHalfBoxes'
import { PresortTrick } from '@/components/viz/PresortTrick'
import { PeakFinder } from '@/components/viz/PeakFinder'
import { GraphRepresentations } from '@/components/viz/GraphRepresentations'
import { HandshakeLemmaViz } from '@/components/viz/HandshakeLemmaViz'
import { CycleExplorer } from '@/components/viz/CycleExplorer'
import { PathBuilder } from '@/components/viz/PathBuilder'
import { ConnectivityExplorer } from '@/components/viz/ConnectivityExplorer'
import { TreeThreeProperties } from '@/components/viz/TreeThreeProperties'
import { RootedTreeReroot } from '@/components/viz/RootedTreeReroot'
import { MetroModelingViz } from '@/components/viz/MetroModelingViz'
import { BipartiteChecker } from '@/components/viz/BipartiteChecker'
import { StrongConnectivityViz } from '@/components/viz/StrongConnectivityViz'
import { FloodFillGrid } from '@/components/viz/FloodFillGrid'
import { ComponentSweep } from '@/components/viz/ComponentSweep'
import { OddCycleProof } from '@/components/viz/OddCycleProof'
import { OddCycleColoring } from '@/components/viz/OddCycleColoring'
import { DirectedDegreeViz } from '@/components/viz/DirectedDegreeViz'
import { DirectedReachExplorer } from '@/components/viz/DirectedReachExplorer'
import { MutualReachabilityExplorer } from '@/components/viz/MutualReachabilityExplorer'
import { WhyBFSFailsWeighted } from '@/components/viz/WhyBFSFailsWeighted'
import { DijkstraAnimator } from '@/components/viz/DijkstraAnimator'
import { DijkstraProofViz } from '@/components/viz/DijkstraProofViz'
import { CutExplorer } from '@/components/viz/CutExplorer'
import { ExchangeArgumentViz } from '@/components/viz/ExchangeArgumentViz'
import { CycleCutLemmaViz } from '@/components/viz/CycleCutLemmaViz'
import { PrimAnimator } from '@/components/viz/PrimAnimator'
import { KruskalAnimator } from '@/components/viz/KruskalAnimator'
import { ReverseDeleteAnimator } from '@/components/viz/ReverseDeleteAnimator'
import { PrimVsDijkstraViz } from '@/components/viz/PrimVsDijkstraViz'
import { CayleyCount } from '@/components/viz/CayleyCount'
import { DijkstraInvariantBreak } from '@/components/viz/DijkstraInvariantBreak'
import { BinaryHeapAnimator } from '@/components/viz/BinaryHeapAnimator'
import { HeapArrayMap } from '@/components/viz/HeapArrayMap'
import { HeapsortAnimator } from '@/components/viz/HeapsortAnimator'
import { UnionFindForest } from '@/components/viz/UnionFindForest'
import { UnionBySizeRace } from '@/components/viz/UnionBySizeRace'
import { PathCompressionViz } from '@/components/viz/PathCompressionViz'
import { GreedyHorizon } from '@/components/viz/GreedyHorizon'
import { IntervalScheduling } from '@/components/viz/IntervalScheduling'
import { GreedyStaysAhead } from '@/components/viz/GreedyStaysAhead'
import { IntervalPartitionAnimator } from '@/components/viz/IntervalPartitionAnimator'
import { LatenessScheduler } from '@/components/viz/LatenessScheduler'
import { LatenessExchangeViz } from '@/components/viz/LatenessExchangeViz'
import { TopoOrderBuilder } from '@/components/viz/TopoOrderBuilder'
import { DagSourceWalk } from '@/components/viz/DagSourceWalk'
import { TopologicalSortViz } from '@/components/viz/TopologicalSortViz'
import { HuffmanTreeBuilder } from '@/components/viz/HuffmanTreeBuilder'
import { CompressionCostLab } from '@/components/viz/CompressionCostLab'
import { PrefixDecoder } from '@/components/viz/PrefixDecoder'
import { HuffmanSwapViz } from '@/components/viz/HuffmanSwapViz'
import { HuffmanOptimalityViz } from '@/components/viz/HuffmanOptimalityViz'
import { WeightedIntervalDP } from '@/components/viz/WeightedIntervalDP'
import { RecursionExplosion } from '@/components/viz/RecursionExplosion'
import { GreedyFailsWeighted } from '@/components/viz/GreedyFailsWeighted'
import { PjExplorer } from '@/components/viz/PjExplorer'
import { PjScan } from '@/components/viz/PjScan'
import { KnapsackTable } from '@/components/viz/KnapsackTable'
import { KnapsackGreedyFail } from '@/components/viz/KnapsackGreedyFail'
import { KnapsackWhyTwoVars } from '@/components/viz/KnapsackWhyTwoVars'
import { PseudoPolyExplorer } from '@/components/viz/PseudoPolyExplorer'
import { SubsequenceExplorer } from '@/components/viz/SubsequenceExplorer'
import { LcsTable } from '@/components/viz/LcsTable'
import { EditDistanceTable } from '@/components/viz/EditDistanceTable'
import { AlignmentBuilder } from '@/components/viz/AlignmentBuilder'
import { EditGraphViz } from '@/components/viz/EditGraphViz'
import { TwoRowSweep } from '@/components/viz/TwoRowSweep'
import { HirschbergViz } from '@/components/viz/HirschbergViz'
import { TreeIndependentSet } from '@/components/viz/TreeIndependentSet'
import { WhyTwoTreeValues } from '@/components/viz/WhyTwoTreeValues'
import { DijkstraNegFail } from '@/components/viz/DijkstraNegFail'
import { ConstantShiftFail } from '@/components/viz/ConstantShiftFail'
import { NegativeCycleWalk } from '@/components/viz/NegativeCycleWalk'
import { BellmanFordAnimator } from '@/components/viz/BellmanFordAnimator'
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
    GenericSearchExplorer,
    DfsTreeBuilder,
    BfsLayerTheorem,
    BfsEdgeProperty,
    ComplexityTightVsLoose,
    BinarySearchViz,
    InstanceDimensionLab,
    ComplexityCasesExplorer,
    LogVsLinearRace,
    ComplexityZooLab,
    BigOPlayground,
    DefinitionPlayground,
    HierarchyRace,
    FasterComputerLab,
    LimitRatioPlot,
    StrictVsLooseExplorer,
    OscillatorComparison,
    MergeSortAnimator,
    SortRace,
    TwoPointerMerge,
    SplitRatioExplorer,
    HanoiAnimator,
    DecisionTreeLowerBound,
    RecurrenceClassifier,
    InversionCounter,
    InversionTypeExplorer,
    DominantColourBoard,
    DominantColourProof,
    KaratsubaStep,
    RecursionTreeBranching,
    ClosestPairScan,
    OneDClosestPair,
    QuadrantSplitFail,
    MedianLineSplit,
    StripJustification,
    DeltaHalfBoxes,
    PresortTrick,
    PeakFinder,
    GraphRepresentations,
    HandshakeLemmaViz,
    CycleExplorer,
    PathBuilder,
    ConnectivityExplorer,
    TreeThreeProperties,
    RootedTreeReroot,
    MetroModelingViz,
    BipartiteChecker,
    StrongConnectivityViz,
    FloodFillGrid,
    ComponentSweep,
    OddCycleProof,
    OddCycleColoring,
    DirectedDegreeViz,
    DirectedReachExplorer,
    MutualReachabilityExplorer,
    WhyBFSFailsWeighted,
    DijkstraAnimator,
    DijkstraProofViz,
    CutExplorer,
    ExchangeArgumentViz,
    CycleCutLemmaViz,
    PrimAnimator,
    KruskalAnimator,
    ReverseDeleteAnimator,
    PrimVsDijkstraViz,
    CayleyCount,
    DijkstraInvariantBreak,
    BinaryHeapAnimator,
    HeapArrayMap,
    HeapsortAnimator,
    UnionFindForest,
    UnionBySizeRace,
    PathCompressionViz,
    GreedyHorizon,
    IntervalScheduling,
    GreedyStaysAhead,
    IntervalPartitionAnimator,
    LatenessScheduler,
    LatenessExchangeViz,
    TopoOrderBuilder,
    DagSourceWalk,
    TopologicalSortViz,
    HuffmanTreeBuilder,
    CompressionCostLab,
    PrefixDecoder,
    HuffmanSwapViz,
    HuffmanOptimalityViz,
    WeightedIntervalDP,
    RecursionExplosion,
    GreedyFailsWeighted,
    PjExplorer,
    PjScan,
    KnapsackTable,
    KnapsackGreedyFail,
    KnapsackWhyTwoVars,
    PseudoPolyExplorer,
    SubsequenceExplorer,
    LcsTable,
    EditDistanceTable,
    AlignmentBuilder,
    EditGraphViz,
    TwoRowSweep,
    HirschbergViz,
    TreeIndependentSet,
    WhyTwoTreeValues,
    DijkstraNegFail,
    ConstantShiftFail,
    NegativeCycleWalk,
    BellmanFordAnimator,
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
