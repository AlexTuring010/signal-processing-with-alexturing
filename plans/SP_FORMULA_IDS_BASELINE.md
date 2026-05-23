# `formulaIds` integrity baseline

Snapshot of every `formulaIds: [...]` reference across
`content/practice/exercises.tsx` as of Phase 0 sub-task 2
(commit landing this file). Used by sub-task 3+ to detect dangling
references after `FORMULA_SHEET` is restructured.

The rule is: **every ID listed here must continue to resolve via
`FORMULA_BY_ID`** until a deliberate rename lands together with all
its references in the same commit.

## Snapshot metadata

- Total `formulaIds:` declarations: 63
- Unique IDs referenced: 39
- `FORMULA_SHEET` total entries on this date: 45
- Entries currently in `FORMULA_SHEET` but NOT referenced by any
  exercise: 6 (`fourier-scaling`, `parseval`, `fm-bessel-expansion`,
  `wiener-khinchin`, `snr`, `noise-figure`). Sub-task 3 should
  preserve these IDs.

## Referenced IDs (alphabetical, by topic)

### Foundations (8)

- `fourier-convolution`
- `fourier-modulation-theorem`
- `fourier-pair-cos`
- `fourier-pair-sin`
- `fourier-pair-rect`
- `fourier-pair-tri`
- `fourier-shift`
- `parseval-power`

### AM (11)

- `am-bandwidth`
- `am-eta`
- `am-mu`
- `am-power`
- `am-signal`
- `am-spectrum`
- `dsb-sc-power`
- `dsb-sc-signal`
- `envelope-detector-rc`
- `hilbert`
- `ssb-signal`

### FM (11)

- `carson`
- `fm-bessel-property`
- `fm-bessel-sidebands`
- `fm-beta`
- `fm-gain-am`
- `fm-instantaneous-freq`
- `fm-power`
- `fm-signal`
- `fm-single-tone`
- `fm-snr-out`
- `pm-signal`

### Random (5)

- `random-autocorr`
- `random-cross`
- `random-mean`
- `random-phase-cosine`
- `wss`

### Noise (4)

- `bandpass-noise-r`
- `lti-output-psd`
- `thermal-noise`
- `white-noise-psd`

## Sub-task 3 contract

When `FORMULA_SHEET` is restructured to add the missing typology
entries (Fourier properties: differentiation, integration,
freq-shift, sgn↔1/(jπf); individual trig identities; basic
integrals; Bessel-table reference):

1. Preserve every ID above verbatim — do **not** rename.
2. Add new IDs freely.
3. After the change, add `lib/validate-formula-ids.ts` (wired as a
   `prebuild` step) that scans `exercises.tsx` for `formulaIds:` and
   fails if any reference does not resolve via `FORMULA_BY_ID`.
4. Manual check: open `/practice` and `/practice/sose-to-eksamino`,
   click "Assist" on a sample exercise, confirm the expected entries
   are highlighted with no missing-ID console errors.
