import type { MDXComponents } from 'mdx/types'
import type { HTMLAttributes } from 'react'
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
import { IQDecompositionViz } from '@/components/viz/IQDecompositionViz'
import { HilbertTransformViz } from '@/components/viz/HilbertTransformViz'
import { PreEnvelopeSpectrumViz } from '@/components/viz/PreEnvelopeSpectrumViz'
import { FilterTypeViewer } from '@/components/viz/FilterTypeViewer'
import { IdealVsRealFilterViz } from '@/components/viz/IdealVsRealFilterViz'
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

    // Markdown table override: wrap in a scroll container so the table can
    // fill the available width on desktop and overflow horizontally on
    // narrow screens. Styling lives in app/globals.css under
    // `.prose-table-wrap` and `.prose-content table`.
    table: (props: HTMLAttributes<HTMLTableElement>) => (
      <div className="prose-table-wrap">
        <table {...props} />
      </div>
    ),

    ...components,
  }
}
