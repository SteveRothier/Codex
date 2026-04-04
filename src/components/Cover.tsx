import { forwardRef } from 'react'

export type CoverProps = {
  variant: 'front' | 'back'
}

const Cover = forwardRef<HTMLDivElement, CoverProps>(function Cover(
  { variant },
  ref,
) {
  const isFront = variant === 'front'

  return (
    <div
      ref={ref}
      className={`cover cover--${variant} flip-book-page`}
      aria-label={isFront ? 'Couverture du grimoire' : 'Quatrième de couverture'}
    >
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
