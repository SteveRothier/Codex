import gsap from 'gsap'
import { useLayoutEffect, useRef } from 'react'
import type { SpellEntry } from '../data/spells'

export type PageProps = {
  side: 'left' | 'right'
  spell: SpellEntry | null
  /** Incrémenté à chaque changement de spread pour rejouer l’entrée */
  spreadKey: number
}

export default function Page({ side, spell, spreadKey }: PageProps) {
  const innerRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = innerRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      const fromX = side === 'left' ? -22 : 22
      gsap.fromTo(
        root,
        { opacity: 0, x: fromX },
        {
          opacity: 1,
          x: 0,
          duration: 0.48,
          ease: 'power2.out',
        },
      )
    }, root)

    return () => ctx.revert()
  }, [side, spreadKey])

  return (
    <div
      className={`page page--${side}`}
      aria-label={side === 'left' ? 'Page gauche' : 'Page droite'}
    >
      <div ref={innerRef} className="page__inner">
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
}
