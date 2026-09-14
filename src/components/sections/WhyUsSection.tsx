'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import styles from './WhyUsSection.module.css'

interface FeatureCard {
  id: string
  num: string
  title: string
  value: string
  tagline: string
  description: string
  colorClass: string
  icon: (size?: number) => React.ReactNode
}

const WHY_US_CARDS: FeatureCard[] = [
  {
    id: 'uptime',
    num: '01',
    title: '99.9% Network Uptime',
    value: '99.9% SLA Guaranteed',
    tagline: 'Dual-Path Redundant Fiber Ring',
    description:
      'Redundant optical fiber backbone rings and automated NOC failover ensure your connection stays continuous and uninterrupted 24/7.',
    colorClass: styles.bgBurgundy,
    icon: (size = 28) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    id: 'latency',
    num: '02',
    title: 'Ultra-Low Latency',
    value: '< 15ms Response Time',
    tagline: 'Direct Cloud & CDN Peering',
    description:
      'Direct interconnects with major cloud platforms (AWS, Google, Microsoft), CDNs, and gaming servers for instantaneous response times and zero jitter.',
    colorClass: styles.bgIndigo,
    icon: (size = 28) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    id: 'support',
    num: '03',
    title: '24/7 Local Support',
    value: 'Zero IVR Bot Loops',
    tagline: 'On-Ground Dedicated Support Team',
    description:
      'No endless automated phone trees. Connect directly with our on-ground technical engineering team available via phone, WhatsApp, or on-site dispatch.',
    colorClass: styles.bgSlate,
    icon: (size = 28) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    id: 'router',
    num: '04',
    title: 'Dual-Band Wi-Fi 6 Routers',
    value: 'Gigabit Hardware Included',
    tagline: 'Next-Gen Multi-Device Coverage',
    description:
      'Every high-speed plan includes next-generation gigabit Wi-Fi 6 routers engineered to deliver full-speed wireless coverage throughout your entire premises.',
    colorClass: styles.bgNavy,
    icon: (size = 28) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
      </svg>
    ),
  },
  {
    id: 'symmetric',
    num: '05',
    title: 'Symmetric Speeds',
    value: '1:1 Equal Speeds',
    tagline: 'Equal Upload & Download',
    description:
      'Experience identical download and upload speeds across all tiers—essential for seamless 4K video conferencing, large cloud backups, and content creation.',
    colorClass: styles.bgEmerald,
    icon: (size = 28) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    ),
  },
  {
    id: 'fup',
    num: '06',
    title: 'Zero Hidden FUP',
    value: 'Truly Unlimited',
    tagline: 'No Speed Throttling',
    description:
      'Truly unlimited high-speed fiber broadband with transparent pricing and zero mid-cycle speed throttling. Download, stream, and work without restrictions.',
    colorClass: styles.bgCharcoal,
    icon: (size = 28) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
]

export default function WhyUsSection() {
  // 6-card full grid is the default initial view
  const [isSpotlight, setIsSpotlight] = useState<boolean>(false)
  const [topCard, setTopCard] = useState<FeatureCard>(WHY_US_CARDS[0])
  const [bottomCards, setBottomCards] = useState<FeatureCard[]>(WHY_US_CARDS.slice(1))
  const topCardRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const isAnimating = useRef(false)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  // Zero-Snap, True-Geometry Morphing Flight
  const handleSwap = (slotIndex: number, cardEl: HTMLElement) => {
    if (isAnimating.current || !topCardRef.current || !cardEl) return
    isAnimating.current = true

    const clickedCard = bottomCards[slotIndex]
    if (!clickedCard) return

    const currentTop = topCard
    const fromRect = cardEl.getBoundingClientRect()
    const topRect = topCardRef.current.getBoundingClientRect()

    // 1. Update React state underneath so destination elements are pre-rendered
    setTopCard(clickedCard)
    setBottomCards((prev) => {
      const updated = [...prev]
      updated[slotIndex] = currentTop
      return updated
    })

    cardEl.style.opacity = '0'
    topCardRef.current.style.opacity = '0'

    // 2. Clone Rising (Starts as small card -> morphs into big spotlight card)
    const cloneRising = document.createElement('div')
    cloneRising.className = `${styles.expandedCard} ${clickedCard.colorClass}`
    cloneRising.style.position = 'fixed'
    cloneRising.style.left = `${fromRect.left}px`
    cloneRising.style.top = `${fromRect.top}px`
    cloneRising.style.width = `${fromRect.width}px`
    cloneRising.style.height = `${fromRect.height}px`
    cloneRising.style.zIndex = '9999'
    cloneRising.style.pointerEvents = 'none'
    cloneRising.style.borderRadius = '24px'
    cloneRising.style.boxShadow = '0 20px 45px rgba(0,0,0,0.3)'
    cloneRising.style.padding = '1.25rem'
    cloneRising.style.overflow = 'hidden'
    cloneRising.style.boxSizing = 'border-box'
    cloneRising.innerHTML = `
      <div class="${styles.expandedTop}">
        <div class="${styles.expandedIconBox}" id="rising-icon-box" style="width:40px; height:40px; border-radius:12px;">
          ${cardEl.querySelector(`.${styles.gridIconBox}`)?.innerHTML || ''}
        </div>
        <span class="${styles.expandedBadge}" id="rising-badge" style="font-size:12px; padding:0.25rem 0.65rem; border-radius:9999px;">
          ${clickedCard.value}
        </span>
      </div>
      <div class="${styles.expandedBody}" id="rising-body" style="margin-top:0.65rem;">
        <h3 class="${styles.expandedTitle}" id="rising-title" style="font-size:1.1rem; line-height:1.25; margin-bottom:0.2rem;">
          ${clickedCard.title}
        </h3>
        <p class="${styles.expandedValue}" id="rising-tagline" style="font-size:0.88rem; margin-bottom:0.4rem;">
          ${clickedCard.tagline}
        </p>
        <p class="${styles.expandedDesc}" id="rising-desc" style="opacity:0; max-height:0; overflow:hidden; margin-bottom:0; font-size:0.95rem; line-height:1.55;">
          ${clickedCard.description}
        </p>
      </div>
      <div class="${styles.expandedFooter}" id="rising-footer" style="opacity:0; max-height:0; overflow:hidden; margin-top:0;">
        <span class="${styles.expandedCta}">Explore Plans →</span>
        <span class="${styles.resetBtn}">View All Cards</span>
      </div>
    `
    document.body.appendChild(cloneRising)

    // 3. Clone Descending (Starts as big card -> morphs into small card)
    const cloneDescending = document.createElement('div')
    cloneDescending.className = `${styles.gridCard} ${currentTop.colorClass}`
    cloneDescending.style.position = 'fixed'
    cloneDescending.style.left = `${topRect.left}px`
    cloneDescending.style.top = `${topRect.top}px`
    cloneDescending.style.width = `${topRect.width}px`
    cloneDescending.style.height = `${topRect.height}px`
    cloneDescending.style.zIndex = '9998'
    cloneDescending.style.pointerEvents = 'none'
    cloneDescending.style.borderRadius = '28px'
    cloneDescending.style.boxShadow = '0 20px 45px rgba(0,0,0,0.3)'
    cloneDescending.style.padding = 'clamp(1.75rem, 3.5vw, 2.25rem)'
    cloneDescending.style.overflow = 'hidden'
    cloneDescending.style.boxSizing = 'border-box'
    cloneDescending.innerHTML = `
      <div class="${styles.gridCardTop}" id="desc-top">
        <div class="${styles.expandedIconBox}" id="desc-icon-box" style="width:56px; height:56px; border-radius:16px;">
          ${topCardRef.current.querySelector(`.${styles.expandedIconBox}`)?.innerHTML || ''}
        </div>
        <div class="${styles.expandedBadge}" id="desc-badge" style="font-size:var(--font-small); padding:0.4rem 0.95rem;">
          ${currentTop.value}
        </div>
      </div>
      <div id="desc-body">
        <h3 class="${styles.gridCardTitle}" id="desc-title" style="font-size:clamp(1.4rem, 2.5vw, 1.95rem); margin-bottom:0.35rem; line-height:1.25;">
          ${currentTop.title}
        </h3>
        <p class="${styles.gridCardValue}" id="desc-tagline" style="font-size:clamp(1.05rem, 2vw, 1.25rem); margin-bottom:0.75rem;">
          ${currentTop.tagline}
        </p>
        <p class="${styles.expandedDesc}" id="desc-desc" style="opacity:1; max-height:140px; margin-bottom:1.25rem; font-size:0.98rem; line-height:1.6;">
          ${currentTop.description}
        </p>
      </div>
      <div class="${styles.expandedFooter}" id="desc-footer" style="opacity:1; max-height:60px; margin-top:0.5rem;">
        <span class="${styles.expandedCta}">Explore Plans →</span>
        <span class="${styles.resetBtn}">View All Cards</span>
      </div>
    `
    document.body.appendChild(cloneDescending)

    const risingDesc = cloneRising.querySelector('#rising-desc')
    const risingFooter = cloneRising.querySelector('#rising-footer')
    const risingTitle = cloneRising.querySelector('#rising-title')
    const risingTagline = cloneRising.querySelector('#rising-tagline')
    const risingIconBox = cloneRising.querySelector('#rising-icon-box')
    const risingBody = cloneRising.querySelector('#rising-body')

    const descDesc = cloneDescending.querySelector('#desc-desc')
    const descFooter = cloneDescending.querySelector('#desc-footer')
    const descTitle = cloneDescending.querySelector('#desc-title')
    const descTagline = cloneDescending.querySelector('#desc-tagline')
    const descIconBox = cloneDescending.querySelector('#desc-icon-box')
    const descBadge = cloneDescending.querySelector('#desc-badge')

    const duration = 0.65
    const ease = 'power3.out'

    // 4. Synchronized GSAP Flight Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        if (cardEl) cardEl.style.opacity = '1'
        if (topCardRef.current) topCardRef.current.style.opacity = '1'

        gsap.to([cloneRising, cloneDescending], {
          opacity: 0,
          duration: 0.04,
          onComplete: () => {
            cloneRising.remove()
            cloneDescending.remove()
            isAnimating.current = false
          },
        })
      },
    })

    // A) Rising Card: Expands up from fromRect to topRect
    tl.to(
      cloneRising,
      {
        left: topRect.left,
        top: topRect.top,
        width: topRect.width,
        height: topRect.height,
        borderRadius: 28,
        padding: 'clamp(1.75rem, 3.5vw, 2.25rem)',
        duration,
        ease,
      },
      0
    )
    if (risingIconBox) {
      tl.to(risingIconBox, { width: 56, height: 56, borderRadius: 16, duration, ease }, 0)
    }
    if (risingBody) {
      tl.to(risingBody, { marginTop: '1.25rem', duration, ease }, 0)
    }
    if (risingTitle) {
      tl.to(risingTitle, { fontSize: 'clamp(1.4rem, 2.5vw, 1.95rem)', marginBottom: '0.35rem', duration, ease }, 0)
    }
    if (risingTagline) {
      tl.to(risingTagline, { fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', marginBottom: '0.75rem', duration, ease }, 0)
    }
    if (risingDesc) {
      tl.to(
        risingDesc,
        {
          opacity: 1,
          maxHeight: 140,
          marginBottom: '1.25rem',
          duration: duration * 0.7,
          ease: 'power2.in',
        },
        duration * 0.3
      )
    }
    if (risingFooter) {
      tl.to(
        risingFooter,
        {
          opacity: 1,
          maxHeight: 60,
          marginTop: '0.5rem',
          duration: duration * 0.7,
          ease: 'power2.in',
        },
        duration * 0.3
      )
    }

    // B) Descending Card: Shrinks down from topRect to fromRect
    tl.to(
      cloneDescending,
      {
        left: fromRect.left,
        top: fromRect.top,
        width: fromRect.width,
        height: fromRect.height,
        borderRadius: 24,
        padding: 'clamp(1.25rem, 2.5vw, 1.5rem)',
        duration,
        ease,
      },
      0
    )
    if (descIconBox) {
      tl.to(descIconBox, { width: 38, height: 38, borderRadius: 12, duration, ease }, 0)
    }
    if (descBadge) {
      tl.to(descBadge, { fontSize: '11px', padding: '0.2rem 0.5rem', duration, ease }, 0)
    }
    if (descTitle) {
      tl.to(descTitle, { fontSize: 'clamp(1rem, 1.4vw, 1.15rem)', marginBottom: '0.25rem', duration, ease }, 0)
    }
    if (descTagline) {
      tl.to(descTagline, { fontSize: 'clamp(0.82rem, 1.1vw, 0.92rem)', marginBottom: '0px', duration, ease }, 0)
    }
    if (descDesc) {
      tl.to(
        descDesc,
        {
          opacity: 0,
          maxHeight: 0,
          marginBottom: '0px',
          duration: duration * 0.45,
          ease: 'power2.out',
        },
        0
      )
    }
    if (descFooter) {
      tl.to(
        descFooter,
        {
          opacity: 0,
          maxHeight: 0,
          marginTop: '0px',
          duration: duration * 0.45,
          ease: 'power2.out',
        },
        0
      )
    }
  }

  // When in All Cards Grid mode, clicking any card spotlights it
  const handleGridCardClick = (card: FeatureCard) => {
    setTopCard(card)
    setBottomCards(WHY_US_CARDS.filter((c) => c.id !== card.id))
    setIsSpotlight(true)
  }

  const handleSlide = (direction: 'prev' | 'next') => {
    if (!trackRef.current) return
    const cardWidth = trackRef.current.firstElementChild
      ? (trackRef.current.firstElementChild as HTMLElement).offsetWidth + 16
      : 260
    trackRef.current.scrollBy({
      left: direction === 'next' ? cardWidth : -cardWidth,
      behavior: 'smooth',
    })
  }

  // Mouse drag-to-scroll support for carousel track
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return
    isDragging.current = true
    startX.current = e.pageX - trackRef.current.offsetLeft
    scrollLeft.current = trackRef.current.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current || !trackRef.current) return
    e.preventDefault()
    const x = e.pageX - trackRef.current.offsetLeft
    const walk = (x - startX.current) * 1.5
    trackRef.current.scrollLeft = scrollLeft.current - walk
  }

  const handleMouseUpOrLeave = () => {
    isDragging.current = false
  }

  return (
    <section className={styles.section} aria-labelledby="why-us-title">
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

        <div className={styles.carouselContainer}>
          <p className={styles.helperText} aria-hidden="true">
            {isSpotlight
              ? 'Tap any card below to swap it with the spotlight card'
              : 'Click any card to spotlight and explore detailed specifications'}
          </p>

          {isSpotlight ? (
            <div>
              {/* Top Spotlight Expanded Card */}
              <div className={styles.expandedWrapper}>
                <div
                  ref={topCardRef}
                  className={`${styles.expandedCard} ${topCard.colorClass}`}
                >
                  <div className={styles.expandedTop}>
                    <div className={styles.expandedIconBox}>
                      {topCard.icon(32)}
                    </div>
                    <span className={styles.expandedBadge}>
                      {topCard.value}
                    </span>
                  </div>

                  <div className={styles.expandedBody}>
                    <h3 className={styles.expandedTitle}>
                      {topCard.title}
                    </h3>
                    <p className={styles.expandedValue}>
                      {topCard.tagline}
                    </p>
                    <p className={styles.expandedDesc}>
                      {topCard.description}
                    </p>
                  </div>

                  <div className={styles.expandedFooter}>
                    <Link href="/plans/" className={styles.expandedCta}>
                      Explore Plans <span aria-hidden="true">→</span>
                    </Link>
                    <button
                      type="button"
                      className={styles.resetBtn}
                      onClick={() => setIsSpotlight(false)}
                      aria-label="View all cards in full grid"
                    >
                      View All Cards
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom 5 Cards (3 visible, exact animated flight into clicked slot) */}
              <div className={styles.carouselSection}>
                <div
                  ref={trackRef}
                  className={styles.cardsCarouselTrack}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUpOrLeave}
                  onMouseLeave={handleMouseUpOrLeave}
                >
                  {bottomCards.map((card, idx) => (
                    <div
                      key={card.id}
                      onClick={(e) => handleSwap(idx, e.currentTarget)}
                      className={`${styles.gridCard} ${styles.carouselCardItem} ${card.colorClass}`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleSwap(idx, e.currentTarget as HTMLElement)
                        }
                      }}
                      aria-label={`Swap ${card.title} to top featured spot`}
                    >
                      <div className={styles.gridCardTop}>
                        <div className={styles.gridIconBox} aria-hidden="true">
                          {card.icon(26)}
                        </div>
                        <div className={styles.gridActionDot} aria-hidden="true">
                          ↑
                        </div>
                      </div>

                      <div>
                        <h4 className={styles.gridCardTitle}>{card.title}</h4>
                        <p className={styles.gridCardValue}>{card.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Centered Navigation Arrows Controls (Dots removed) */}
                <div className={styles.carouselControls}>
                  <div className={styles.navBtnGroup}>
                    <button
                      type="button"
                      className={styles.arrowBtn}
                      onClick={() => handleSlide('prev')}
                      aria-label="Previous cards"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      className={styles.arrowBtn}
                      onClick={() => handleSlide('next')}
                      aria-label="Next cards"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* All 6 Cards Standard Grid View (Default on Page Load) */
            <div className={styles.cardsGridDefault}>
              {WHY_US_CARDS.map((card) => (
                <div
                  key={card.id}
                  onClick={() => handleGridCardClick(card)}
                  className={`${styles.gridCard} ${card.colorClass}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleGridCardClick(card)
                    }
                  }}
                  aria-label={`Spotlight ${card.title}`}
                >
                  <div className={styles.gridCardTop}>
                    <div className={styles.gridIconBox} aria-hidden="true">
                      {card.icon(26)}
                    </div>
                    <div className={styles.gridActionDot} aria-hidden="true">
                      +
                    </div>
                  </div>

                  <div>
                    <h4 className={styles.gridCardTitle}>{card.title}</h4>
                    <p className={styles.gridCardValue}>{card.value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
