import gsap from 'gsap'
import { forwardRef, useLayoutEffect, useRef } from 'react'

export type CoverProps = {
  variant: 'front' | 'back'
}

const Cover = forwardRef<HTMLDivElement, CoverProps>(function Cover(
  { variant },
  ref,
) {
  const isFront = variant === 'front'
  const toolingRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const el = toolingRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const from = isFront
      ? '0% 0%, 0% 0%, center, center, center'
      : '100% 100%, 100% 100%, center, center, center'
    const to = isFront
      ? '32% 22%, -24% 14%, center, center, center'
      : '68% 78%, 124% 86%, center, center, center'

    const tween = gsap.fromTo(
      el,
      { backgroundPosition: from },
      {
        backgroundPosition: to,
        duration: 48 + Math.random() * 16,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      },
    )
    return () => {
      tween.kill()
    }
  }, [isFront])

  return (
    <div
      ref={ref}
      className={`cover cover--${variant} flip-book-page`}
      aria-label={isFront ? 'Couverture du grimoire' : 'Quatrième de couverture'}
    >
      <span
        ref={toolingRef}
        className={`cover__tooling cover__tooling--${variant}`}
        aria-hidden="true"
      />
      <span className="cover__board cover__board--outer" aria-hidden="true" />
      <span className="cover__page-stack" aria-hidden="true" />
      <span className="cover__bevel" aria-hidden="true" />
      <div className="cover__inner">
        {isFront ? (
          <>
            <p className="cover__eyebrow">Grimoire</p>
            <h1 className="cover__title">Codex</h1>
            <p className="cover__subtitle">Arcanes & sortilèges</p>
            <div className="cover__ornament" aria-hidden="true" />
            <p className="cover__hint">Tournez la page pour ouvrir</p>
          </>
        ) : (
          <>
            <div className="cover__ornament cover__ornament--small" aria-hidden="true" />
            <p className="cover__back-title">Codex</p>
            <p className="cover__back-line">Fin du volume</p>
          </>
        )}
      </div>
    </div>
  )
})

Cover.displayName = 'Cover'

export default Cover
