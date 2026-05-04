/**
 * Tiny radix-2 Cooley-Tukey FFT, in-place. ~50 lines, no dependencies.
 *
 * Both arrays must have the same length, and that length must be a power of 2.
 * Operates on the input arrays directly (in-place).
 */

export function fft(real: Float32Array, imag: Float32Array): void {
  const n = real.length
  if (n <= 1) return
  if ((n & (n - 1)) !== 0) {
    throw new Error(`fft size must be a power of two (got ${n})`)
  }

  // Bit-reversal permutation.
  let j = 0
  for (let i = 1; i < n; i++) {
    let bit = n >> 1
    for (; j & bit; bit >>= 1) {
      j ^= bit
    }
    j ^= bit
    if (i < j) {
      const tr = real[i]
      real[i] = real[j]
      real[j] = tr
      const ti = imag[i]
      imag[i] = imag[j]
      imag[j] = ti
    }
  }

  // Cooley-Tukey butterflies.
  for (let len = 2; len <= n; len <<= 1) {
    const half = len >> 1
    const angleStep = (-2 * Math.PI) / len
    for (let i = 0; i < n; i += len) {
      for (let k = 0; k < half; k++) {
        const angle = angleStep * k
        const wr = Math.cos(angle)
        const wi = Math.sin(angle)
        const aR = real[i + k + half]
        const aI = imag[i + k + half]
        const tr = wr * aR - wi * aI
        const ti = wr * aI + wi * aR
        real[i + k + half] = real[i + k] - tr
        imag[i + k + half] = imag[i + k] - ti
        real[i + k] += tr
        imag[i + k] += ti
      }
    }
  }
}

/** Hamming window of length N. */
export function hamming(N: number): Float32Array {
  const w = new Float32Array(N)
  const denom = N - 1
  for (let i = 0; i < N; i++) {
    w[i] = 0.54 - 0.46 * Math.cos((2 * Math.PI * i) / denom)
  }
  return w
}

/**
 * Compute the magnitude spectrum (one-sided) of a real-valued signal.
 *
 *   - Pads / truncates to nearest power of 2 ≤ samples.length.
 *   - Applies a Hamming window.
 *   - Returns magnitude bins from 0 to N/2 (sampleRate/2 at the top).
 *
 * If `dB` is true, returns 20·log10(mag), floored at -90 dB to avoid -Inf.
 */
export function magnitudeSpectrum(
  samples: Float32Array,
  options: { dB?: boolean } = {},
): Float32Array {
  const { dB = false } = options
  const n = previousPowerOf2(samples.length)
  const w = hamming(n)
  const re = new Float32Array(n)
  const im = new Float32Array(n)
  for (let i = 0; i < n; i++) re[i] = samples[i] * w[i]
  fft(re, im)
  const half = n >> 1
  const mag = new Float32Array(half)
  for (let k = 0; k < half; k++) {
    const m = Math.sqrt(re[k] * re[k] + im[k] * im[k])
    mag[k] = dB ? Math.max(20 * Math.log10(m + 1e-12), -90) : m
  }
  return mag
}

function previousPowerOf2(n: number): number {
  let p = 1
  while ((p << 1) <= n) p <<= 1
  return p
}
