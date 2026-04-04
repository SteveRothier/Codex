import { useState } from 'react'
import Page from './Page'
import { spells } from '../data/spells'

export default function Book() {
  const [currentPage, setCurrentPage] = useState(0)

  const nextPage = () => {
    if (currentPage < spells.length - 1) setCurrentPage(currentPage + 1)
  }

  const prevPage = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1)
  }

  return (
    <div className="book">
      <Page spell={spells[currentPage]} />
      <div className="controls">
        <button type="button" onClick={prevPage}>
          Prev
        </button>
        <button type="button" onClick={nextPage}>
          Next
        </button>
      </div>
    </div>
  )
}
