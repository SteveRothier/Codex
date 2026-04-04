import { useState } from 'react'
import Page from './Page'
import { spells } from '../data/spells'

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
