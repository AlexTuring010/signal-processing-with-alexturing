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
import { RecallCard } from '@/components/content/RecallCard'
import { RecallDrill } from '@/components/content/RecallDrill'
import { ClozeDrill } from '@/components/content/ClozeDrill'
import { ReorderDrill } from '@/components/content/ReorderDrill'
import { ThinkingPattern } from '@/components/content/ThinkingPattern'
import { ExamRadar } from '@/components/content/ExamRadar'
import { Viz } from '@/components/viz/Viz'
import { CommSystemDiagram } from '@/components/viz/CommSystemDiagram'
import { TimeFrequencyTeaser } from '@/components/viz/TimeFrequencyTeaser'
import { AntennaSizeDemo } from '@/components/viz/AntennaSizeDemo'
import { EMSpectrumExplorer } from '@/components/viz/EMSpectrumExplorer'
import { PeopleTalkingDiagram } from '@/components/viz/PeopleTalkingDiagram'
import { DuplexAnimation } from '@/components/viz/DuplexAnimation'
import { RoadmapGrid } from '@/components/viz/RoadmapGrid'
import { EverydaySignals } from '@/components/viz/EverydaySignals'
import { ContinuousVsDiscreteDemo } from '@/components/viz/ContinuousVsDiscreteDemo'
import { FourQuadrantSignalDemo } from '@/components/viz/FourQuadrantSignalDemo'
import { CosineExplorer } from '@/components/viz/CosineExplorer'
import { RotatingPhasor } from '@/components/viz/RotatingPhasor'
import { ImpulseConstruction } from '@/components/viz/ImpulseConstruction'
import { PeriodicityChecker } from '@/components/viz/PeriodicityChecker'
import { EvenOddDecomposer } from '@/components/viz/EvenOddDecomposer'
import { EnergyPowerCalculator } from '@/components/viz/EnergyPowerCalculator'
import {
  UnitStepPlot,
  RectPulsePlot,
  TriPulsePlot,
  SincPlot,
} from '@/components/viz/BuildingBlockPlots'
import {
  SystemBoxDiagram,
  CascadeDiagram,
  ParallelDiagram,
} from '@/components/viz/SystemDiagrams'
import { LinearityChecker } from '@/components/viz/LinearityChecker'
import { TimeInvarianceChecker } from '@/components/viz/TimeInvarianceChecker'
import { ImpulseResponseDemo } from '@/components/viz/ImpulseResponseDemo'
import { ConvolutionFlipAndSlide } from '@/components/viz/ConvolutionFlipAndSlide'
import { EigenfunctionDemo } from '@/components/viz/EigenfunctionDemo'
import { TransformationDemo } from '@/components/viz/TransformationDemo'
import { TransformationWorkedExample } from '@/components/viz/TransformationWorkedExample'
import { PhaseTimeShiftDemo } from '@/components/viz/PhaseTimeShiftDemo'
import { ComplexPlaneViz } from '@/components/viz/ComplexPlaneViz'
import { EulerUnitCircleViz } from '@/components/viz/EulerUnitCircleViz'
import { ComplexMultiplicationViz } from '@/components/viz/ComplexMultiplicationViz'
import { VectorDecomposition3D } from '@/components/viz/VectorDecomposition3D'
import { HarmonicOrthogonalityCheck } from '@/components/viz/HarmonicOrthogonalityCheck'
import { SpectrumViewer } from '@/components/viz/SpectrumViewer'
import { RectangularPulseFourier } from '@/components/viz/RectangularPulseFourier'
import { SquareWaveBuilder } from '@/components/viz/SquareWaveBuilder'
import { PeriodToInfinity } from '@/components/viz/PeriodToInfinity'
import { RectToSincViz } from '@/components/viz/RectToSincViz'
import { ModulationTheoremViz } from '@/components/viz/ModulationTheoremViz'
import { TransformPairsGallery } from '@/components/viz/TransformPairsGallery'
import { ConvolutionInFrequency } from '@/components/viz/ConvolutionInFrequency'
import { CounterRotatingPhasors } from '@/components/viz/CounterRotatingPhasors'
import { TwoSidedVsOneSidedCosine } from '@/components/viz/TwoSidedVsOneSidedCosine'
import { AMFamilySpectra } from '@/components/viz/AMFamilySpectra'
import { AMSignalViz } from '@/components/viz/AMSignalViz'
import { AMSpectrumViz } from '@/components/viz/AMSpectrumViz'
import { AMPowerCalculator } from '@/components/viz/AMPowerCalculator'
import { DSBSCSignalViz } from '@/components/viz/DSBSCSignalViz'
import { CoherentDemodulationViz } from '@/components/viz/CoherentDemodulationViz'
import { SSBSpectrumViz } from '@/components/viz/SSBSpectrumViz'
import { SSBGenerationViz } from '@/components/viz/SSBGenerationViz'
import { VSBShapingViz } from '@/components/viz/VSBShapingViz'
import { EnvelopeDetectorViz } from '@/components/viz/EnvelopeDetectorViz'
import { AMInNoiseViz } from '@/components/viz/AMInNoiseViz'
import { FDMSpectrumViz } from '@/components/viz/FDMSpectrumViz'
import { FMSignalViz } from '@/components/viz/FMSignalViz'
import { BesselSpectrumViz } from '@/components/viz/BesselSpectrumViz'
import { BesselTable } from '@/components/viz/BesselTable'
import { CarsonRuleViz } from '@/components/viz/CarsonRuleViz'
import { FMNoiseTriangleViz } from '@/components/viz/FMNoiseTriangleViz'
import { RandomPhaseCosineViz } from '@/components/viz/RandomPhaseCosineViz'
import { RandomProcessRealizationsViz } from '@/components/viz/RandomProcessRealizationsViz'
import { AutocorrelationViz } from '@/components/viz/AutocorrelationViz'
import { ErgodicityViz } from '@/components/viz/ErgodicityViz'
import { WhiteNoiseSimulationViz } from '@/components/viz/WhiteNoiseSimulationViz'
import { NoiseFilterShapingViz } from '@/components/viz/NoiseFilterShapingViz'
import { SNRPlaygroundViz } from '@/components/viz/SNRPlaygroundViz'
import { IQDecompositionViz } from '@/components/viz/IQDecompositionViz'
import { HilbertTransformViz } from '@/components/viz/HilbertTransformViz'
import { PreEnvelopeSpectrumViz } from '@/components/viz/PreEnvelopeSpectrumViz'
import { FilterTypeViewer } from '@/components/viz/FilterTypeViewer'
import { IdealVsRealFilterViz } from '@/components/viz/IdealVsRealFilterViz'
import { Tabs } from '@/components/ui/Tabs'
import { Collapsible } from '@/components/ui/Collapsible'
import { Eq, InlineMath, BlockMath } from '@/components/math'
import { Collectible } from '@/components/collectibles/Collectible'

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

    // 5-stage learning loop kit (Συμπύκνωσε / Ανακάλεσε / Αναγνώρισε)
    RecallCard,
    RecallDrill,
    ClozeDrill,
    ReorderDrill,
    ThinkingPattern,
    ExamRadar,

    // Math
    Eq,
    InlineMath,
    BlockMath,

    // UI
    Tabs,
    Collapsible,

    // Collectibles
    Collectible,

    // Visualizations — intro
    Viz,
    CommSystemDiagram,
    TimeFrequencyTeaser,
    AntennaSizeDemo,
    EMSpectrumExplorer,
    PeopleTalkingDiagram,
    DuplexAnimation,
    RoadmapGrid,

    // Visualizations — foundations / signals
    EverydaySignals,
    ContinuousVsDiscreteDemo,
    FourQuadrantSignalDemo,
    CosineExplorer,
    RotatingPhasor,
    ImpulseConstruction,
    PeriodicityChecker,
    EvenOddDecomposer,
    EnergyPowerCalculator,
    UnitStepPlot,
    RectPulsePlot,
    TriPulsePlot,
    SincPlot,

    // Visualizations — foundations / systems
    SystemBoxDiagram,
    CascadeDiagram,
    ParallelDiagram,
    LinearityChecker,
    TimeInvarianceChecker,
    ImpulseResponseDemo,
    ConvolutionFlipAndSlide,
    EigenfunctionDemo,
    TransformationDemo,
    TransformationWorkedExample,
    PhaseTimeShiftDemo,
    ComplexPlaneViz,
    EulerUnitCircleViz,
    ComplexMultiplicationViz,

    // Visualizations — foundations / fourier-series
    VectorDecomposition3D,
    HarmonicOrthogonalityCheck,
    SpectrumViewer,
    RectangularPulseFourier,
    SquareWaveBuilder,
    PeriodToInfinity,

    // Visualizations — foundations / fourier-transform
    RectToSincViz,
    ModulationTheoremViz,
    TransformPairsGallery,
    ConvolutionInFrequency,

    // Visualizations — reference / spectrum-conventions
    CounterRotatingPhasors,
    TwoSidedVsOneSidedCosine,

    // Visualizations — foundations / filters
    FilterTypeViewer,
    IdealVsRealFilterViz,

    // Visualizations — modulation / bridge
    IQDecompositionViz,
    HilbertTransformViz,
    PreEnvelopeSpectrumViz,

    // Visualizations — am / overview
    AMFamilySpectra,

    // Visualizations — am / conventional
    AMSignalViz,
    AMSpectrumViz,
    AMPowerCalculator,

    // Visualizations — am / dsb-sc
    DSBSCSignalViz,
    CoherentDemodulationViz,

    // Visualizations — am / ssb
    SSBSpectrumViz,
    SSBGenerationViz,

    // Visualizations — am / vsb
    VSBShapingViz,

    // Visualizations — am / modulator-demodulator
    EnvelopeDetectorViz,
    AMInNoiseViz,

    // Visualizations — am / multiplexing
    FDMSpectrumViz,

    // Visualizations — fm / idea
    FMSignalViz,

    // Visualizations — fm / bessel
    BesselSpectrumViz,
    BesselTable,

    // Visualizations — fm / carson
    CarsonRuleViz,

    // Visualizations — fm / in-noise
    FMNoiseTriangleViz,

    // Visualizations — randomness
    RandomPhaseCosineViz,
    RandomProcessRealizationsViz,
    AutocorrelationViz,
    ErgodicityViz,

    // Visualizations — noise
    WhiteNoiseSimulationViz,
    NoiseFilterShapingViz,
    SNRPlaygroundViz,

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
    // that has a stable id (provided by rehype-slug). The button writes the
    // section title + anchor into the comment-target store; the bottom-of-
    // page comments form picks it up and saves the section context.
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
