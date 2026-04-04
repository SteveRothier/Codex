import { useEffect, useState } from 'react'

export function useFlipBookSize() {
  const [dims, setDims] = useState({ pageWidth: 340, pageHeight: 440 })

  useEffect(() => {
    function measure() {
      const vw = window.innerWidth
      const maxOpen = Math.min(900, vw - 48)
      const pw = Math.floor(maxOpen / 2) - 8
      const ph = Math.min(520, Math.round(pw * 1.28))
      setDims({
        pageWidth: Math.max(240, pw),
        pageHeight: Math.max(300, ph),
      })
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return dims
}
