'use client'

/**
 * Per-id mapping from formula entry → mini-viz to mount inside the
 * /formulas accordion expansion. Only entries where the existing
 * lecture viz directly illustrates the formula are mapped — the rest
 * have no mini-viz section in their expansion (the intuition +
 * derivation sketch + cited-by chips are still there).
 *
 * The viz is only mounted when the user expands the card (the registry
 * function is called lazily by `<FormulaEntryCard>`).
 */

import type { ReactNode } from 'react'

import { RectToSincViz } from '@/components/viz/RectToSincViz'
import { ModulationTheoremViz } from '@/components/viz/ModulationTheoremViz'
import { ConvolutionInFrequency } from '@/components/viz/ConvolutionInFrequency'
import { PhaseTimeShiftDemo } from '@/components/viz/PhaseTimeShiftDemo'
import { HilbertTransformViz } from '@/components/viz/HilbertTransformViz'
import { TriToSincSquaredViz } from '@/components/viz/TriToSincSquaredViz'
import { CosineFrequencyPairViz } from '@/components/viz/CosineFrequencyPairViz'
import { SineFrequencyPairViz } from '@/components/viz/SineFrequencyPairViz'
import { SgnToInversePiFViz } from '@/components/viz/SgnToInversePiFViz'
import { ConstantDeltaDualityViz } from '@/components/viz/ConstantDeltaDualityViz'
import { AMSignalViz } from '@/components/viz/AMSignalViz'
import { AMSpectrumViz } from '@/components/viz/AMSpectrumViz'
import { AMPowerCalculator } from '@/components/viz/AMPowerCalculator'
import { AMFamilySpectra } from '@/components/viz/AMFamilySpectra'
import { DSBSCSignalViz } from '@/components/viz/DSBSCSignalViz'
import { SSBSpectrumViz } from '@/components/viz/SSBSpectrumViz'
import { VSBShapingViz } from '@/components/viz/VSBShapingViz'
import { VsbNyquistSymmetryViz } from '@/components/viz/VsbNyquistSymmetryViz'
import { EnvelopeDetectorViz } from '@/components/viz/EnvelopeDetectorViz'
import { AMSNRCurveViz } from '@/components/viz/AMSNRCurveViz'
import { NonlinearModulatorSpectrumViz } from '@/components/viz/NonlinearModulatorSpectrumViz'
import { FDMSpectrumViz } from '@/components/viz/FDMSpectrumViz'
import { FMSignalViz } from '@/components/viz/FMSignalViz'
import { BesselSpectrumViz } from '@/components/viz/BesselSpectrumViz'
import { BesselTable } from '@/components/viz/BesselTable'
import { CarsonRuleViz } from '@/components/viz/CarsonRuleViz'
import { FMNoiseTriangleViz } from '@/components/viz/FMNoiseTriangleViz'
import { RandomPhaseCosineViz } from '@/components/viz/RandomPhaseCosineViz'
import { AutocorrelationViz } from '@/components/viz/AutocorrelationViz'
import { WhiteNoiseSimulationViz } from '@/components/viz/WhiteNoiseSimulationViz'
import { NoiseFilterShapingViz } from '@/components/viz/NoiseFilterShapingViz'
import { SNRPlaygroundViz } from '@/components/viz/SNRPlaygroundViz'

const REGISTRY: Record<string, () => ReactNode> = {
  // Foundations · Fourier pairs / properties
  'fourier-pair-rect': () => <RectToSincViz />,
  'fourier-pair-tri': () => <TriToSincSquaredViz />,
  'fourier-pair-cos': () => <CosineFrequencyPairViz />,
  'fourier-pair-sin': () => <SineFrequencyPairViz />,
  'fourier-pair-sgn': () => <SgnToInversePiFViz />,
  'fourier-pair-const-delta': () => <ConstantDeltaDualityViz />,
  'fourier-shift': () => <PhaseTimeShiftDemo />,
  'fourier-convolution': () => <ConvolutionInFrequency />,
  'fourier-modulation-theorem': () => <ModulationTheoremViz />,
  'fourier-freq-shift': () => <ModulationTheoremViz />,

  // AM
  'am-signal': () => <AMSignalViz />,
  'am-mu': () => <AMSignalViz />,
  'am-spectrum': () => <AMSpectrumViz />,
  'am-power': () => <AMPowerCalculator />,
  'am-eta': () => <AMPowerCalculator />,
  'dsb-sc-signal': () => <DSBSCSignalViz />,
  'ssb-signal': () => <SSBSpectrumViz />,
  'ssb-power': () => <SSBSpectrumViz />,
  hilbert: () => <HilbertTransformViz />,
  'am-bandwidth': () => <AMFamilySpectra />,
  'vsb-signal': () => <VSBShapingViz />,
  'vsb-nyquist-symmetry': () => <VsbNyquistSymmetryViz />,
  'vsb-bandwidth': () => <VSBShapingViz />,
  'envelope-detector-rc': () => <EnvelopeDetectorViz />,
  'am-output-snr': () => <AMSNRCurveViz />,
  'nonlinear-modulator-fc': () => <NonlinearModulatorSpectrumViz />,
  'fdm-spacing': () => <FDMSpectrumViz />,

  // FM / PM
  'fm-signal': () => <FMSignalViz />,
  'fm-single-tone': () => <FMSignalViz />,
  'pm-signal': () => <FMSignalViz />,
  'fm-instantaneous-freq': () => <FMSignalViz />,
  'fm-beta': () => <FMSignalViz />,
  'fm-bessel-expansion': () => <BesselSpectrumViz />,
  'fm-bessel-sidebands': () => <BesselSpectrumViz />,
  'fm-bessel-property': () => <BesselTable />,
  carson: () => <CarsonRuleViz />,
  'fm-snr-out': () => <FMNoiseTriangleViz />,
  'fm-gain-am': () => <FMNoiseTriangleViz />,
  'bessel-table': () => <BesselTable />,
  'fm-significant-harmonics': () => <BesselSpectrumViz />,

  // Random
  'random-phase-cosine': () => <RandomPhaseCosineViz />,
  'random-autocorr': () => <AutocorrelationViz />,
  'wiener-khinchin': () => <AutocorrelationViz />,

  // Noise
  'white-noise-psd': () => <WhiteNoiseSimulationViz />,
  'lti-output-psd': () => <NoiseFilterShapingViz />,
  'bandpass-noise-r': () => <NoiseFilterShapingViz />,
  snr: () => <SNRPlaygroundViz />,
}

export function hasFormulaViz(id: string): boolean {
  return id in REGISTRY
}

export function renderFormulaViz(id: string): ReactNode | null {
  const factory = REGISTRY[id]
  return factory ? factory() : null
}
