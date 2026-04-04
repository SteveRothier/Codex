import { useEffect, useState } from 'react'
import Page from './Page'
import { spells } from '../data/spells'

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  return target.isContentEditable
}

function spreadSpellAt(index: number) {
  return spells[index] ?? null
}

export default function Book() {
  const spreadCount = Math.max(1, Math.ceil(spells.length / 2))
  const maxSpread = spreadCount - 1

  const [spreadIndex, setSpreadIndex] = useState(0)

  const leftSpell = spreadSpellAt(spreadIndex * 2)
  const rightSpell = spreadSpellAt(spreadIndex * 2 + 1)

  const nextPage = () => {
    if (spreadIndex < maxSpread) setSpreadIndex((i) => i + 1)
  }

  const prevPage = () => {
    if (spreadIndex > 0) setSpreadIndex((i) => i - 1)
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (isTypingTarget(e.target)) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        setSpreadIndex((i) => (i > 0 ? i - 1 : i))
      } else {
        e.preventDefault()
        setSpreadIndex((i) => (i < maxSpread ? i + 1 : i))
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [maxSpread])

  return (
    <div className="book">
      <div className="book__spread" role="region" aria-label="Grimoire ouvert">
        <Page side="left" spell={leftSpell} />
        <div className="book__spine" aria-hidden="true" />
        <Page side="right" spell={rightSpell} />
      </div>
      <div className="controls">
        <button
          type="button"
          onClick={prevPage}
          disabled={spreadIndex <= 0}
        >
          Page précédente
        </button>
        <button
          type="button"
          onClick={nextPage}
          disabled={spreadIndex >= maxSpread}
        >
          Page suivante
        </button>
      </div>
    </div>
  )
}
