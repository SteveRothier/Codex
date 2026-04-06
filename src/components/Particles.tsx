import {
  useEffect,
  useMemo,
  useRef,
  type ComponentPropsWithoutRef,
} from 'react'
import { cn } from '../lib/cn'

export type ParticlesProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children'
> & {
  quantity?: number
  staticity?: number
  ease?: number
  size?: number
  refresh?: boolean
  color?: string
  vx?: number
  vy?: number
}

function hexToRgb(hex: string): [number, number, number] {
  let h = hex.replace('#', '')
  if (h.length === 3) {
    h = h
      .split('')
      .map((c) => c + c)
      .join('')
  }
  const n = parseInt(h, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

type Circle = {
  x: number
  y: number
  translateX: number
  translateY: number
  size: number
  alpha: number
  targetAlpha: number
  dx: number
  dy: number
  magnetism: number
}

function remapValue(
  value: number,
  start1: number,
  end1: number,
  start2: number,
  end2: number,
): number {
  const remapped =
    ((value - start1) * (end2 - start2)) / (end1 - start1) + start2
  return remapped > 0 ? remapped : 0
}

/**
 * Fond particules canvas (équivalent shadcn.io Particles / Magic UI : dérive,
 * réaction au curseur, fondu aux bords). Voir https://www.shadcn.io/background/particles
 */
export function Particles({
  className,
  quantity = 100,
  staticity = 50,
  ease = 50,
  size = 0.4,
  refresh = false,
  color = '#c9a227',
  vx = 0,
  vy = 0,
  ...props
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const circlesRef = useRef<Circle[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const sizeRef = useRef({ w: 0, h: 0 })
  const rafRef = useRef<number | null>(null)
  const resizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const rgb = useMemo(() => hexToRgb(color), [color])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctxRef.current = ctx

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2)

    const onMove = (e: MouseEvent) => {
      const c = canvasRef.current
      if (!c) return
      const { w, h } = sizeRef.current
      const rect = c.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left - w / 2,
        y: e.clientY - rect.top - h / 2,
      }
    }
    window.addEventListener('mousemove', onMove)

    const circleParams = (): Circle => {
      const { w, h } = sizeRef.current
      const baseSize = size
      return {
        x: Math.floor(Math.random() * w),
        y: Math.floor(Math.random() * h),
        translateX: 0,
        translateY: 0,
        size: Math.floor(Math.random() * 2) + baseSize,
        alpha: 0,
        targetAlpha: parseFloat((Math.random() * 0.5 + 0.08).toFixed(2)),
        dx: (Math.random() - 0.5) * 0.12,
        dy: (Math.random() - 0.5) * 0.12,
        magnetism: 0.15 + Math.random() * 3.5,
      }
    }

    const drawCircle = (circle: Circle) => {
      const c = ctxRef.current
      if (!c) return
      const { x, y, translateX, translateY, size: r, alpha } = circle
      const [r0, g0, b0] = rgb
      c.save()
      c.translate(translateX, translateY)
      c.beginPath()
      c.arc(x, y, r, 0, Math.PI * 2)
      c.fillStyle = `rgba(${r0},${g0},${b0},${alpha})`
      c.fill()
      c.restore()
    }

    const clear = () => {
      const c = ctxRef.current
      const { w, h } = sizeRef.current
      if (!c) return
      c.setTransform(1, 0, 0, 1, 0, 0)
      c.clearRect(0, 0, w * dpr, h * dpr)
      c.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const resize = () => {
      const c = canvasRef.current
      const box = containerRef.current
      const context = ctxRef.current
      if (!c || !box || !context) return

      const w = box.offsetWidth
      const h = box.offsetHeight
      sizeRef.current = { w, h }
      c.width = w * dpr
      c.height = h * dpr
      c.style.width = `${w}px`
      c.style.height = `${h}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      circlesRef.current = []
      const q = quantity
      for (let i = 0; i < q; i++) {
        circlesRef.current.push(circleParams())
      }
    }

    const animate = () => {
      const { w, h } = sizeRef.current
      const st = staticity
      const es = ease
      const pvx = vx
      const pvy = vy
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      clear()

      const list = circlesRef.current
      for (let i = list.length - 1; i >= 0; i--) {
        const circle = list[i]!
        const edge = [
          circle.x + circle.translateX - circle.size,
          w - circle.x - circle.translateX - circle.size,
          circle.y + circle.translateY - circle.size,
          h - circle.y - circle.translateY - circle.size,
        ]
        const closest = Math.min(...edge)
        const fade = parseFloat(remapValue(closest, 0, 20, 0, 1).toFixed(2))
        if (fade > 1) {
          circle.alpha += 0.02
          if (circle.alpha > circle.targetAlpha) {
            circle.alpha = circle.targetAlpha
          }
        } else {
          circle.alpha = circle.targetAlpha * fade
        }

        circle.x += circle.dx + pvx
        circle.y += circle.dy + pvy
        const mag = circle.magnetism
        circle.translateX += (mx / (st / mag) - circle.translateX) / es
        circle.translateY += (my / (st / mag) - circle.translateY) / es

        drawCircle(circle)

        if (
          circle.x < -circle.size ||
          circle.x > w + circle.size ||
          circle.y < -circle.size ||
          circle.y > h + circle.size
        ) {
          list.splice(i, 1)
          list.push(circleParams())
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    const scheduleResize = () => {
      if (resizeTimerRef.current) clearTimeout(resizeTimerRef.current)
      resizeTimerRef.current = setTimeout(() => {
        resize()
      }, 150)
    }

    resize()
    rafRef.current = requestAnimationFrame(animate)
    window.addEventListener('resize', scheduleResize)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', scheduleResize)
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current)
        resizeTimerRef.current = null
      }
    }
  }, [color, quantity, refresh, size, staticity, ease, vx, vy, rgb])

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none', className)}
      aria-hidden
      {...props}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  )
}
