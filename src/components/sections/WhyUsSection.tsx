'use client'

import React, { useRef, useEffect, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/animations'
import styles from './WhyUsSection.module.css'

const FEATURES = [
  {
    num: '01',
    title: '99.9% Network Uptime',
    description: 'Redundant fiber backbone rings and proactive NOC monitoring ensure continuous internet availability without interruptions.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Ultra-Low Latency',
    description: 'Direct peering with major cloud providers, CDN networks, and gaming servers for instantaneous response times and zero lag.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    num: '03',
    title: '24/7 Local Support',
    description: 'No endless IVR loops. Direct access to our dedicated local technical team ready to assist you over phone, WhatsApp, or on-site.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Dual-Band Wi-Fi 6 Routers',
    description: 'Every plan comes paired with next-generation gigabit routers engineered to deliver seamless coverage throughout your home or office.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Symmetric Speeds',
    description: 'Enjoy equal download and upload speeds — essential for seamless 4K video conferencing, large file backups, and live streaming.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Zero Hidden FUP',
    description: 'Truly unlimited high-speed broadband with transparent pricing and zero mid-month speed throttling. What you see is what you get.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
]

export default function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const imageWrapperRef = useRef<HTMLDivElement>(null)
  const [activeMobileIndex, setActiveMobileIndex] = useState(0)

  // Handle mobile scroll tracking for pagination dots
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

    // ── DESKTOP (≥ 900px): Full Pinned Horizontal Scroll & Playful Choreography ──
    mm.add('(min-width: 900px)', () => {
      const getScrollDistance = () => {
        const viewportWidth = track.parentElement?.clientWidth || window.innerWidth
        return Math.max(0, track.scrollWidth - viewportWidth)
      }

      // 1. Master horizontal translation tween (starts when section arrives at top of viewport)
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

      // 3. Custom playful GSAP entrances on desktop
      if (cards[0]) {
        gsap.set(cards[0], { opacity: 1, y: 0, x: 0, rotationZ: 0, scale: 1 })
      }

      // Card 02 (Ultra-Low Latency ⚡)
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

      // Card 03 (24/7 Support 📞)
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

      // Card 04 (Wi-Fi 6 📡)
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

      // Card 05 (Symmetric Speeds ⇅)
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

      // Card 06 (Zero FUP 🛡️)
      if (cards[5] && cards[4]) {
        gsap.fromTo(
          cards[5],
          { opacity: 0, rotationY: 40, y: 70, scale: 0.82, transformPerspective: 800 },
          {
            opacity: 1,
            rotationY: 0,
            y: 0,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: cards[4],
              containerAnimation: horizontalTween,
              start: 'center 60%',
              end: 'center 42%',
              scrub: 0.4,
            },
          }
        )
      }

      // Ensure all pin spacers and measurements are registered globally
      ScrollTrigger.refresh()
      window.dispatchEvent(new CustomEvent('layout-pinned'))

      return () => {
        horizontalTween.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.section} aria-labelledby="why-us-title">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className="badge badge-primary">THE JDAIRNET ADVANTAGE</span>
          </div>
          <h2 id="why-us-title" className={styles.title}>
            Why Choose Us
          </h2>
          <p className={styles.subtitle}>
            Engineered for ultra-fast, uninterrupted connectivity with enterprise-grade infrastructure tailored for residential and business users.
          </p>
        </div>

        {/* Mobile Visual (Visible < 900px) */}
        <div className={styles.mobileVisual} aria-hidden="true">
          <img
            src="/Why_choose_us-removebg-preview.png"
            alt=""
            className={styles.mobileImage}
            loading="lazy"
          />
        </div>

        {/* Horizontal Track Viewport */}
        <div className={styles.trackViewport}>
          {/* Desktop Left Feature Image Visual (≥ 900px) */}
          <div ref={imageWrapperRef} className={styles.featureImageWrapper} aria-hidden="true">
            <img
              src="/Why_choose_us-removebg-preview.png"
              alt=""
              className={styles.featureImage}
              loading="lazy"
            />
          </div>

          <div
            ref={trackRef}
            className={styles.track}
            onScroll={handleMobileScroll}
          >
            {FEATURES.map((feature, idx) => (
              <div key={idx} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper} aria-hidden="true">
                    {feature.icon}
                  </div>
                  <span className={styles.cardNum}>{feature.num}</span>
                </div>
                <h3 className={styles.cardTitle}>{feature.title}</h3>
                <p className={styles.cardText}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Swipe Pagination Dots (< 900px) */}
        <div className={styles.mobilePagination} aria-hidden="true">
          {FEATURES.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`${styles.dot} ${i === activeMobileIndex ? styles.dotActive : ''}`}
              onClick={() => scrollToMobileCard(i)}
              aria-label={`Go to feature ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

