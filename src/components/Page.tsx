import { forwardRef } from 'react'
import type { WeaponSpell } from '../data/weaponSpells'

export type PageProps = {
  side: 'left' | 'right'
  spell: WeaponSpell | null
}

function SpellIcon({ icon, label }: { icon: string; label: string }) {
  const isUrl = /^https?:\/\//i.test(icon)
  if (isUrl) {
    return (
      <span className="page__icon page__icon--img" aria-hidden="true">
        <img
          src={icon}
          alt=""
          className="page__icon-img"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      </span>
    )
  }
  return (
    <span className="page__icon" aria-hidden="true" title={label}>
      {icon}
    </span>
  )
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
            <header className="page__header">
              <SpellIcon icon={spell.icon} label={spell.spellName} />
              <div className="page__headlines">
                <p className="page__type">{spell.weaponType}</p>
                <h2 className="page__title">{spell.spellName}</h2>
                <p className="page__weapon">{spell.weaponName}</p>
              </div>
            </header>
            <p className="page__desc">{spell.description}</p>
            <dl className="page__stats">
              <div className="page__stat">
                <dt>Énergie</dt>
                <dd>{spell.energyCost}</dd>
              </div>
              <div className="page__stat">
                <dt>Incantation</dt>
                <dd>
                  {spell.castTimeLabel.toLowerCase() === 'instant' ||
                  spell.castTimeS === 0
                    ? spell.castTimeLabel
                    : `${spell.castTimeS}s`}
                </dd>
              </div>
              <div className="page__stat">
                <dt>Portée</dt>
                <dd>
                  {spell.rangeLabel.toLowerCase() === 'self'
                    ? 'Soi'
                    : spell.rangeLabel.includes('/')
                      ? spell.rangeLabel
                      : `${spell.rangeM} m`}
                </dd>
              </div>
              <div className="page__stat">
                <dt>Recharge</dt>
                <dd>
                  {typeof spell.cooldownS === 'number'
                    ? `${spell.cooldownS}s`
                    : spell.cooldownS}
                </dd>
              </div>
            </dl>
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
