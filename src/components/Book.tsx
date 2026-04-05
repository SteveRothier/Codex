import HTMLFlipBook from 'react-pageflip'
import type { PageFlip } from 'page-flip'
import {
  Book as BookClosedIcon,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from 'react'
import Cover from './Cover'
import { BookIndexPageLeft, BookIndexPageRight } from './BookIndexPage'
import Page from './Page'
import {
  getBackCoverBookPage,
  getBookPageCount,
  getSpellSpreadCount,
  getWeaponCategories,
  INDEX_BOOK_PAGE,
  spellIndexToBookPage,
} from '../data/bookNavigation'
import { readStoredBookPage, writeStoredBookPage } from '../data/bookPageStorage'
import { weaponSpells } from '../data/weaponSpells'
import { useFlipBookSize } from '../hooks/useFlipBookSize'

const CONTROL_ICON_PROPS = {
  size: 22,
  strokeWidth: 2,
  'aria-hidden': true as const,
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true
  return target.isContentEditable
}

function spreadSpellAt(index: number) {
  return weaponSpells[index] ?? null
}

type FlipBookRef = {
  pageFlip: () => PageFlip | undefined
}

/** L’API runtime inclut `turnToPage` (saut sans animation) ; les types empaquetés sont incomplets. */
function turnBookToPage(pf: PageFlip | undefined, page: number): void {
  if (!pf) return
  ;(pf as unknown as { turnToPage: (n: number) => void }).turnToPage(page)
}

export default function Book() {
  const spellSpreadCount = getSpellSpreadCount()
  /** 1 couverture + 2 (index) + 2 pages par spread de sorts + 1 quatrième de couverture */
  const pageCount = getBookPageCount()

  const { pageWidth, pageHeight } = useFlipBookSize()
  const bookRef = useRef<FlipBookRef>(null)

  const categories = useMemo(() => getWeaponCategories(), [])

  const initialStartPage = useMemo(
    () => readStoredBookPage(pageCount - 1),
    [pageCount],
  )

  const [pageIndex, setPageIndex] = useState(initialStartPage)

  const navigateToSpellIndex = useCallback((spellIndex: number) => {
    if (spellIndex < 0 || spellIndex >= weaponSpells.length) return
    const page = spellIndexToBookPage(spellIndex)
    turnBookToPage(bookRef.current?.pageFlip(), page)
    setPageIndex(page)
    writeStoredBookPage(page)
  }, [])

  const flipPages = useMemo(() => {
    const nodes: ReactElement[] = [
      <Cover key="cover-front" variant="front" />,
      <BookIndexPageRight
        key="index-categories"
        categories={categories}
        onPickSpell={navigateToSpellIndex}
      />,
      <BookIndexPageLeft
        key="index-search"
        onPickSpell={navigateToSpellIndex}
      />,
    ]
    for (let s = 0; s < spellSpreadCount; s++) {
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
    nodes.push(<Cover key="cover-back" variant="back" />)
    return nodes
  }, [spellSpreadCount, categories, navigateToSpellIndex])

  const handleFlip = useCallback((e: { data: number }) => {
    setPageIndex(e.data)
    writeStoredBookPage(e.data)
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

  const goToClosedCover = useCallback(() => {
    turnBookToPage(bookRef.current?.pageFlip(), 0)
    setPageIndex(0)
    writeStoredBookPage(0)
  }, [])

  const goToIndexSpread = useCallback(() => {
    turnBookToPage(bookRef.current?.pageFlip(), INDEX_BOOK_PAGE)
    setPageIndex(INDEX_BOOK_PAGE)
    writeStoredBookPage(INDEX_BOOK_PAGE)
  }, [])

  const goToBackCover = useCallback(() => {
    const p = getBackCoverBookPage(pageCount)
    turnBookToPage(bookRef.current?.pageFlip(), p)
    setPageIndex(p)
    writeStoredBookPage(p)
  }, [pageCount])

  const onIndexSpread =
    pageIndex === INDEX_BOOK_PAGE || pageIndex === INDEX_BOOK_PAGE + 1

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
          startPage={initialStartPage}
          startZIndex={0}
          autoSize
          maxShadowOpacity={0.55}
          showCover
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
        <button
          type="button"
          className="controls__icon-btn"
          onClick={goToClosedCover}
          disabled={pageIndex === 0}
          aria-label="Retour à la couverture"
          title="Retour à la couverture"
        >
          <BookClosedIcon {...CONTROL_ICON_PROPS} />
        </button>
        <button
          type="button"
          className="controls__icon-btn"
          onClick={goToIndexSpread}
          disabled={onIndexSpread}
          aria-label="Index et recherche"
          title="Index et recherche"
        >
          <BookOpen {...CONTROL_ICON_PROPS} />
        </button>
        <button
          type="button"
          className="controls__icon-btn"
          onClick={flipPrev}
          disabled={!canPrev}
          aria-label="Page précédente"
          title="Page précédente"
        >
          <ChevronLeft {...CONTROL_ICON_PROPS} />
        </button>
        <button
          type="button"
          className="controls__icon-btn"
          onClick={flipNext}
          disabled={!canNext}
          aria-label="Page suivante"
          title="Page suivante"
        >
          <ChevronRight {...CONTROL_ICON_PROPS} />
        </button>
        <button
          type="button"
          className="controls__icon-btn"
          onClick={goToBackCover}
          disabled={pageIndex === getBackCoverBookPage(pageCount)}
          aria-label="Quatrième de couverture"
          title="Quatrième de couverture"
        >
          <span className="controls__icon-flip-x" aria-hidden>
            <BookClosedIcon {...CONTROL_ICON_PROPS} />
          </span>
        </button>
      </div>
    </div>
  )
}
