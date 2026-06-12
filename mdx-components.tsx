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
import { OptionalResource } from '@/components/content/OptionalResource'
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
import { StaircaseHoldDemo } from '@/components/viz/StaircaseHoldDemo'
import { FourQuadrantSignalDemo } from '@/components/viz/FourQuadrantSignalDemo'
import { CosineExplorer } from '@/components/viz/CosineExplorer'
import { RotatingPhasor } from '@/components/viz/RotatingPhasor'
import { ImpulseConstruction } from '@/components/viz/ImpulseConstruction'
import { PeriodicityChecker } from '@/components/viz/PeriodicityChecker'
import { EvenOddDecomposer } from '@/components/viz/EvenOddDecomposer'
import { EnergyPowerCalculator } from '@/components/viz/EnergyPowerCalculator'
import { EnergyAreaPlot } from '@/components/viz/EnergyAreaPlot'
import { IqFoundationsViz } from '@/components/viz/IqFoundationsViz'
import { SignalClassificationPlayground } from '@/components/viz/SignalClassificationPlayground'
import { DiscretePeriodicityChecker } from '@/components/viz/DiscretePeriodicityChecker'
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
  ConvolutionExerciseDiagram,
} from '@/components/viz/SystemDiagrams'
import { LinearityChecker } from '@/components/viz/LinearityChecker'
import { TimeInvarianceChecker } from '@/components/viz/TimeInvarianceChecker'
import { ImpulseResponseDemo } from '@/components/viz/ImpulseResponseDemo'
import { ConvolutionFlipAndSlide } from '@/components/viz/ConvolutionFlipAndSlide'
import { AskisiFourConvolutionViz } from '@/components/viz/AskisiFourConvolutionViz'
import { RectRectConvolutionViz } from '@/components/viz/RectRectConvolutionViz'
import { ComplexExpThroughLtiViz } from '@/components/viz/ComplexExpThroughLtiViz'
import { EigenfunctionDemo } from '@/components/viz/EigenfunctionDemo'
import { TransformationDemo } from '@/components/viz/TransformationDemo'
import { TransformationWorkedExample } from '@/components/viz/TransformationWorkedExample'
import { CombinedTransformationsViz } from '@/components/viz/CombinedTransformationsViz'
import { PhaseTimeShiftDemo } from '@/components/viz/PhaseTimeShiftDemo'
import { ComplexPlaneViz } from '@/components/viz/ComplexPlaneViz'
import { EulerUnitCircleViz } from '@/components/viz/EulerUnitCircleViz'
import { ComplexMultiplicationViz } from '@/components/viz/ComplexMultiplicationViz'
import { VectorDecomposition3D } from '@/components/viz/VectorDecomposition3D'
import { HarmonicOrthogonalityCheck } from '@/components/viz/HarmonicOrthogonalityCheck'
import { SpectrumViewer } from '@/components/viz/SpectrumViewer'
import { CosineSuperpositionViz } from '@/components/viz/CosineSuperpositionViz'
import { RectangularPulseFourier } from '@/components/viz/RectangularPulseFourier'
import { SquareWaveBuilder } from '@/components/viz/SquareWaveBuilder'
import { SpectrumDensifies } from '@/components/viz/SpectrumDensifies'
import { RiemannSumToIntegral } from '@/components/viz/RiemannSumToIntegral'
import { PulseFromTones } from '@/components/viz/PulseFromTones'
import { PeriodGrowsSpectrumCollapses } from '@/components/viz/PeriodGrowsSpectrumCollapses'
import { HistogramToDensity } from '@/components/viz/HistogramToDensity'
import { CopiesToImpulseComb } from '@/components/viz/CopiesToImpulseComb'
import { CoefficientsToDensity } from '@/components/viz/CoefficientsToDensity'
import { PeriodicSpectrumFsVsFt } from '@/components/viz/PeriodicSpectrumFsVsFt'
import { CyclesToImpulse } from '@/components/viz/CyclesToImpulse'
import { CyclesToImpulseLimit } from '@/components/viz/CyclesToImpulseLimit'
import { BurstPositionPhase } from '@/components/viz/BurstPositionPhase'
import { OneSidedVsTwoSided } from '@/components/viz/OneSidedVsTwoSided'
import { SinglePulseToCoefficients } from '@/components/viz/SinglePulseToCoefficients'
import { AnalysisSynthesisFlowViz } from '@/components/viz/AnalysisSynthesisFlowViz'
import { DualFormExplorerViz } from '@/components/viz/DualFormExplorerViz'
import { ConjugatePhasorPairViz } from '@/components/viz/ConjugatePhasorPairViz'
import { CosinePhaseWheelViz } from '@/components/viz/CosinePhaseWheelViz'
import { LtiThroughFourierSeriesViz } from '@/components/viz/LtiThroughFourierSeriesViz'
import { RectToSincViz } from '@/components/viz/RectToSincViz'
import { ScalingDualityViz } from '@/components/viz/ScalingDualityViz'
import { SincPhaseFlipViz } from '@/components/viz/SincPhaseFlipViz'
import { SpectrumDualViewViz } from '@/components/viz/SpectrumDualViewViz'
import { FtCosineSynthesisViz } from '@/components/viz/FtCosineSynthesisViz'
import { PhaseCircleViz } from '@/components/viz/PhaseCircleViz'
import { FsFtCompareViz } from '@/components/viz/FsFtCompareViz'
import { TimeFreqPairViz } from '@/components/viz/TimeFreqPairViz'
import { FtAsSampledFsEnvelope } from '@/components/viz/FtAsSampledFsEnvelope'
import { EnvelopeConceptViz } from '@/components/viz/EnvelopeConceptViz'
import { TwoPulsesToCoefficients } from '@/components/viz/TwoPulsesToCoefficients'
import { TwoPulsesSamplesOverlay } from '@/components/viz/TwoPulsesSamplesOverlay'
import { CrossCorrelationPlayground } from '@/components/viz/CrossCorrelationPlayground'
import { SonarRangingGame } from '@/components/viz/SonarRangingGame'
import { LimitedSinAutocorrelationViz } from '@/components/viz/LimitedSinAutocorrelationViz'
import { ModulationTheoremViz } from '@/components/viz/ModulationTheoremViz'
import { TransformPairsGallery } from '@/components/viz/TransformPairsGallery'
import { ConvolutionInFrequency } from '@/components/viz/ConvolutionInFrequency'
import { MultiplicationConvolutionViz } from '@/components/viz/MultiplicationConvolutionViz'
import { DifferentiationSpectrumViz } from '@/components/viz/DifferentiationSpectrumViz'
import { ConjugateSymmetrySpectrumViz } from '@/components/viz/ConjugateSymmetrySpectrumViz'
import { CounterRotatingPhasors } from '@/components/viz/CounterRotatingPhasors'
import { TwoSidedVsOneSidedCosine } from '@/components/viz/TwoSidedVsOneSidedCosine'
import { TriToSincSquaredViz } from '@/components/viz/TriToSincSquaredViz'
import { CosineFrequencyPairViz } from '@/components/viz/CosineFrequencyPairViz'
import { SineFrequencyPairViz } from '@/components/viz/SineFrequencyPairViz'
import { SgnToInversePiFViz } from '@/components/viz/SgnToInversePiFViz'
import { ConstantDeltaDualityViz } from '@/components/viz/ConstantDeltaDualityViz'
import { AMFamilySpectra } from '@/components/viz/AMFamilySpectra'
import { ModulationDecisionTree } from '@/components/viz/ModulationDecisionTree'
import { BasebandToRfShiftPlayground } from '@/components/viz/BasebandToRfShiftPlayground'
import { AMTradeoffSpace } from '@/components/viz/AMTradeoffSpace'
import { AMSignalViz } from '@/components/viz/AMSignalViz'
import { AMSpectrumViz } from '@/components/viz/AMSpectrumViz'
import { AMPowerCalculator } from '@/components/viz/AMPowerCalculator'
import { OvermodulationPhaseReversalViz } from '@/components/viz/OvermodulationPhaseReversalViz'
import { EfficiencyVsMuCurveViz } from '@/components/viz/EfficiencyVsMuCurveViz'
import { CarrierVsSidebandPowerSplitViz } from '@/components/viz/CarrierVsSidebandPowerSplitViz'
import { DSBSCSignalViz } from '@/components/viz/DSBSCSignalViz'
import { CoherentDemodulationViz } from '@/components/viz/CoherentDemodulationViz'
import { DsbVsAmEnvelopeDetectorComparison } from '@/components/viz/DsbVsAmEnvelopeDetectorComparison'
import { DsbScSpectrumViz } from '@/components/viz/DsbScSpectrumViz'
import { CoherentDemodChainViz } from '@/components/viz/CoherentDemodChainViz'
import { SSBSpectrumViz } from '@/components/viz/SSBSpectrumViz'
import { SSBGenerationViz } from '@/components/viz/SSBGenerationViz'
import { SsbHilbertCancellationViz } from '@/components/viz/SsbHilbertCancellationViz'
import { UssbVsLssbComparison } from '@/components/viz/UssbVsLssbComparison'
import { SsbPhaseErrorViz } from '@/components/viz/SsbPhaseErrorViz'
import { VSBShapingViz } from '@/components/viz/VSBShapingViz'
import { VsbNyquistSymmetryViz } from '@/components/viz/VsbNyquistSymmetryViz'
import { VsbCoherentReconstructionViz } from '@/components/viz/VsbCoherentReconstructionViz'
import { VsbForTvViz } from '@/components/viz/VsbForTvViz'
import { EnvelopeDetectorViz } from '@/components/viz/EnvelopeDetectorViz'
import { AMInNoiseViz } from '@/components/viz/AMInNoiseViz'
import { NonlinearModulatorSpectrumViz } from '@/components/viz/NonlinearModulatorSpectrumViz'
import { BalancedModulatorCancellationViz } from '@/components/viz/BalancedModulatorCancellationViz'
import { CoherentReceiverChainViz } from '@/components/viz/CoherentReceiverChainViz'
import { AMSNRCurveViz } from '@/components/viz/AMSNRCurveViz'
import { FDMSpectrumViz } from '@/components/viz/FDMSpectrumViz'
import { FdmCanonicalProblemViz } from '@/components/viz/FdmCanonicalProblemViz'
import { FdmCrossTalkViz } from '@/components/viz/FdmCrossTalkViz'
import { SuperheterodyneReceiverViz } from '@/components/viz/SuperheterodyneReceiverViz'
import { FMSignalViz } from '@/components/viz/FMSignalViz'
import { NbfmVsAmSpectrumViz } from '@/components/viz/NbfmVsAmSpectrumViz'
import { PmVsFmDualityViz } from '@/components/viz/PmVsFmDualityViz'
import { ConstantEnvelopeCircleViz } from '@/components/viz/ConstantEnvelopeCircleViz'
import { AngleModulationTimeDomainViz } from '@/components/viz/AngleModulationTimeDomainViz'
import { PmInstantaneousFrequencyViz } from '@/components/viz/PmInstantaneousFrequencyViz'
import { NbfmAmPhasorDecompositionViz } from '@/components/viz/NbfmAmPhasorDecompositionViz'
import { BesselSpectrumViz } from '@/components/viz/BesselSpectrumViz'
import { BesselTable } from '@/components/viz/BesselTable'
import { TaylorToBesselDerivationViz } from '@/components/viz/TaylorToBesselDerivationViz'
import { JacobiAngerDecompositionViz } from '@/components/viz/JacobiAngerDecompositionViz'
import { CarrierVanishViz } from '@/components/viz/CarrierVanishViz'
import { AskisiThreeFilteredFmPowerViz } from '@/components/viz/AskisiThreeFilteredFmPowerViz'
import { CarsonRuleViz } from '@/components/viz/CarsonRuleViz'
import { TaylorBandwidthCascadeViz } from '@/components/viz/TaylorBandwidthCascadeViz'
import { NbfmWbfmRegimesViz } from '@/components/viz/NbfmWbfmRegimesViz'
import { PmFmCarsonEquivalenceViz } from '@/components/viz/PmFmCarsonEquivalenceViz'
import { FMNoiseTriangleViz } from '@/components/viz/FMNoiseTriangleViz'
import { TriangularNoiseDerivationViz } from '@/components/viz/TriangularNoiseDerivationViz'
import { FmSnrGainViz } from '@/components/viz/FmSnrGainViz'
import { FmThresholdEffectViz } from '@/components/viz/FmThresholdEffectViz'
import { CaptureEffectViz } from '@/components/viz/CaptureEffectViz'
import { RandomPhaseCosineIntroViz } from '@/components/viz/RandomPhaseCosineIntroViz'
import { RandomPhaseCosinePdfViz } from '@/components/viz/RandomPhaseCosinePdfViz'
import { RandomPhaseCosineStationarityViz } from '@/components/viz/RandomPhaseCosineStationarityViz'
import { RandomProcessRealizationsViz } from '@/components/viz/RandomProcessRealizationsViz'
import { DistributionExplorerViz } from '@/components/viz/DistributionExplorerViz'
import { WssShapeDriftViz } from '@/components/viz/WssShapeDriftViz'
import { EnsembleSliceViz } from '@/components/viz/EnsembleSliceViz'
import { CorrelationScatterViz } from '@/components/viz/CorrelationScatterViz'
import { AutocorrelationViz } from '@/components/viz/AutocorrelationViz'
import { TwoTimeCorrelationViz } from '@/components/viz/TwoTimeCorrelationViz'
import { ErgodicityViz } from '@/components/viz/ErgodicityViz'
import { WhiteNoiseSimulationViz } from '@/components/viz/WhiteNoiseSimulationViz'
import { NoiseFilterShapingViz } from '@/components/viz/NoiseFilterShapingViz'
import { SNRPlaygroundViz } from '@/components/viz/SNRPlaygroundViz'
import { NoiseTemperatureChainViz } from '@/components/viz/NoiseTemperatureChainViz'
import { IQDecompositionViz } from '@/components/viz/IQDecompositionViz'
import { HilbertTransformViz } from '@/components/viz/HilbertTransformViz'
import { PreEnvelopeSpectrumViz } from '@/components/viz/PreEnvelopeSpectrumViz'
import { FilterTypeViewer } from '@/components/viz/FilterTypeViewer'
import { IdealSincResponseViz } from '@/components/viz/IdealSincResponseViz'
import { IdealVsRealFilterViz } from '@/components/viz/IdealVsRealFilterViz'
import { FilterSpectralMaskViz } from '@/components/viz/FilterSpectralMaskViz'
import { SincTruncationToRealFilterViz } from '@/components/viz/SincTruncationToRealFilterViz'
import { RealFilterStepperViz } from '@/components/viz/RealFilterStepperViz'
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
    OptionalResource,

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
    StaircaseHoldDemo,
    FourQuadrantSignalDemo,
    CosineExplorer,
    RotatingPhasor,
    ImpulseConstruction,
    PeriodicityChecker,
    EvenOddDecomposer,
    EnergyPowerCalculator,
    EnergyAreaPlot,
    IqFoundationsViz,
    SignalClassificationPlayground,
    DiscretePeriodicityChecker,
    UnitStepPlot,
    RectPulsePlot,
    TriPulsePlot,
    SincPlot,

    // Visualizations — foundations / systems
    SystemBoxDiagram,
    CascadeDiagram,
    ParallelDiagram,
    ConvolutionExerciseDiagram,
    LinearityChecker,
    TimeInvarianceChecker,
    ImpulseResponseDemo,
    ConvolutionFlipAndSlide,
    AskisiFourConvolutionViz,
    RectRectConvolutionViz,
    ComplexExpThroughLtiViz,
    EigenfunctionDemo,
    TransformationDemo,
    TransformationWorkedExample,
    CombinedTransformationsViz,
    PhaseTimeShiftDemo,
    ComplexPlaneViz,
    EulerUnitCircleViz,
    ComplexMultiplicationViz,

    // Visualizations — foundations / fourier-series
    VectorDecomposition3D,
    HarmonicOrthogonalityCheck,
    SpectrumViewer,
    CosineSuperpositionViz,
    RectangularPulseFourier,
    SquareWaveBuilder,
    SpectrumDensifies,
    RiemannSumToIntegral,
    PulseFromTones,
    PeriodGrowsSpectrumCollapses,
    HistogramToDensity,
    CopiesToImpulseComb,
    CoefficientsToDensity,
    PeriodicSpectrumFsVsFt,
    CyclesToImpulse,
    CyclesToImpulseLimit,
    BurstPositionPhase,
    OneSidedVsTwoSided,
    SinglePulseToCoefficients,
    AnalysisSynthesisFlowViz,
    DualFormExplorerViz,
    ConjugatePhasorPairViz,
    CosinePhaseWheelViz,
    LtiThroughFourierSeriesViz,

    // Visualizations — foundations / fourier-transform
    RectToSincViz,
    ScalingDualityViz,
    SincPhaseFlipViz,
    SpectrumDualViewViz,
    FtCosineSynthesisViz,
    PhaseCircleViz,
    FsFtCompareViz,
    TimeFreqPairViz,
    FtAsSampledFsEnvelope,
    EnvelopeConceptViz,
    TwoPulsesToCoefficients,
    TwoPulsesSamplesOverlay,
    CrossCorrelationPlayground,
    SonarRangingGame,
    LimitedSinAutocorrelationViz,
    ModulationTheoremViz,
    TransformPairsGallery,
    ConvolutionInFrequency,
    MultiplicationConvolutionViz,
    DifferentiationSpectrumViz,
    ConjugateSymmetrySpectrumViz,

    // Visualizations — reference / fourier-pairs
    TriToSincSquaredViz,
    CosineFrequencyPairViz,
    SineFrequencyPairViz,
    SgnToInversePiFViz,
    ConstantDeltaDualityViz,

    // Visualizations — reference / spectrum-conventions
    CounterRotatingPhasors,
    TwoSidedVsOneSidedCosine,

    // Visualizations — foundations / filters
    FilterTypeViewer,
    IdealSincResponseViz,
    IdealVsRealFilterViz,
    FilterSpectralMaskViz,
    SincTruncationToRealFilterViz,
    RealFilterStepperViz,

    // Visualizations — modulation / bridge
    IQDecompositionViz,
    HilbertTransformViz,
    PreEnvelopeSpectrumViz,

    // Visualizations — am / overview
    AMFamilySpectra,
    ModulationDecisionTree,
    BasebandToRfShiftPlayground,
    AMTradeoffSpace,

    // Visualizations — am / conventional
    AMSignalViz,
    AMSpectrumViz,
    AMPowerCalculator,
    OvermodulationPhaseReversalViz,
    EfficiencyVsMuCurveViz,
    CarrierVsSidebandPowerSplitViz,

    // Visualizations — am / dsb-sc
    DSBSCSignalViz,
    CoherentDemodulationViz,
    DsbVsAmEnvelopeDetectorComparison,
    DsbScSpectrumViz,
    CoherentDemodChainViz,

    // Visualizations — am / ssb
    SSBSpectrumViz,
    SSBGenerationViz,
    SsbHilbertCancellationViz,
    UssbVsLssbComparison,
    SsbPhaseErrorViz,

    // Visualizations — am / vsb
    VSBShapingViz,
    VsbNyquistSymmetryViz,
    VsbCoherentReconstructionViz,
    VsbForTvViz,

    // Visualizations — am / modulator-demodulator
    EnvelopeDetectorViz,
    AMInNoiseViz,
    NonlinearModulatorSpectrumViz,
    BalancedModulatorCancellationViz,
    CoherentReceiverChainViz,
    AMSNRCurveViz,

    // Visualizations — am / multiplexing
    FDMSpectrumViz,
    FdmCanonicalProblemViz,
    FdmCrossTalkViz,
    SuperheterodyneReceiverViz,

    // Visualizations — fm / idea
    FMSignalViz,
    NbfmVsAmSpectrumViz,
    PmVsFmDualityViz,
    ConstantEnvelopeCircleViz,

    // Visualizations — fm / pm
    AngleModulationTimeDomainViz,
    PmInstantaneousFrequencyViz,
    NbfmAmPhasorDecompositionViz,

    // Visualizations — fm / bessel
    BesselSpectrumViz,
    BesselTable,
    TaylorToBesselDerivationViz,
    JacobiAngerDecompositionViz,
    CarrierVanishViz,
    AskisiThreeFilteredFmPowerViz,

    // Visualizations — fm / carson
    CarsonRuleViz,
    TaylorBandwidthCascadeViz,
    NbfmWbfmRegimesViz,
    PmFmCarsonEquivalenceViz,

    // Visualizations — fm / in-noise
    FMNoiseTriangleViz,
    TriangularNoiseDerivationViz,
    FmSnrGainViz,
    FmThresholdEffectViz,
    CaptureEffectViz,

    // Visualizations — randomness
    RandomPhaseCosineIntroViz,
    RandomPhaseCosinePdfViz,
    RandomPhaseCosineStationarityViz,
    RandomProcessRealizationsViz,
    AutocorrelationViz,
    TwoTimeCorrelationViz,
    ErgodicityViz,
    DistributionExplorerViz,
    WssShapeDriftViz,
    EnsembleSliceViz,
    CorrelationScatterViz,

    // Visualizations — noise
    WhiteNoiseSimulationViz,
    NoiseFilterShapingViz,
    SNRPlaygroundViz,
    NoiseTemperatureChainViz,

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
