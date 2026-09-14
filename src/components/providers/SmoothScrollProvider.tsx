'use client'

import React, { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/animations'

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

/**
 * Returns the scroll-Y position to reach `targetEl`, with a header offset.
 *
 * Uses getBoundingClientRect() which reads the element's *actual rendered*
 * position in the viewport — this already accounts for every GSAP pin spacer
 * and layout shift once called after a full paint cycle.
 */
function getScrollTarget(targetEl: HTMLElement, headerOffset = 80): number {
  const rect = targetEl.getBoundingClientRect()
  return Math.max(0, rect.top + window.scrollY - headerOffset)
}

export default function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Stores a hash (e.g. "#faq") that should be scrolled to once the home page
  // finishes mounting after a cross-page navigation.
  const pendingHashRef = useRef<string>('')

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return
    }

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenisRef.current = lenis

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    // Handle smooth anchor navigation (e.g. #faq or /#faq)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      if (!href) return

      let hash = ''
      if (href.startsWith('#') && href.length > 1) {
        // Pure hash link on the same page (e.g. href="#faq")
        hash = href
      } else if (href.startsWith('/#') && href.length > 2) {
        // Root-relative hash link (e.g. href="/#faq")
        hash = href.slice(1) // "#faq"
      }

      if (!hash) return

      const targetEl = document.querySelector(hash) as HTMLElement | null

      if (targetEl) {
        // Target is on the current page — smooth scroll directly.
        e.preventDefault()
        window.history.pushState(null, '', hash)
        const scrollY = getScrollTarget(targetEl, 80)
        lenis.scrollTo(scrollY, { duration: 1.2 })
      } else {
        // Target is on a different page (cross-page navigation).
        // Two-step: navigate to "/" cleanly (no hash, scroll resets to top),
        // then the pathname useEffect will read pendingHashRef and scroll
        // to the section once WhyUs has finished pinning.
        e.preventDefault()
        pendingHashRef.current = hash
        router.push('/')
      }
    }

    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash && hash.length > 1) {
        const targetEl = document.querySelector(hash) as HTMLElement | null
        if (targetEl) {
          const scrollY = getScrollTarget(targetEl, 80)
          lenis.scrollTo(scrollY, { duration: 1.2 })
        }
      }
    }

    document.addEventListener('click', handleAnchorClick)
    window.addEventListener('hashchange', handleHashChange)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      window.removeEventListener('hashchange', handleHashChange)
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
      lenisRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Handle scrolling to a hash section after navigation and on mount.
  // Source of the hash (in priority order):
  //   1. pendingHashRef — set by handleAnchorClick for cross-page /#hash links
  //   2. window.location.hash — set when the page loads with a hash in the URL
  useEffect(() => {
    if (typeof window === 'undefined') return

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // Prefer the pending hash (cross-page intent) over the URL hash.
    const isPending = !!pendingHashRef.current
    const hash = pendingHashRef.current || window.location.hash
    if (!hash || hash.length <= 1) return

    // Consume the pending hash so it doesn't re-trigger on the next pathname change.
    pendingHashRef.current = ''

    if (isPending) {
      // ── Cross-page navigation ────────────────────────────────────────────
      // We navigated to '/' with no hash (router.push('/')), so:
      //   • window.scrollY is cleanly 0
      //   • the browser never attempted a native anchor jump
      //
      // We simply wait 600ms — by then every React effect has run, GSAP has
      // created its ScrollTrigger with the correct track.scrollWidth, CSS layout
      // is fully settled, and the pin spacer has the right height.
      // Then we force a final ScrollTrigger.refresh() and scroll.
      const timer = setTimeout(() => {
        const targetEl = document.querySelector(hash) as HTMLElement | null
        if (!targetEl) return
        // Re-evaluate dynamic `end` callbacks (e.g. track.scrollWidth)
        // so the pin spacer reflects the real rendered dimensions.
        ScrollTrigger.refresh()
        // One rAF so the browser commits the refreshed pin spacer to layout
        // before we read getBoundingClientRect().
        requestAnimationFrame(() => {
          const scrollY = getScrollTarget(targetEl, 80)
          // Update URL to /#faq now that we know we're heading there.
          window.history.replaceState(null, '', hash)
          if (lenisRef.current) {
            lenisRef.current.scrollTo(scrollY, { duration: 1.2 })
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' })
          }
        })
      }, 600)

      return () => clearTimeout(timer)
    }

    // ── Direct URL hash navigation (e.g. user opens /#faq in a new tab) ──
    // Use the layout-pinned event + polling so we don't wait an arbitrary
    // delay when the user lands directly on the home page with a hash.
    let isDone = false

    const doScroll = (targetEl: HTMLElement) => {
      isDone = true
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        requestAnimationFrame(() => {
          const scrollY = getScrollTarget(targetEl, 80)
          if (lenisRef.current) {
            lenisRef.current.scrollTo(scrollY, { duration: 1.2 })
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' })
          }
        })
      })
    }

    const attemptScroll = () => {
      if (isDone) return
      const targetEl = document.querySelector(hash) as HTMLElement | null
      if (!targetEl) return

      // If WhyUs exists but its pinned ScrollTrigger hasn't been created yet,
      // wait — the pin spacer isn't in the DOM and the layout is wrong.
      const whyUsSection = document.querySelector('section[aria-labelledby="why-us-title"]')
      const hasPinnedTrigger = ScrollTrigger.getAll().some((st) => st.pin)
      if (whyUsSection && !hasPinnedTrigger) return

      doScroll(targetEl)
    }

    const onLayoutPinned = () => attemptScroll()
    window.addEventListener('layout-pinned', onLayoutPinned, { once: true })

    // Poll every 50ms as a fallback (in case layout-pinned already fired).
    const interval = setInterval(() => {
      if (isDone) clearInterval(interval)
      else attemptScroll()
    }, 50)

    // Hard deadline: scroll regardless after 800ms.
    const fallbackTimer = setTimeout(() => {
      clearInterval(interval)
      if (!isDone) attemptScroll()
    }, 800)

    return () => {
      window.removeEventListener('layout-pinned', onLayoutPinned)
      clearInterval(interval)
      clearTimeout(fallbackTimer)
    }
  }, [pathname])

  return <>{children}</>
}
