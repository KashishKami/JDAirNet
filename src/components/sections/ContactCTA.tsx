'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import { CONTACT_INFO } from '@/data/contact'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './ContactCTA.module.css'

export default function ContactCTA() {
  const cardRef = useRef<HTMLDivElement>(null)

  useScrollReveal(cardRef, {
    y: 25,
    scale: 0.97,
    duration: 0.75,
  })

  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <div className="container">
        <div ref={cardRef} className={styles.card}>

          <div className={styles.eyebrow}>
            <span className="badge badge-primary">GET CONNECTED TODAY</span>
          </div>

          <h2 id="cta-title" className={styles.title}>
            Ready for Blazing Fast Internet?
          </h2>

          <p className={styles.subtitle}>
            Get installed within 24–48 hours. Choose your preferred way to connect with our sales and support team.
          </p>

          <div className={styles.channelsGrid}>
            {/* Channel 1: Direct Call */}
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className={`btn btn-primary ${styles.channelBtn}`}
              aria-label={`Call ${CONTACT_INFO.phoneDisplay}`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>Call {CONTACT_INFO.phoneDisplay}</span>
            </a>

            {/* Channel 2: WhatsApp Chat */}
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-whatsapp ${styles.channelBtn}`}
              aria-label="Chat on WhatsApp"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <span>Chat on WhatsApp</span>
            </a>

            {/* Channel 3: Online Form */}
            <Link
              href="/contact/"
              className={`btn btn-secondary ${styles.channelBtn}`}
              aria-label="Send Message through contact form"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>Send Message</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
