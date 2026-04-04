import HTMLFlipBook from 'react-pageflip'
import type { PageFlip } from 'page-flip'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from 'react'
import Page from './Page'
import { spells } from '../data/spells'
import { useFlipBookSize } from '../hooks/useFlipBookSize'

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  return target.isContentEditable
}

function spreadSpellAt(index: number) {
  return spells[index] ?? null
}

type FlipBookRef = {
  pageFlip: () => PageFlip | undefined
}

export default function Book() {
  const spreadCount = Math.max(1, Math.ceil(spells.length / 2))
  const pageCount = spreadCount * 2

  const { pageWidth, pageHeight } = useFlipBookSize()
  const bookRef = useRef<FlipBookRef>(null)

  const [pageIndex, setPageIndex] = useState(0)

  const flipPages = useMemo(() => {
    const nodes: ReactElement[] = []
    for (let s = 0; s < spreadCount; s++) {
      nodes.push(
        <Page
          key={`spread-${s}-left`}
          side="left"
          spell={spreadSpellAt(s * 2)}
        />,
        <Page
          key={`spread-${s}-right`}
          side="right"
          spell={spreadSpellAt(s * 2 + 1)}
        />,
      )
    }
    return nodes
  }, [spreadCount])

  const handleFlip = useCallback((e: { data: number }) => {
    setPageIndex(e.data)
  }, [])

  const handleInit = useCallback((e: { data: { page: number } }) => {
    setPageIndex(e.data.page)
  }, [])

  const canPrev = pageIndex > 0
  const canNext = pageIndex + 2 < pageCount

  const flipPrev = () => {
    bookRef.current?.pageFlip()?.flipPrev()
  }

  const flipNext = () => {
    bookRef.current?.pageFlip()?.flipNext()
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if (isTypingTarget(e.target)) return

      if (e.key === 'ArrowLeft') {
        if (!canPrev) return
        e.preventDefault()
        flipPrev()
      } else {
        if (!canNext) return
        e.preventDefault()
        flipNext()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [canPrev, canNext])

  return (
    <div className="book">
      <div className="book__flip-wrap">
        <HTMLFlipBook
          ref={bookRef}
          className="book__stf"
          style={{}}
          width={pageWidth}
          height={pageHeight}
          size="fixed"
          minWidth={pageWidth}
          maxWidth={pageWidth}
          minHeight={pageHeight}
          maxHeight={pageHeight}
          drawShadow
          flippingTime={750}
          usePortrait
          startPage={0}
          startZIndex={0}
          autoSize
          maxShadowOpacity={0.55}
          showCover={false}
          mobileScrollSupport
          clickEventForward
          useMouseEvents
          swipeDistance={30}
          showPageCorners
          disableFlipByClick={false}
          onFlip={handleFlip}
          onInit={handleInit}
        >
          {flipPages}
        </HTMLFlipBook>
      </div>
      <div className="controls">
        <button type="button" onClick={flipPrev} disabled={!canPrev}>
          Page précédente
        </button>
        <button type="button" onClick={flipNext} disabled={!canNext}>
          Page suivante
        </button>
      </div>
    </div>
  )
}
