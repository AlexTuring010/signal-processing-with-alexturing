import type { ItemRenderProps } from '@/lib/collectibles/types'

/**
 * VSB σκιν — body with asymmetric stripe set: full bands on the
 * left (the "kept" sideband) and a tapering vestige on the right
 * (the "vestigial" remainder). Reads as the VSB shaping filter.
 */
export function VsbSkin({ adult }: ItemRenderProps) {
  const bodyW = adult ? 78 : 70
  const bodyH = adult ? 76 : 68
  const clipId = `vsb-skin-clip-${adult ? 'a' : 'b'}`
  return (
    <g aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <ellipse cx="60" cy="60" rx={bodyW / 2} ry={bodyH / 2} />
        </clipPath>
      </defs>
      {/* Body backdrop — soft teal so the asymmetric stripes pop */}
      <ellipse
        cx="60"
        cy="60"
        rx={bodyW / 2}
        ry={bodyH / 2}
        fill="#3a6f78"
      />
      <g clipPath={`url(#${clipId})`}>
        {/* Full bands on the left — kept sideband */}
        <rect x="28" y={60 - bodyH / 2} width="6" height={bodyH} fill="#cfeae0" />
        <rect x="36" y={60 - bodyH / 2} width="6" height={bodyH} fill="#9bc8c0" />
        <rect x="44" y={60 - bodyH / 2} width="6" height={bodyH} fill="#cfeae0" />
        <rect x="52" y={60 - bodyH / 2} width="6" height={bodyH} fill="#9bc8c0" />
        {/* Vestige on the right — narrower stripes that taper away */}
        <rect x="62" y={60 - bodyH / 2} width="4" height={bodyH} fill="#cfeae0" opacity="0.7" />
        <rect x="68" y={60 - bodyH / 2} width="3" height={bodyH} fill="#9bc8c0" opacity="0.5" />
        <rect x="73" y={60 - bodyH / 2} width="2" height={bodyH} fill="#cfeae0" opacity="0.3" />
      </g>
    </g>
  )
}
