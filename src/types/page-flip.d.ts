declare module 'page-flip' {
  export type FlipCorner = 'top' | 'bottom'

  export class PageFlip {
    flipNext(corner?: FlipCorner): void
    flipPrev(corner?: FlipCorner): void
    getCurrentPageIndex(): number
    getPageCount(): number
    destroy(): void
  }
}
