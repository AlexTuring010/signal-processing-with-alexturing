/**
 * Numerical Bessel function of the first kind, J_n(x).
 *
 * Used for the FM Bessel spectrum: x_FM(t) = A_c Σ_n J_n(β) cos(2π(f_c+nf_m)t).
 *
 * Implementation: Taylor series
 *   J_n(x) = Σ_{m=0..∞} (-1)^m / (m! (m+n)!) · (x/2)^{2m+n}
 *
 * Accurate for |x| ≤ ~20 and |n| ≤ ~30, which covers β ranges relevant to
 * undergraduate communication systems exams (β up to ~10 is typical).
 *
 * For n < 0 we use the identity J_{-n}(x) = (-1)^n J_n(x).
 */

const MAX_TERMS = 80
const TINY = 1e-15

function factorial(n: number): number {
  if (n < 0) return Number.NaN
  let f = 1
  for (let i = 2; i <= n; i++) f *= i
  return f
}

export function besselJ(n: number, x: number): number {
  if (!Number.isInteger(n)) throw new Error('besselJ: n must be integer')
  if (n < 0) {
    const v = besselJ(-n, x)
    return (-n) % 2 === 0 ? v : -v
  }
  if (x === 0) return n === 0 ? 1 : 0

  // Series with ratio update to avoid overflow in factorials and powers
  // term_0 = (x/2)^n / n!
  // term_{m+1}/term_m = -(x/2)^2 / ((m+1)(m+1+n))
  const half = x / 2
  let term = Math.pow(half, n) / factorial(n)
  let sum = term
  const half2 = half * half
  for (let m = 0; m < MAX_TERMS; m++) {
    term *= -half2 / ((m + 1) * (m + 1 + n))
    sum += term
    if (Math.abs(term) < TINY * Math.abs(sum)) break
  }
  return sum
}

/**
 * Returns [J_0(β), J_1(β), J_2(β), ..., J_N(β)].
 * Convenient for building tables/spectra.
 */
export function besselJSeries(beta: number, N: number): number[] {
  const out: number[] = []
  for (let n = 0; n <= N; n++) out.push(besselJ(n, beta))
  return out
}

/**
 * For sanity: the squared sum Σ J_n(β)^2 over all integer n should equal 1.
 * Useful for tests and showing the FM power identity in the UI.
 */
export function besselPowerSum(beta: number, NMax: number): number {
  let sum = besselJ(0, beta) ** 2
  for (let n = 1; n <= NMax; n++) {
    sum += 2 * besselJ(n, beta) ** 2
  }
  return sum
}

/**
 * Smallest N such that |J_n(β)| < tol for all n ≥ N. Used for "where to
 * stop" when drawing the Bessel sideband forest. Carson's rule predicts
 * roughly N ≈ β + 1 sidebands carry significant power.
 */
export function bandwidthN(beta: number, tol = 0.01, NMax = 40): number {
  for (let n = 1; n <= NMax; n++) {
    let allBelow = true
    for (let k = n; k <= n + 2 && k <= NMax; k++) {
      if (Math.abs(besselJ(k, beta)) >= tol) {
        allBelow = false
        break
      }
    }
    if (allBelow) return n
  }
  return NMax
}
