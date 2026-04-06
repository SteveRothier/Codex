import {
  useCallback,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'

/**
 * Rune / sigil décoratif sur la couverture : animation continue + survol (parallax)
 * et clic (éclair). Respecte prefers-reduced-motion.
 */
export function CoverRune() {
  const id = useId().replace(/:/g, '')
  const gradId = `coverRuneGrad-${id}`
  const filterId = `coverRuneGlow-${id}`
  const wrapRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [burst, setBurst] = useState(false)

  const onMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const el = wrapRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const mx = (e.clientX - rect.left) / rect.width - 0.5
    const my = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: mx * 16, y: -my * 14 })
  }, [])

  const onLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  const triggerBurst = useCallback(() => {
    setBurst(true)
    window.setTimeout(() => setBurst(false), 520)
  }, [])

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        triggerBurst()
      }
    },
    [triggerBurst],
  )

  const tiltStyle: CSSProperties = {
    transform: `perspective(380px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
    transformStyle: 'preserve-3d',
  }

  return (
    <div
      ref={wrapRef}
      className={`cover-rune${burst ? ' cover-rune--burst' : ''}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={triggerBurst}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Rune arcanique — cliquer pour une pulsation"
    >
      <div className="cover-rune__tilt" style={tiltStyle}>
        <svg
          className="cover-rune__svg"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id={gradId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(232, 210, 160, 0.95)" />
              <stop offset="45%" stopColor="rgba(201, 162, 39, 0.9)" />
              <stop offset="100%" stopColor="rgba(160, 120, 200, 0.85)" />
            </linearGradient>
            <filter
              id={filterId}
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g className="cover-rune__glow" filter={`url(#${filterId})`}>
            <circle
              className="cover-rune__ring cover-rune__ring--outer"
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="1.1"
            />
            <g className="cover-rune__orbit">
              <circle
                cx="50"
                cy="50"
                r="33"
                fill="none"
                stroke={`url(#${gradId})`}
                strokeWidth="0.55"
                strokeDasharray="3.2 4.8"
                opacity="0.85"
              />
            </g>
            <path
              className="cover-rune__hex"
              d="M50 21 L67.5 56 L32.5 56 Z M50 79 L32.5 44 L67.5 44 Z"
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="0.85"
              strokeLinejoin="round"
            />
            <path
              className="cover-rune__core"
              d="M50 34 L50 66 M36 42 L64 58 M64 42 L36 58"
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="0.75"
              strokeLinecap="round"
            />
            <circle
              cx="50"
              cy="50"
              r="6"
              fill="none"
              stroke={`url(#${gradId})`}
              strokeWidth="0.65"
            />
          </g>
        </svg>
      </div>
    </div>
  )
}
