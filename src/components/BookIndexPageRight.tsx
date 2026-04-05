import { forwardRef, useState } from 'react'
import type { WeaponCategory } from '../data/bookNavigation'
import { useStopFlipBookPointerPropagation } from '../hooks/useStopFlipBookPointer'

export interface BookIndexPageRightProps {
  categories: WeaponCategory[]
  onPickSpell: (spellIndex: number) => void
}

export const BookIndexPageRight = forwardRef<
  HTMLDivElement,
  BookIndexPageRightProps
>(function BookIndexPageRight({ categories, onPickSpell }, ref) {
  const indexInnerRef = useStopFlipBookPointerPropagation<HTMLDivElement>()
  const [openWeaponType, setOpenWeaponType] = useState<string | null>(null)

  const toggleCategory = (weaponType: string) => {
    setOpenWeaponType((prev) => (prev === weaponType ? null : weaponType))
  }

  return (
    <div
      ref={ref}
      className="page page--left flip-book-page index-page index-page--left"
      aria-label="Index — catégories"
    >
      <span className="page__fore-edge" aria-hidden="true" />
      <span className="page__gutter-shadow" aria-hidden="true" />
      <div className="page__texture" aria-hidden="true" />
      <div
        ref={indexInnerRef}
        className="page__inner index-page__inner"
      >
        <header className="index-page__header">
          <h2 className="index-page__title">Catégories d’armes</h2>
          <p className="index-page__subtitle">
            Ouvrez une catégorie, puis choisissez une arme pour afficher son
            sort.
          </p>
        </header>
        <div className="index-page__categories" role="list">
          {categories.map((c, catIdx) => {
            const isOpen = openWeaponType === c.weaponType
            const panelId = `index-cat-${catIdx}`
            const toggleId = `${panelId}-toggle`
            return (
              <div
                key={c.weaponType}
                className="index-page__category-block"
                role="listitem"
              >
                <button
                  type="button"
                  id={toggleId}
                  className={`index-page__category${isOpen ? ' index-page__category--open' : ''}`}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggleCategory(c.weaponType)}
                >
                  <span className="index-page__category-chevron" aria-hidden>
                    {isOpen ? '▼' : '▶'}
                  </span>
                  <span className="index-page__category-name">{c.weaponType}</span>
                  <span className="index-page__category-count">
                    {c.weapons.length}
                  </span>
                </button>
                {isOpen ? (
                  <ul
                    id={panelId}
                    className="index-page__weapon-list"
                    aria-labelledby={toggleId}
                  >
                    {c.weapons.map((w) => (
                      <li key={`${w.weaponName}-${w.spellIndex}`}>
                        <button
                          type="button"
                          className="index-page__weapon"
                          onClick={() => onPickSpell(w.spellIndex)}
                        >
                          {w.weaponName}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})

BookIndexPageRight.displayName = 'BookIndexPageRight'
