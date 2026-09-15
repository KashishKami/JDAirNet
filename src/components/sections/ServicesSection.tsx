'use client'

import React, { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { gsap, ScrollTrigger } from '@/lib/animations'
import { SERVICES_DATA } from '@/data/services'
import styles from './ServicesSection.module.css'

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const [activeMobileIndex, setActiveMobileIndex] = useState(0)

  // Mobile scroll tracking for pagination dots
  const handleMobileScroll = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 900) return
    const track = trackRef.current
    if (!track) return

    const scrollLeft = track.scrollLeft
    const cards = track.querySelectorAll<HTMLElement>(`.${styles.card}`)
    if (cards.length === 0) return

    let closestIndex = 0
    let minDistance = Infinity
    const trackCenter = scrollLeft + track.clientWidth / 2

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2
      const distance = Math.abs(trackCenter - cardCenter)
      if (distance < minDistance) {
        minDistance = distance
        closestIndex = index
      }
    })

    setActiveMobileIndex(closestIndex)
  }

  const scrollToMobileCard = (index: number) => {
    const track = trackRef.current
    if (!track) return
    const cards = track.querySelectorAll<HTMLElement>(`.${styles.card}`)
    const targetCard = cards[index]
    if (targetCard) {
      const targetScroll = targetCard.offsetLeft - (track.clientWidth - targetCard.clientWidth) / 2
      track.scrollTo({
        left: Math.max(0, targetScroll),
        behavior: 'smooth',
      })
      setActiveMobileIndex(index)
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (process.env.NODE_ENV === 'test') return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const mm = gsap.matchMedia()

    // ── Desktop (≥ 900px): Full Pinned Horizontal Scroll & Playful Choreography ──
    mm.add('(min-width: 900px)', () => {
      const getScrollDistance = () => {
        const viewportWidth = track.parentElement?.clientWidth || window.innerWidth
        return Math.max(0, track.scrollWidth - viewportWidth)
      }

      // 1. Master horizontal translation tween
      const horizontalTween = gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: () => `+=${getScrollDistance() + 200}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      const cards = track.querySelectorAll<HTMLElement>(`.${styles.card}`)

      // 2. Left visual image stays 100% visible until Card 01 actually reaches it
      if (imageWrapperRef.current && cards[0]) {
        gsap.fromTo(
          imageWrapperRef.current,
          { opacity: 1, x: 0, scale: 1 },
          {
            opacity: 0,
            x: -100,
            scale: 0.92,
            ease: 'power1.in',
            scrollTrigger: {
              trigger: cards[0],
              containerAnimation: horizontalTween,
              start: () => {
                const imgRight = imageWrapperRef.current?.getBoundingClientRect().right || 480
                return `left ${imgRight + 30}px`
              },
              end: () => {
                const imgWidth = imageWrapperRef.current?.offsetWidth || 480
                return `left ${imgWidth * 0.35}px`
              },
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          }
        )
      }

      // 3. Exact custom playful GSAP entrances on desktop
      if (cards[0]) {
        gsap.set(cards[0], { opacity: 1, y: 0, x: 0, rotationZ: 0, scale: 1 })
      }

      // Card 02 (Internet Leased Line) — Drops in with elastic top bounce
      if (cards[1] && cards[0]) {
        gsap.fromTo(
          cards[1],
          { opacity: 0, y: -130, rotationZ: 7, scale: 0.82 },
          {
            opacity: 1,
            y: 0,
            rotationZ: 0,
            scale: 1,
            ease: 'back.out(1.6)',
            scrollTrigger: {
              trigger: cards[0],
              containerAnimation: horizontalTween,
              start: 'center 60%',
              end: 'center 42%',
              scrub: 0.4,
            },
          }
        )
      }

      // Card 03 (Managed Leased Line) — Rises from bottom-right with tilt
      if (cards[2] && cards[1]) {
        gsap.fromTo(
          cards[2],
          { opacity: 0, y: 120, x: 50, rotationZ: -8, scale: 0.85 },
          {
            opacity: 1,
            y: 0,
            x: 0,
            rotationZ: 0,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cards[1],
              containerAnimation: horizontalTween,
              start: 'center 60%',
              end: 'center 42%',
              scrub: 0.4,
            },
          }
        )
      }

      // Card 04 (Business Internet) — Elastic pop with de-blurring focus
      if (cards[3] && cards[2]) {
        gsap.fromTo(
          cards[3],
          { opacity: 0, scale: 0.55, rotationZ: 4, filter: 'blur(8px)' },
          {
            opacity: 1,
            scale: 1,
            rotationZ: 0,
            filter: 'blur(0px)',
            ease: 'back.out(1.8)',
            scrollTrigger: {
              trigger: cards[2],
              containerAnimation: horizontalTween,
              start: 'center 60%',
              end: 'center 42%',
              scrub: 0.4,
            },
          }
        )
      }

      // Card 05 (Managed Wi-Fi Solution) — Swift overshoot slide-in from right
      if (cards[4] && cards[3]) {
        gsap.fromTo(
          cards[4],
          { opacity: 0, x: 180, y: -35, rotationZ: -6, scale: 0.86 },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotationZ: 0,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cards[3],
              containerAnimation: horizontalTween,
              start: 'center 60%',
              end: 'center 42%',
              scrub: 0.4,
            },
          }
        )
      }

      ScrollTrigger.refresh()
      window.dispatchEvent(new CustomEvent('layout-pinned'))

      return () => {
        horizontalTween.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      aria-labelledby="services-title"
      role="region"
      aria-label="Our Services & Solutions"
    >
      <div className="container">
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className="badge badge-primary">COMPREHENSIVE CONNECTIVITY</span>
          </div>
          <h2 id="services-title" className={styles.title}>
            Our Services & Solutions
          </h2>
          <p className={styles.subtitle}>
            From high-speed residential fiber to dedicated enterprise leased lines and campus Wi-Fi, explore connectivity built for unmatched reliability.
          </p>
        </div>

        {/* Mobile Visual (< 900px) */}
        <div className={styles.mobileVisual} aria-hidden="true">
          <img
            src="/Why_choose_us-removebg-preview.webp"
            alt=""
            className={styles.mobileImage}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Horizontal Track Viewport */}
        <div className={styles.trackViewport}>
          {/* Desktop Left Feature Image (≥ 900px) */}
          <div ref={imageWrapperRef} className={styles.featureImageWrapper} aria-hidden="true">
            <img
              src="/Why_choose_us-removebg-preview.webp"
              alt=""
              className={styles.featureImage}
              loading="eager"
              decoding="async"
            />
          </div>

          <div
            ref={trackRef}
            className={styles.track}
            onScroll={handleMobileScroll}
          >
            {SERVICES_DATA.map((service) => (
              <div key={service.id} className={styles.card}>
                <div>
                  <div className={styles.cardTop}>
                    <div className={styles.iconWrapper} aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        {service.category === 'residential' ? (
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        ) : (
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                        )}
                      </svg>
                    </div>
                    {service.badge && <span className={styles.badge}>{service.badge}</span>}
                  </div>

                  <h3 className={styles.cardTitle}>{service.title}</h3>
                  <p className={styles.tagline}>{service.tagline}</p>
                  <p className={styles.cardDesc}>{service.description}</p>
                </div>

                <Link
                  href={service.ctaHref}
                  className={`${styles.ctaBtn} ${service.category === 'enterprise' ? styles.ctaBtnSecondary : ''}`}
                >
                  {service.ctaLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Swipe Pagination Dots (< 900px) */}
        <div className={styles.mobilePagination} aria-hidden="true">
          {SERVICES_DATA.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === activeMobileIndex ? styles.dotActive : ''}`}
              onClick={() => scrollToMobileCard(i)}
              aria-label={`Go to service ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
