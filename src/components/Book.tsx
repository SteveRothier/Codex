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

/** Navigation avec animation de feuilletage (comme les coins / précédent–suivant). */
function flipBookToPage(pf: PageFlip | undefined, page: number): void {
  if (!pf) return
  if (pf.getCurrentPageIndex() === page) return
  pf.flip(page, 'top')
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
    flipBookToPage(bookRef.current?.pageFlip(), page)
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

  const flipPrev = useCallback(() => {
    bookRef.current?.pageFlip()?.flipPrev()
  }, [])

  const flipNext = useCallback(() => {
    bookRef.current?.pageFlip()?.flipNext()
  }, [])

  const goToClosedCover = useCallback(() => {
    flipBookToPage(bookRef.current?.pageFlip(), 0)
  }, [])

  const goToIndexSpread = useCallback(() => {
    flipBookToPage(bookRef.current?.pageFlip(), INDEX_BOOK_PAGE)
  }, [])

  const goToBackCover = useCallback(() => {
    flipBookToPage(
      bookRef.current?.pageFlip(),
      getBackCoverBookPage(pageCount),
    )
  }, [pageCount])

  const onIndexSpread =
    pageIndex === INDEX_BOOK_PAGE || pageIndex === INDEX_BOOK_PAGE + 1

  useEffect(() => {
    const lastPage = getBackCoverBookPage(pageCount)

    const onKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return

      if (e.key === 'ArrowLeft') {
        if (!canPrev) return
        e.preventDefault()
        flipPrev()
        return
      }
      if (e.key === 'ArrowRight') {
        if (!canNext) return
        e.preventDefault()
        flipNext()
        return
      }
      if (e.key === 'Home') {
        if (pageIndex === 0) return
        e.preventDefault()
        goToClosedCover()
        return
      }
      if (e.key === 'End') {
        if (pageIndex === lastPage) return
        e.preventDefault()
        goToBackCover()
        return
      }
      if (e.key === 'i' || e.key === 'I') {
        if (onIndexSpread) return
        e.preventDefault()
        goToIndexSpread()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    canPrev,
    canNext,
    pageIndex,
    pageCount,
    onIndexSpread,
    flipPrev,
    flipNext,
    goToClosedCover,
    goToBackCover,
    goToIndexSpread,
  ])

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
        <span
          className="controls__tip-host"
          data-tooltip="Retour à la couverture · Début"
        >
          <button
            type="button"
            className="controls__icon-btn"
            onClick={goToClosedCover}
            disabled={pageIndex === 0}
            aria-label="Retour à la couverture, raccourci touche Début"
          >
            <BookClosedIcon {...CONTROL_ICON_PROPS} />
          </button>
        </span>
        <span
          className="controls__tip-host"
          data-tooltip="Index et recherche · I"
        >
          <button
            type="button"
            className="controls__icon-btn"
            onClick={goToIndexSpread}
            disabled={onIndexSpread}
            aria-label="Index et recherche, raccourci touche I"
          >
            <BookOpen {...CONTROL_ICON_PROPS} />
          </button>
        </span>
        <span
          className="controls__tip-host"
          data-tooltip="Page précédente · flèche gauche"
        >
          <button
            type="button"
            className="controls__icon-btn controls__icon-btn--page"
            onClick={flipPrev}
            disabled={!canPrev}
            aria-label="Page précédente, raccourci flèche gauche"
          >
            <ChevronLeft {...CONTROL_ICON_PROPS} />
          </button>
        </span>
        <span
          className="controls__tip-host"
          data-tooltip="Page suivante · flèche droite"
        >
          <button
            type="button"
            className="controls__icon-btn controls__icon-btn--page"
            onClick={flipNext}
            disabled={!canNext}
            aria-label="Page suivante, raccourci flèche droite"
          >
            <ChevronRight {...CONTROL_ICON_PROPS} />
          </button>
        </span>
        <span
          className="controls__tip-host"
          data-tooltip="Quatrième de couverture · Fin"
        >
          <button
            type="button"
            className="controls__icon-btn"
            onClick={goToBackCover}
            disabled={pageIndex === getBackCoverBookPage(pageCount)}
            aria-label="Quatrième de couverture, raccourci touche Fin"
          >
            <span className="controls__icon-flip-x" aria-hidden>
              <BookClosedIcon {...CONTROL_ICON_PROPS} />
            </span>
          </button>
        </span>
      </div>
    </div>
  )
}
