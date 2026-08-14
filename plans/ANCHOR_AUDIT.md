# Anchor audit — broken in-page deep links

**Generated:** 2026-08-14 · **Not part of plan 08** — found incidentally while fixing
the SSB-envelope error in `am/modulator-demodulator`.

## What this is

`rehype-slug` (github-slugger) builds heading ids by lowercasing, stripping punctuation
and replacing each remaining space with a hyphen. An em dash surrounded by spaces
(`Α — Β`) therefore collapses to a **double** hyphen (`α--β`), not a single one.
Many hand-written `](/route#anchor)` links assume a single hyphen, and several more
point at headings that have since been renamed.

Nothing here breaks the build — a bad fragment just lands the reader at the top of the
page instead of the section, silently.

## Status

- **253** deep links checked across **44** MDX routes
- **7 fixed** (the mechanical em-dash ones) — commit alongside plan 08 step 1
- **51 still broken**, listed below. These need a judgment call each: the target
  heading was renamed or removed, so the right destination is an editorial decision.

`[drift]` = a similar heading exists (suggestion is a guess).
`[gone]` = no heading with a close name; the section was renamed or deleted.

Re-run with `scratchpad/anchor-audit.mjs` (needs `github-slugger` from node_modules).

---


[gone] app\(content)\am\dsb-sc\page.mdx:126
    broken:  /modulation/bridge#5b-πέντε-διαμορφώσεις-μία-canonical-μορφή
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\am\dsb-sc\page.mdx:707
    broken:  /foundations/fourier-transform#3-η-βασική-fourier-pair-rect-sinc
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\am\modulator-demodulator\page.mdx:236
    broken:  /am/conventional#3-overmodulation-η-έννοια-της-καθαρής-ανάκτησης
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\am\modulator-demodulator\page.mdx:307
    broken:  /am/dsb-sc#4a-coherent-demodulation-η-σωστή-διαδικασία
    suggest: (no close heading — link target no longer exists)
[drift] app\(content)\am\modulator-demodulator\page.mdx:343
    broken:  /am/conventional#5-ισχύς-και-efficiency
    suggest: /am/conventional#5-ισχύς-αποδοτικότητα-και-η-ταυτότητα-της-am
[drift] app\(content)\am\modulator-demodulator\page.mdx:402
    broken:  /am/conventional#5-ισχύς-και-efficiency
    suggest: /am/conventional#5-ισχύς-αποδοτικότητα-και-η-ταυτότητα-της-am
[drift] app\(content)\am\modulator-demodulator\page.mdx:406
    broken:  /am/conventional#5-ισχύς-και-efficiency
    suggest: /am/conventional#5-ισχύς-αποδοτικότητα-και-η-ταυτότητα-της-am
[gone] app\(content)\am\modulator-demodulator\page.mdx:732
    broken:  /am/ssb#4-coherent-demodulation-και-phase-error
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\am\multiplexing\page.mdx:289
    broken:  /am/dsb-sc#5b-canonical-frequency-conversion---περιγραφή-του-πομπού
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\am\multiplexing\page.mdx:610
    broken:  /modulation/bridge#5b-πέντε-διαμορφώσεις-μία-canonical-μορφή
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\am\overview\page.mdx:65
    broken:  /intro#section-7
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\am\overview\page.mdx:221
    broken:  /modulation/bridge#5b-πέντε-διαμορφώσεις-μία-canonical-μορφή
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\am\overview\page.mdx:358
    broken:  /intro#section-7
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\am\ssb\page.mdx:69
    broken:  /foundations/fourier-transform#8-συμμετρίες-real-time-conjugate-symmetric-frequency
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\am\ssb\page.mdx:97
    broken:  /modulation/bridge#5b-πέντε-διαμορφώσεις-μία-canonical-μορφή
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\am\ssb\page.mdx:118
    broken:  /modulation/bridge#2-hilbert-transform-phase-shifter-όλων-των-συχνοτήτων
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\am\ssb\page.mdx:228
    broken:  /modulation/bridge#2-hilbert-transform-phase-shifter-όλων-των-συχνοτήτων
    suggest: (no close heading — link target no longer exists)
[drift] app\(content)\am\ssb\page.mdx:379
    broken:  /am/dsb-sc#4-coherent-demodulation
    suggest: /am/dsb-sc#4-coherent-demodulation--γιατί-δουλεύει
[gone] app\(content)\am\ssb\page.mdx:842
    broken:  /modulation/bridge#5b-πέντε-διαμορφώσεις-μία-canonical-μορφή
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\am\ssb\page.mdx:859
    broken:  /foundations/fourier-transform#3-η-βασική-fourier-pair-rect-sinc
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\foundations\fourier-series\page.mdx:447
    broken:  /reference/complex-numbers#section-5
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\foundations\fourier-series\page.mdx:980
    broken:  /reference/complex-numbers#section-5
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\foundations\fourier-transform\page.mdx:866
    broken:  /foundations/systems#η-συνέλιξη-η-καρδιά-των-lti
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\foundations\fourier-transform\page.mdx:932
    broken:  /foundations/systems#η-συνέλιξη-η-καρδιά-των-lti
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\foundations\fourier-transform\page.mdx:1033
    broken:  /foundations/signal-transformations#time-shift--xt--t
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\foundations\fourier-transform\page.mdx:1094
    broken:  /foundations/signal-transformations#time-scaling--xat
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\foundations\fourier-transform\page.mdx:1282
    broken:  /reference/complex-numbers#section-5
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\foundations\fourier-transform\page.mdx:1383
    broken:  /reference/spectrum-conventions#1-τι-επιστρέφει-το-xf-μιγαδική-συνάρτηση
    suggest: (no close heading — link target no longer exists)
[drift] app\(content)\foundations\signal-transformations\page.mdx:98
    broken:  /foundations/signals#even-odd
    suggest: /foundations/signals#even-odd-eu
[gone] app\(content)\foundations\signal-transformations\page.mdx:137
    broken:  /foundations/systems#sumelixi
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\foundations\signal-transformations\page.mdx:194
    broken:  /foundations/systems#sumelixi
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\foundations\signal-transformations\page.mdx:295
    broken:  /foundations/systems#sumelixi
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\foundations\signal-transformations\page.mdx:414
    broken:  /foundations/systems#sumelixi
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\foundations\signals\page.mdx:443
    broken:  /foundations/systems#sumelixi
    suggest: (no close heading — link target no longer exists)
[drift] app\(content)\labs\02-signals\page.mdx:404
    broken:  /labs/01-intro#flow-control
    suggest: /labs/01-intro#flow-control--for-if-while
[gone] app\(content)\reference\integrals\page.mdx:99
    broken:  /foundations/systems#7
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\reference\integrals\page.mdx:119
    broken:  /modulation/bridge#2-hilbert-transform
    suggest: (no close heading — link target no longer exists)
[drift] app\(content)\reference\integrals\page.mdx:379
    broken:  /am/conventional#5-ισχύς-και-απόδοση
    suggest: /am/conventional#5-ισχύς-αποδοτικότητα-και-η-ταυτότητα-της-am
[gone] app\(content)\reference\spectrum-conventions\page.mdx:124
    broken:  /reference/complex-numbers#section-4
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\reference\trig-identities\page.mdx:117
    broken:  /am/dsb-sc#3-coherent-demodulation
    suggest: (no close heading — link target no longer exists)
[drift] app\(content)\reference\trig-identities\page.mdx:185
    broken:  /foundations/fourier-transform#7-modulation-theorem
    suggest: /foundations/fourier-transform#7-modulation-theorem-
[gone] app\(content)\reference\trig-identities\page.mdx:288
    broken:  /am/conventional#3-φάσμα
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\reference\trig-identities\page.mdx:310
    broken:  /fm/pm#7-nbfm-vs-am
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\reference\trig-identities\page.mdx:328
    broken:  /modulation/bridge#5b
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\reference\trig-identities\page.mdx:336
    broken:  /am/ssb#2b-phase-shift-hilbert-method
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\reference\trig-identities\page.mdx:422
    broken:  /am/dsb-sc#3-coherent-demodulation
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\reference\trig-identities\page.mdx:464
    broken:  /fm/pm#5-pm-σε-iq-canonical-form
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\reference\trig-identities\page.mdx:684
    broken:  /modulation/bridge#2-hilbert-transform
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\reference\trig-identities\page.mdx:751
    broken:  /am/conventional#3-φάσμα
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\reference\trig-identities\page.mdx:751
    broken:  /am/ssb#2b-phase-shift-hilbert-method
    suggest: (no close heading — link target no longer exists)
[gone] app\(content)\reference\trig-identities\page.mdx:752
    broken:  /fm/pm#7-nbfm-vs-am
    suggest: (no close heading — link target no longer exists)
