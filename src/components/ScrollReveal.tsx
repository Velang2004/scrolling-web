import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  text: string
  className?: string
  style?: CSSProperties
  baseRotation?: number
  baseOpacity?: number
  blurStrength?: string
  start?: string
  end?: string
  scrub?: number
}

export default function ScrollReveal({
  text,
  className = '',
  style,
  baseRotation = 12,
  baseOpacity = 0,
  blurStrength = '10px',
  start = 'top 85%',
  end = 'top 30%',
  scrub = 1.5,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const words = el.querySelectorAll<HTMLElement>('.sr-word')
    if (!words.length) return

    // Set initial state
    gsap.set(words, {
      rotationX: baseRotation,
      opacity: baseOpacity,
      filter: `blur(${blurStrength})`,
      y: 20,
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub,
      },
    })

    // Three layered animations: rotation, opacity+blur, y-position
    tl.to(
      words,
      {
        rotationX: 0,
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
        stagger: 0.05,
        ease: 'none',
      },
      0
    )

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [text, baseRotation, baseOpacity, blurStrength, start, end, scrub])

  const words = text.split(' ')

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ perspective: '800px', ...style }}
    >
      {words.map((word, i) => (
        <span
          key={i}
          className="sr-word inline-block"
          style={{
            marginRight: '0.3em',
            display: 'inline-block',
            transformOrigin: 'bottom center',
          }}
        >
          {word}
        </span>
      ))}
    </div>
  )
}
