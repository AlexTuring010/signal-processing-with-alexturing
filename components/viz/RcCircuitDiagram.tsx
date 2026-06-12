/**
 * RC first-order lowpass schematic — a resistor R in series, a capacitor C to
 * ground, output taken across the capacitor. Static SVG, theme-aware via
 * currentColor. Used in /foundations/filters §6β.
 */
export function RcCircuitDiagram() {
  return (
    <figure className="my-4 flex flex-col items-center">
      <svg
        viewBox="0 0 340 150"
        role="img"
        aria-label="Κύκλωμα RC: αντιστάτης R σε σειρά, πυκνωτής C προς τη γη, έξοδος πάνω στον πυκνωτή"
        className="w-full max-w-sm text-fg"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* input terminal */}
        <circle cx={26} cy={48} r={4} />
        {/* wire: input → resistor */}
        <line x1={30} y1={48} x2={118} y2={48} />
        {/* resistor (series) */}
        <rect x={118} y={39} width={64} height={18} rx={2} />
        {/* wire: resistor → node → output terminal */}
        <line x1={182} y1={48} x2={306} y2={48} />
        {/* node */}
        <circle cx={244} cy={48} r={2.6} fill="currentColor" stroke="none" />
        {/* output terminal */}
        <circle cx={310} cy={48} r={4} />
        {/* node → capacitor */}
        <line x1={244} y1={48} x2={244} y2={86} />
        {/* capacitor plates */}
        <line x1={222} y1={86} x2={266} y2={86} />
        <line x1={222} y1={96} x2={266} y2={96} />
        {/* capacitor → ground */}
        <line x1={244} y1={96} x2={244} y2={116} />
        {/* ground symbol */}
        <line x1={222} y1={116} x2={266} y2={116} />
        <line x1={229} y1={122} x2={259} y2={122} />
        <line x1={236} y1={128} x2={252} y2={128} />
        {/* labels */}
        <g fill="currentColor" stroke="none">
          <text x={26} y={30} textAnchor="middle" fontSize={11}>
            v_in
          </text>
          <text x={150} y={31} textAnchor="middle" fontSize={13} fontWeight={600}>
            R
          </text>
          <text x={310} y={30} textAnchor="middle" fontSize={11}>
            v_out
          </text>
          <text x={286} y={95} textAnchor="middle" fontSize={13} fontWeight={600}>
            C
          </text>
        </g>
      </svg>
      <figcaption className="mt-1 max-w-sm text-center text-xs text-fg-muted">
        Ο αντιστάτης <strong>R</strong> σε σειρά, ο πυκνωτής <strong>C</strong> προς τη
        γη· η έξοδος <span className="font-mono">v_out</span> μετριέται πάνω στον πυκνωτή.
      </figcaption>
    </figure>
  )
}
