import type { ReactNode } from 'react'

export type PageProps = {
  side: 'left' | 'right'
  children?: ReactNode
}

export function Page({ side, children }: PageProps) {
  return (
    <article
      className={`book__page book__page--${side}`}
      aria-label={side === 'left' ? 'Page gauche' : 'Page droite'}
    >
      {children}
    </article>
  )
}
