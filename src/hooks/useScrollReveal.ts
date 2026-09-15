'use client'

import { useEffect, type RefObject } from 'react'
import { gsap } from '@/lib/animations'

export interface ScrollRevealOptions {
  selector?: string
  y?: number
  scale?: number
  duration?: number
  stagger?: number
  start?: string
  ease?: string
  enabled?: boolean
}

export function useScrollReveal(
  containerRef: RefObject<HTMLElement | null>,
  options: ScrollRevealOptions = {}
) {
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    if (process.env.NODE_ENV === 'test' && options.enabled !== true) return



    const {
      selector,
      y = 16,
      scale = 0.98,
      duration = 0.5,
      stagger = 0.08,
      start = 'top 95%',
      ease = 'power2.out',
    } = options

    const ctx = gsap.context(() => {
      const targets = selector
        ? containerRef.current!.querySelectorAll(selector)
        : containerRef.current

      if (!targets || (targets instanceof NodeList && targets.length === 0)) return

      gsap.fromTo(
        targets,
        {
          opacity: 0,
          y,
          scale,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration,
          stagger,
          ease,
          scrollTrigger: {
            trigger: containerRef.current,
            start,
            once: true,
          },
        }
      )
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [containerRef, options])
}
