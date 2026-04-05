import { forwardRef, useMemo, useRef, useState } from 'react'
import type { WeaponSpell } from '../data/weaponSpells'
import { weaponSpells } from '../data/weaponSpells'
import {
  useStopFlipBookSearchInputPointer,
  useStopFlipOnSearchResultButtons,
} from '../hooks/useStopFlipBookPointer'
import { SpellIcon } from './SpellIcon'

const MAX_SEARCH_RESULTS = 45

function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
}

function spellMatchesQuery(spell: WeaponSpell, q: string): boolean {
  const n = normalize(q)
  if (!n) return false
  return (
    normalize(spell.spellName).includes(n) ||
    normalize(spell.weaponName).includes(n) ||
    normalize(spell.weaponType).includes(n)
  )
}

type BookIndexPageLeftProps = {
  onPickSpell: (spellIndex: number) => void
}

export const BookIndexPageLeft = forwardRef<
  HTMLDivElement,
  BookIndexPageLeftProps
>(function BookIndexPageLeft({ onPickSpell }, ref) {
  const [query, setQuery] = useState('')
  const searchInputRef = useStopFlipBookSearchInputPointer()
  const resultsRef = useRef<HTMLDivElement>(null)
  useStopFlipOnSearchResultButtons(resultsRef)

  const results = useMemo(() => {
    const q = query.trim()
    if (!q) return []
    const out: { spell: WeaponSpell; index: number }[] = []
    for (let i = 0; i < weaponSpells.length; i++) {
      const spell = weaponSpells[i]!
      if (spellMatchesQuery(spell, q)) {
        out.push({ spell, index: i })
        if (out.length >= MAX_SEARCH_RESULTS) break
      }
    }
    return out
  }, [query])

  return (
    <div
      ref={ref}
      className="page page--right flip-book-page index-page index-page--right"
      aria-label="Index — recherche"
    >
      <span className="page__fore-edge" aria-hidden="true" />
      <span className="page__gutter-shadow" aria-hidden="true" />
      <div className="page__texture" aria-hidden="true" />
      <div className="page__inner index-page__inner">
        <header className="index-page__header">
          <p className="index-page__label">Recherche</p>
          <input
            ref={searchInputRef}
            type="search"
            className="index-page__search"
            placeholder="Sort, arme, type…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Rechercher un sort, une arme ou un type"
            autoComplete="off"
          />
        </header>
        <div ref={resultsRef} className="index-page__results" role="list">
          {!query.trim() ? (
            <p className="index-page__hint">
              Saisissez un nom de sort, d’arme ou de catégorie pour afficher
              des résultats.
            </p>
          ) : results.length === 0 ? (
            <p className="index-page__empty">Aucun résultat.</p>
          ) : (
            results.map(({ spell, index }) => (
              <button
                key={`${spell.spellName}-${index}`}
                type="button"
                className="index-page__result"
                role="listitem"
                onClick={() => onPickSpell(index)}
              >
                <SpellIcon
                  variant="compact"
                  icon={spell.icon}
                  label={spell.spellName}
                />
                <span className="index-page__result-text">
                  <span className="index-page__result-title">
                    {spell.spellName}
                  </span>
                  <span className="index-page__result-meta">
                    {spell.weaponType} · {spell.weaponName}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
})

BookIndexPageLeft.displayName = 'BookIndexPageLeft'

export {
  BookIndexPageRight,
  type BookIndexPageRightProps,
} from './BookIndexPageRight'
