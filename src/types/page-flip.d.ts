declare module 'page-flip' {
  export type FlipCorner = 'top' | 'bottom'

  export class PageFlip {
    flip(pageNum: number, corner?: FlipCorner): void
    flipNext(corner?: FlipCorner): void
    flipPrev(corner?: FlipCorner): void
    getCurrentPageIndex(): number
    getPageCount(): number
    destroy(): void
  }
}
