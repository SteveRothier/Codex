import { type RefObject, useLayoutEffect, useRef } from 'react'

/**
 * Empêche mousedown / touchstart de remonter au conteneur StPageFlip (qui
 * déclencherait un retournement). Les handlers React arrivent trop tard ;
 * il faut des listeners natifs sur un ancêtre du champ, avant la phase bubble
 * vers `.stf__block`.
 */
export function useStopFlipBookPointerPropagation<
  T extends HTMLElement = HTMLDivElement,
>(): RefObject<T | null> {
  const elRef = useRef<T | null>(null)

  useLayoutEffect(() => {
    const el = elRef.current
    if (!el) return

    const stop = (e: Event) => {
      e.stopPropagation()
    }

    el.addEventListener('mousedown', stop)
    el.addEventListener('touchstart', stop, { passive: true })

    return () => {
      el.removeEventListener('mousedown', stop)
      el.removeEventListener('touchstart', stop)
    }
  }, [])

  return elRef
}

/**
 * Même principe, mais uniquement sur le champ recherche : le flip reste actif
 * sur le reste de la page (marges, liste de résultats).
 */
export function useStopFlipBookSearchInputPointer(): RefObject<HTMLInputElement | null> {
  const elRef = useRef<HTMLInputElement | null>(null)

  useLayoutEffect(() => {
    const el = elRef.current
    if (!el) return

    const stop = (e: Event) => {
      e.stopPropagation()
    }

    el.addEventListener('mousedown', stop)
    el.addEventListener('touchstart', stop, { passive: true })

    return () => {
      el.removeEventListener('mousedown', stop)
      el.removeEventListener('touchstart', stop)
    }
  }, [])

  return elRef
}

const RESULT_BUTTON_SELECTOR = 'button.index-page__result'

/**
 * Stoppe la propagation si le pointeur vise un résultat (bouton ou enfant,
 * ex. span titre) : StPageFlip ne voit pas `button` quand target est le span.
 */
export function useStopFlipOnSearchResultButtons(
  containerRef: RefObject<HTMLElement | null>,
): void {
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return

    const stop = (e: Event) => {
      const t = e.target
      if (t instanceof Element && t.closest(RESULT_BUTTON_SELECTOR)) {
        e.stopPropagation()
      }
    }

    el.addEventListener('mousedown', stop)
    el.addEventListener('touchstart', stop, { passive: true })

    return () => {
      el.removeEventListener('mousedown', stop)
      el.removeEventListener('touchstart', stop)
    }
  }, [containerRef])
}
