import type { SpellEntry } from '../data/spells'

export type PageProps = {
  side: 'left' | 'right'
  spell: SpellEntry | null
}

export default function Page({ side, spell }: PageProps) {
  return (
    <div
      className={`page page--${side}`}
      aria-label={side === 'left' ? 'Page gauche' : 'Page droite'}
    >
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
  )
}
