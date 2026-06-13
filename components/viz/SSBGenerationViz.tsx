/**
 * Static SVG comparison of the two SSB generation methods:
 *
 *   1. Filter method:
 *        m(t)  →  ×  →  bandpass filter → x_SSB(t)
 *                ↑
 *           cos(2π f_c t)
 *      The BPF passes only one sideband (USB or LSB).
 *
 *   2. Phase-shift (Hilbert) method:
 *        m(t)  →  ×  cos(2π f_c t)  ↘
 *                                    +/− → x_SSB(t)
 *        m̂(t) →  ×  sin(2π f_c t)  ↗
 *      The Hilbert transform of m(t) creates the imaginary part of the
 *      pre-envelope, and the algebra cancels one sideband while doubling
 *      the other. "+" gives LSB; "−" gives USB.
 *
 * Two block-diagram panels stacked. Pure SVG, no canvas.
 */

export function SSBGenerationViz() {
  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <h4 className="mb-1 text-sm font-semibold tracking-tight">
        Πώς γεννιέται το SSB — δύο μέθοδοι
      </h4>
      <p className="mb-3 text-xs text-fg-muted">
        Δύο κλασικές μέθοδοι παραγωγής SSB. Η <strong>filter method</strong> είναι
        εννοιολογικά απλή (DSB-SC + στενό BPF) αλλά απαιτεί απότομο φίλτρο. Η{' '}
        <strong>phase-shift method</strong> χρησιμοποιεί τον{' '}
        <a href="/modulation/bridge#5a-ο-μετασχηματισμός-hilbert--phase-shifter-όλων-των-συχνοτήτων" className="text-accent underline-offset-2 hover:underline">
          Hilbert transform
        </a>{' '}
        και αποφεύγει το αυστηρό φίλτρο.
      </p>

      <div className="grid gap-3 lg:grid-cols-2">
        <FilterMethodPanel />
        <PhaseShiftMethodPanel />
      </div>

      <div className="mt-3 rounded-md border border-accent/40 bg-accent-soft/30 px-3 py-2 text-xs">
        Η phase-shift method γίνεται «καθαρή» όταν δεις τη μαθηματική απόδειξη:
        <span className="font-mono"> m(t) cos(ω_c t) ∓ m̂(t) sin(ω_c t)</span>.
        Από [bridge §5e](/modulation/bridge#5e-βήμα-1--pre-envelope-x_pt-σβήνει-το-αρνητικό-μισό),
        το φάσμα του pre-envelope <span className="font-mono">x_p = m + jm̂</span>{' '}
        έχει μονόπλευρο φάσμα — άρα όταν το πολλαπλασιάσουμε με{' '}
        <span className="font-mono">e^(j ω_c t)</span> και πάρουμε το real part,
        παίρνουμε ένα bandpass σήμα με μόνο USB. Το αρνητικό πρόσημο δίνει LSB.
      </div>
    </figure>
  )
}

function FilterMethodPanel() {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">1. Filter method</span>
      </div>
      <div className="p-3">
        <svg viewBox="0 0 360 130" className="block w-full text-fg" role="img" aria-label="SSB filter method block diagram">
          {/* m(t) input */}
          <text x="20" y="50" fontSize="11" fill="currentColor">m(t)</text>
          <line x1="40" y1="46" x2="80" y2="46" stroke="currentColor" strokeWidth="1.2" />
          <Arrow x={80} y={46} />
          {/* multiplier circle */}
          <Multiplier cx={92} cy={46} />
          {/* carrier in from below */}
          <line x1="92" y1="80" x2="92" y2="58" stroke="currentColor" strokeWidth="1.2" />
          <Arrow x={92} y={58} dir="up" />
          <text x="120" y="84" fontSize="10" fill="currentColor" fillOpacity="0.7">cos(2π f_c t)</text>
          {/* DSB-SC out → BPF */}
          <line x1="104" y1="46" x2="180" y2="46" stroke="currentColor" strokeWidth="1.2" />
          <text x="115" y="38" fontSize="9" fill="currentColor" fillOpacity="0.6">DSB-SC</text>
          <Arrow x={180} y={46} />
          {/* BPF box */}
          <rect x="180" y="32" width="80" height="28" fill="rgba(217, 119, 6, 0.15)" stroke="rgb(217, 119, 6)" strokeWidth="1.2" rx="3" />
          <text x="220" y="50" fontSize="11" textAnchor="middle" fill="currentColor">BPF</text>
          {/* Output */}
          <line x1="260" y1="46" x2="320" y2="46" stroke="currentColor" strokeWidth="1.2" />
          <Arrow x={320} y={46} />
          <text x="328" y="50" fontSize="11" fill="currentColor">x_SSB(t)</text>
          {/* BPF spec annotation */}
          <text x="220" y="80" fontSize="9" textAnchor="middle" fill="currentColor" fillOpacity="0.7">
            Passband: USB ή LSB ζώνη
          </text>
          <text x="220" y="92" fontSize="9" textAnchor="middle" fill="currentColor" fillOpacity="0.7">
            Stopband: η άλλη πλευρά
          </text>
        </svg>
        <p className="mt-2 text-[11px] text-fg-muted leading-relaxed">
          <strong>Πλεονέκτημα:</strong> εννοιολογικά απλό. <strong>Μειονέκτημα:</strong>{' '}
          ο BPF πρέπει να είναι <strong>πολύ απότομος</strong> γύρω από το{' '}
          <span className="font-mono">f_c</span> για να κόβει την μία sideband
          χωρίς να επηρεάζει την άλλη. Δύσκολο όταν το message έχει στοιχεία
          κοντά στο DC (π.χ. φωνή με χαμηλές συχνότητες).
        </p>
      </div>
    </div>
  )
}

function PhaseShiftMethodPanel() {
  return (
    <div className="overflow-hidden rounded-md border border-border bg-bg-soft/40">
      <div className="border-b border-border bg-bg-soft px-3 py-1.5">
        <span className="text-[11px] font-semibold tracking-tight">2. Phase-shift (Hilbert) method</span>
      </div>
      <div className="p-3">
        <svg viewBox="0 0 360 180" className="block w-full text-fg" role="img" aria-label="SSB phase-shift method block diagram">
          {/* m(t) split into two paths */}
          <text x="20" y="50" fontSize="11" fill="currentColor">m(t)</text>
          <line x1="40" y1="46" x2="60" y2="46" stroke="currentColor" strokeWidth="1.2" />
          <line x1="60" y1="46" x2="60" y2="120" stroke="currentColor" strokeWidth="1.2" />
          {/* top path: m × cos */}
          <line x1="60" y1="46" x2="100" y2="46" stroke="currentColor" strokeWidth="1.2" />
          <Arrow x={100} y={46} />
          <Multiplier cx={112} cy={46} />
          <line x1="112" y1="76" x2="112" y2="58" stroke="currentColor" strokeWidth="1.2" />
          <Arrow x={112} y={58} dir="up" />
          <text x="140" y="80" fontSize="10" fill="currentColor" fillOpacity="0.7">cos(2π f_c t)</text>
          <line x1="124" y1="46" x2="240" y2="46" stroke="currentColor" strokeWidth="1.2" />
          {/* bottom path: m → Hilbert → × sin */}
          <line x1="60" y1="120" x2="80" y2="120" stroke="currentColor" strokeWidth="1.2" />
          <Arrow x={80} y={120} />
          <rect x="80" y="106" width="40" height="28" fill="rgba(168, 85, 247, 0.15)" stroke="rgb(168, 85, 247)" strokeWidth="1.2" rx="3" />
          <text x="100" y="124" fontSize="11" textAnchor="middle" fill="currentColor">ℋ</text>
          <text x="100" y="148" fontSize="9" textAnchor="middle" fill="currentColor" fillOpacity="0.7">m̂(t)</text>
          <line x1="120" y1="120" x2="160" y2="120" stroke="currentColor" strokeWidth="1.2" />
          <Arrow x={160} y={120} />
          <Multiplier cx={172} cy={120} />
          <line x1="172" y1="150" x2="172" y2="132" stroke="currentColor" strokeWidth="1.2" />
          <Arrow x={172} y={132} dir="up" />
          <text x="200" y="155" fontSize="10" fill="currentColor" fillOpacity="0.7">sin(2π f_c t)</text>
          <line x1="184" y1="120" x2="240" y2="120" stroke="currentColor" strokeWidth="1.2" />
          {/* sum/difference junction */}
          <rect x="240" y="76" width="36" height="28" fill="rgba(22, 163, 74, 0.15)" stroke="rgb(22, 163, 74)" strokeWidth="1.2" rx="3" />
          <text x="258" y="94" fontSize="13" textAnchor="middle" fill="currentColor">∓</text>
          {/* connect both inputs to the junction */}
          <line x1="240" y1="46" x2="258" y2="46" stroke="currentColor" strokeWidth="1.2" />
          <line x1="258" y1="46" x2="258" y2="76" stroke="currentColor" strokeWidth="1.2" />
          <line x1="240" y1="120" x2="258" y2="120" stroke="currentColor" strokeWidth="1.2" />
          <line x1="258" y1="120" x2="258" y2="104" stroke="currentColor" strokeWidth="1.2" />
          {/* output */}
          <line x1="276" y1="90" x2="320" y2="90" stroke="currentColor" strokeWidth="1.2" />
          <Arrow x={320} y={90} />
          <text x="328" y="94" fontSize="11" fill="currentColor">x_SSB(t)</text>
        </svg>
        <p className="mt-2 text-[11px] text-fg-muted leading-relaxed">
          <strong>Εξίσωση:</strong>{' '}
          <span className="font-mono">x_SSB(t) = m(t) cos(ω_c t) ∓ m̂(t) sin(ω_c t)</span>.
          Το «−» δίνει USB, το «+» δίνει LSB.{' '}
          <strong>Πλεονέκτημα:</strong> δεν χρειάζεται απότομο BPF.{' '}
          <strong>Μειονέκτημα:</strong> χρειάζεται ακριβής Hilbert για όλο το{' '}
          message bandwidth — που είναι πρακτικά δύσκολο σε αναλογικό κύκλωμα.
        </p>
      </div>
    </div>
  )
}

function Arrow({ x, y, dir = 'right' }: { x: number; y: number; dir?: 'right' | 'up' | 'down' }) {
  if (dir === 'right') {
    return <polygon points={`${x},${y} ${x - 6},${y - 4} ${x - 6},${y + 4}`} fill="currentColor" />
  }
  if (dir === 'up') {
    return <polygon points={`${x},${y} ${x - 4},${y + 6} ${x + 4},${y + 6}`} fill="currentColor" />
  }
  return <polygon points={`${x},${y} ${x - 4},${y - 6} ${x + 4},${y - 6}`} fill="currentColor" />
}

function Multiplier({ cx, cy }: { cx: number; cy: number }) {
  const r = 10
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="rgba(29, 78, 216, 0.15)" stroke="rgb(29, 78, 216)" strokeWidth="1.2" />
      <line x1={cx - 5} y1={cy - 5} x2={cx + 5} y2={cy + 5} stroke="rgb(29, 78, 216)" strokeWidth="1.4" />
      <line x1={cx - 5} y1={cy + 5} x2={cx + 5} y2={cy - 5} stroke="rgb(29, 78, 216)" strokeWidth="1.4" />
    </g>
  )
}
