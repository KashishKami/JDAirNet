'use client'

import React from 'react'
import Link from 'next/link'
import styles from './HeroSection.module.css'

export default function HeroSection() {
  return (
    <section className={styles.heroSection} aria-label="Hero">
      {/* Full-Screen Video Background */}
      <div className={styles.videoContainer}>
        <video
          className={styles.heroVideo}
          autoPlay
          muted
          loop
          playsInline
          poster="/hero-poster.jpg"
          preload="none"
        >
          <source src="/Hero.mp4" type="video/mp4" />
          <source src="/Hero.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className={styles.videoOverlay} aria-hidden="true" />
      </div>

      {/* Large Transparent Glassmorphic Card matching TelNet theme reference */}
      <div className={styles.contentContainer}>
        <div className={styles.heroCard}>
          <div className={styles.badgeWrapper}>
            <span className={styles.badgePill}>
              BEST BROADBAND SOLUTION
            </span>
          </div>

          <h1 className={styles.heroH1}>
            Best Internet Services <br />
            In Your Region
          </h1>

          <p className={styles.heroSubtext}>
            Lightning-fast fiber internet with unlimited data, 99.9% uptime, and dedicated
            24/7 customer support for your home and business.
          </p>

          <div className={styles.heroActions}>
            <div className={styles.buttonFrame}>
              <Link href="/plans/" className={styles.primaryWhiteBtn}>
                <span>VIEW PLANS</span>
                <span className={styles.arrowCircle} aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
