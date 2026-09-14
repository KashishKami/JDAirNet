'use client'

import React, { useRef, useState } from 'react'
import styles from './WhyUsSection.module.css'

const FEATURES = [
  {
    num: '01',
    title: '99.9% Network Uptime',
    description:
      'Redundant fiber backbone rings and proactive NOC monitoring ensure continuous internet availability without interruptions.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Ultra-Low Latency',
    description:
      'Direct peering with major cloud providers, CDN networks, and gaming servers for instantaneous response times and zero lag.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    num: '03',
    title: '24/7 Local Support',
    description:
      'No endless IVR loops. Direct access to our dedicated local technical team ready to assist you over phone, WhatsApp, or on-site.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Dual-Band Wi-Fi 6 Routers',
    description:
      'Every plan comes paired with next-generation gigabit routers engineered to deliver seamless coverage throughout your home or office.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Symmetric Speeds',
    description:
      'Enjoy equal download and upload speeds — essential for seamless 4K video conferencing, large file backups, and live streaming.',
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
    description:
      'Truly unlimited high-speed broadband with transparent pricing and zero mid-month speed throttling. What you see is what you get.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
]

export default function WhyUsSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll = () => {
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

    setActiveIndex(closestIndex)
  }

  const scrollToCard = (index: number) => {
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
      setActiveIndex(index)
    }
  }

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeIndex - 1)
    scrollToCard(nextIdx)
  }

  const handleNext = () => {
    const nextIdx = Math.min(FEATURES.length - 1, activeIndex + 1)
    scrollToCard(nextIdx)
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

        <div className={styles.carouselWrapper}>
          <div
            ref={trackRef}
            className={styles.track}
            onScroll={handleScroll}
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

          <div className={styles.navigation}>
            <button
              type="button"
              className={styles.arrowBtn}
              onClick={handlePrev}
              disabled={activeIndex === 0}
              aria-label="Previous feature"
            >
              ←
            </button>
            <div className={styles.dots} aria-hidden="true">
              {FEATURES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
                  onClick={() => scrollToCard(i)}
                  aria-label={`Go to feature ${i + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              className={styles.arrowBtn}
              onClick={handleNext}
              disabled={activeIndex === FEATURES.length - 1}
              aria-label="Next feature"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
