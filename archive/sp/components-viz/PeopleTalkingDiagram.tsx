/**
 * Decorative SVG: two people talking, with the air labeled as the "channel".
 * Used in the intro to anchor the abstract source/channel/receiver structure
 * in something everyone has experienced.
 */
export function PeopleTalkingDiagram() {
  return (
    <figure className="my-6 rounded-lg border border-border bg-bg-elevated p-4">
      <svg
        viewBox="0 0 600 220"
        role="img"
        aria-label="Δύο άνθρωποι μιλάνε. Το στόμα του πρώτου είναι ο πομπός, ο αέρας ανάμεσά τους το κανάλι, και το αυτί του δεύτερου ο δέκτης."
        className="w-full"
      >
        {/* Person A — speaker */}
        <g transform="translate(50,40)">
          <circle cx="40" cy="35" r="28" fill="rgb(var(--bg-soft))" stroke="rgb(var(--accent))" strokeWidth="2" />
          {/* face */}
          <circle cx="32" cy="30" r="2.5" fill="rgb(var(--fg))" />
          <circle cx="48" cy="30" r="2.5" fill="rgb(var(--fg))" />
          <path d="M 28 42 Q 40 50 52 42" stroke="rgb(var(--fg))" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* body */}
          <path
            d="M 40 65 L 40 130 M 40 90 L 15 110 M 40 90 L 65 110 M 40 130 L 25 165 M 40 130 L 55 165"
            stroke="rgb(var(--fg))"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <text x="40" y="190" textAnchor="middle" className="fill-fg text-xs font-medium">
            Πομπός
          </text>
          <text x="40" y="205" textAnchor="middle" className="fill-fg-muted text-[10px]">
            (στόμα)
          </text>
        </g>

        {/* Speech bubbles / sound waves */}
        <g transform="translate(140,80)">
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M 0 0 Q ${20 + i * 25} -22 ${40 + i * 50} 0 Q ${20 + i * 25} 22 0 0`}
              fill="none"
              stroke="rgb(var(--accent))"
              strokeWidth="1.5"
              strokeOpacity={0.25 + i * 0.2}
            >
              <animate
                attributeName="stroke-opacity"
                values={`${0.15 + i * 0.2}; ${0.5 + i * 0.15}; ${0.15 + i * 0.2}`}
                dur="2.4s"
                begin={`${i * 0.4}s`}
                repeatCount="indefinite"
              />
            </path>
          ))}
          <text x="100" y="-40" textAnchor="middle" className="fill-fg-muted text-xs italic">
            αέρας · κανάλι
          </text>
          <text x="100" y="50" textAnchor="middle" className="fill-fg-subtle text-[10px]">
            (μεταφέρει το σήμα · προσθέτει θόρυβο)
          </text>
        </g>

        {/* Person B — listener */}
        <g transform="translate(440,40)">
          <circle cx="40" cy="35" r="28" fill="rgb(var(--bg-soft))" stroke="rgb(var(--accent))" strokeWidth="2" />
          {/* face — slight smile, listening */}
          <circle cx="32" cy="30" r="2.5" fill="rgb(var(--fg))" />
          <circle cx="48" cy="30" r="2.5" fill="rgb(var(--fg))" />
          <path d="M 30 44 L 50 44" stroke="rgb(var(--fg))" strokeWidth="2" strokeLinecap="round" />
          {/* highlight ear */}
          <circle cx="13" cy="35" r="5" fill="rgb(var(--accent-soft))" stroke="rgb(var(--accent))" strokeWidth="1.5" />
          {/* body */}
          <path
            d="M 40 65 L 40 130 M 40 90 L 15 110 M 40 90 L 65 110 M 40 130 L 25 165 M 40 130 L 55 165"
            stroke="rgb(var(--fg))"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          <text x="40" y="190" textAnchor="middle" className="fill-fg text-xs font-medium">
            Δέκτης
          </text>
          <text x="40" y="205" textAnchor="middle" className="fill-fg-muted text-[10px]">
            (αυτί)
          </text>
        </g>
      </svg>
      <figcaption className="mt-1 text-center text-xs text-fg-muted">
        Δύο άνθρωποι μιλάνε — το πιο απλό communication system στον κόσμο.
      </figcaption>
    </figure>
  )
}
