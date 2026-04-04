import type { ReactNode } from 'react'
import { Page } from './Page'
import '../styles/book.css'

export type BookProps = {
  leftPage?: ReactNode
  rightPage?: ReactNode
}

export function Book({ leftPage, rightPage }: BookProps) {
  return (
    <div className="book" role="region" aria-label="Grimoire ouvert">
      <div className="book__spread">
        <Page side="left">{leftPage}</Page>
        <Page side="right">{rightPage}</Page>
      </div>
    </div>
  )
}
