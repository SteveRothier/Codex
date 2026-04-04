import { forwardRef } from 'react'
import type { SpellEntry } from '../data/spells'

export type PageProps = {
  side: 'left' | 'right'
  spell: SpellEntry | null
}

const Page = forwardRef<HTMLDivElement, PageProps>(function Page(
  { side, spell },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`page page--${side} flip-book-page`}
      aria-label={side === 'left' ? 'Page gauche' : 'Page droite'}
    >
      <span className="page__fore-edge" aria-hidden="true" />
      <span className="page__gutter-shadow" aria-hidden="true" />
      <div className="page__texture" aria-hidden="true" />
      <div className="page__inner">
        {spell ? (
          <>
            <h2 className="page__title">{spell.name}</h2>
            <p className="page__desc">{spell.description}</p>
            <small className="page__level">{spell.level}</small>
          </>
        ) : (
          <div className="page__empty" aria-hidden="true">
            <span className="page__empty-line" />
          </div>
        )}
      </div>
    </div>
  )
})

Page.displayName = 'Page'

export default Page
