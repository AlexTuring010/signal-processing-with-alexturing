/**
 * Tiny PRNG + samplers for random-signal visualizations.
 *
 * We use a deterministic seedable LCG so that visualizations re-render
 * identically across React re-renders (avoiding flicker). Math.random()
 * works too but is non-reproducible, which is annoying when several
 * panels are showing the "same" realization.
 */

/**
 * Mulberry32 — a fast, well-distributed 32-bit PRNG. Good enough for
 * visualization purposes. Seed must be a non-zero integer.
 */
export function mulberry32(seed: number) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Standard normal sample via Box-Muller. `rng` returns uniform [0,1).
 */
export function normal(rng: () => number, mean = 0, std = 1): number {
  let u1 = 0
  while (u1 === 0) u1 = rng()
  const u2 = rng()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mean + std * z
}

/**
 * Uniform sample on [a, b).
 */
export function uniform(rng: () => number, a: number, b: number): number {
  return a + (b - a) * rng()
}

/**
 * Pre-generate an array of N Gaussian samples using the given seed.
 */
export function gaussianArray(seed: number, N: number, std = 1): number[] {
  const rng = mulberry32(seed)
  const out = new Array<number>(N)
  for (let i = 0; i < N; i++) out[i] = normal(rng, 0, std)
  return out
}

/**
 * Compute the sample mean and variance of an array.
 */
export function sampleStats(xs: number[]): { mean: number; variance: number } {
  const n = xs.length
  if (n === 0) return { mean: 0, variance: 0 }
  let sum = 0
  for (let i = 0; i < n; i++) sum += xs[i]
  const mean = sum / n
  let sumSq = 0
  for (let i = 0; i < n; i++) {
    const d = xs[i] - mean
    sumSq += d * d
  }
  return { mean, variance: sumSq / n }
}

/**
 * Biased autocorrelation R[k] = (1/N) Σ x[i] x[i+k] for k = 0..maxLag.
 * "Biased" because we divide by N (not N-k), giving a tapered estimate
 * that goes to zero at large lag — matches MATLAB's default.
 */
export function autocorrBiased(xs: number[], maxLag: number): number[] {
  const n = xs.length
  const out = new Array<number>(maxLag + 1)
  for (let k = 0; k <= maxLag; k++) {
    let s = 0
    for (let i = 0; i < n - k; i++) s += xs[i] * xs[i + k]
    out[k] = s / n
  }
  return out
}

/**
 * Compute |X(f)|² periodogram of length-N samples xs at K equally spaced
 * frequencies f ∈ [0, fs/2]. We use direct DFT — slow but readable, fine
 * for visualization at N ~ 256.
 */
export function periodogram(xs: number[], K: number, fs = 1): { f: number[]; psd: number[] } {
  const N = xs.length
  const f = new Array<number>(K)
  const psd = new Array<number>(K)
  for (let k = 0; k < K; k++) {
    const fk = (k / K) * (fs / 2)
    let re = 0
    let im = 0
    for (let n = 0; n < N; n++) {
      const phi = -2 * Math.PI * fk * (n / fs)
      re += xs[n] * Math.cos(phi)
      im += xs[n] * Math.sin(phi)
    }
    f[k] = fk
    psd[k] = (re * re + im * im) / N
  }
  return { f, psd }
}
