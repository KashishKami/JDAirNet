import Link from 'next/link'
import React from 'react'
import styles from './not-found.module.css'

export const metadata = {
  title: '404 — Page Not Found | JDAirNet',
  description:
    'The page you are looking for does not exist. Return to JDAirNet and explore our high-speed fiber broadband and enterprise lease line plans.',
}

export default function NotFound() {
  return (
    <main className={styles.notFoundPage} data-page="not-found">
      {/* Full-screen background video */}
      <div className={styles.videoWrapper} aria-hidden="true">
        <video
          className={styles.bgVideo}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/404_1-poster.jpg"
        >
          <source src="/404_1.webm" type="video/webm" />
          <source src="/404_1.mp4" type="video/mp4" />
        </video>
        {/* Colour-theme overlay */}
        <div className={styles.videoOverlay} />
      </div>

      {/* Content */}
      <div className={`container ${styles.content}`}>
        <h1 className={styles.errorCode}>
          404
        </h1>

        <p className={styles.description}>
          The page seems to have slipped beyond our reach :/
          <br />
          Let&rsquo;s bring you back to solid ground.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryBtn}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span>Back to Homepage</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
