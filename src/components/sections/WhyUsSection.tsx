'use client'

import React, { useRef } from 'react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './WhyUsSection.module.css'

const FEATURES = [
  {
    title: '99.9% Network Uptime',
    description: 'Redundant fiber backbone rings and proactive NOC monitoring ensure continuous internet availability without interruptions.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    title: 'Ultra-Low Latency',
    description: 'Direct peering with major cloud providers, CDN networks, and gaming servers for instantaneous response times and zero lag.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: '24/7 Local Support',
    description: 'No endless IVR loops. Direct access to our dedicated local technical team ready to assist you over phone, WhatsApp, or on-site.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    title: 'Dual-Band Wi-Fi 6 Routers',
    description: 'Every plan comes paired with next-generation gigabit routers engineered to deliver seamless coverage throughout your home or office.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
      </svg>
    ),
  },
  {
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
  const gridRef = useRef<HTMLDivElement>(null)

  useScrollReveal(gridRef, {
    selector: `.${styles.grid} > *`,
    y: 30,
    stagger: 0.1,
    duration: 0.75,
  })

  return (
    <section className={styles.section} aria-labelledby="why-us-title">
      <div className="container">
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className="badge badge-primary">THE JDAIRNET ADVANTAGE</span>
          </div>
          <h2 id="why-us-title" className={styles.title}>
            Why Choose JDAirNet
          </h2>
          <p className={styles.subtitle}>
            Engineered for ultra-fast, uninterrupted connectivity with enterprise-grade infrastructure tailored for residential and business users.
          </p>
        </div>

        <div ref={gridRef} className={styles.grid}>

          {FEATURES.map((feature, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.iconWrapper} aria-hidden="true">
                {feature.icon}
              </div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardText}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
