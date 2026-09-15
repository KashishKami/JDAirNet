'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { CONTACT_INFO } from '@/data/contact'
import { gsap } from '@/lib/animations'
import styles from './FloatingContactHub.module.css'

export default function FloatingContactHub() {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const bounceTimelineRef = useRef<gsap.core.Timeline | null>(null)

  // Perpetual frictionless elastic ball bounce (zero energy loss, identical height every bounce)
  useEffect(() => {
    if (typeof window === 'undefined' || !triggerRef.current) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    // Create perpetual frictionless elastic bouncing timeline
    const tl = gsap.timeline({
      repeat: -1,
    })

    // 1. Launch & rise to peak height (deceleration under gravity)
    tl.to(triggerRef.current, {
      y: -26,
      duration: 0.44,
      ease: 'power2.out',
    })
      // 2. Fall back down to ground (acceleration under gravity)
      .to(triggerRef.current, {
        y: 0,
        duration: 0.44,
        ease: 'power2.in',
      })
      // 3. Elastic impact squash on ground
      .to(triggerRef.current, {
        scaleX: 1.15,
        scaleY: 0.85,
        duration: 0.07,
        ease: 'power1.out',
      })
      // 4. Elastic rebound launch
      .to(triggerRef.current, {
        scaleX: 1,
        scaleY: 1,
        duration: 0.07,
        ease: 'power1.in',
      })

    bounceTimelineRef.current = tl

    return () => {
      tl.kill()
    }
  }, [])

  // Handle open / close animations & pausing bounce
  useEffect(() => {
    if (!triggerRef.current) return

    if (isOpen) {
      // Pause perpetual bounce and reset position
      if (bounceTimelineRef.current) {
        bounceTimelineRef.current.pause()
        gsap.to(triggerRef.current, {
          y: 0,
          scaleX: 1,
          scaleY: 1,
          duration: 0.18,
          ease: 'power2.out',
        })
      }

      // Animate channel popups with staggered spring
      if (menuRef.current && menuRef.current.children.length > 0) {
        gsap.fromTo(
          menuRef.current.children,
          { scale: 0.5, opacity: 0, y: 15 },
          { scale: 1, opacity: 1, y: 0, stagger: 0.07, duration: 0.35, ease: 'back.out(2)' }
        )
      }
    } else {
      // Resume perpetual bounce if allowed
      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!prefersReducedMotion && bounceTimelineRef.current) {
        bounceTimelineRef.current.restart()
      }
    }
  }, [isOpen])

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div ref={containerRef} className={styles.hubContainer} data-floating-hub>
      {/* 3 Channels Popup Menu */}
      {isOpen && (
        <div ref={menuRef} className={styles.menuList} role="menu" aria-label="Contact Channels">
          {/* Channel 1: Phone */}
          <a
            href={`tel:${CONTACT_INFO.phone}`}
            className={`${styles.channelItem} ${styles.channelPhone}`}
            role="menuitem"
            aria-label={`Call ${CONTACT_INFO.phoneDisplay}`}
            onClick={() => setIsOpen(false)}
          >
            <span className={styles.channelIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <span>Call Us</span>
          </a>

          {/* Channel 2: WhatsApp */}
          <a
            href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${styles.channelItem} ${styles.channelWhatsApp}`}
            role="menuitem"
            aria-label="Chat on WhatsApp"
            onClick={() => setIsOpen(false)}
          >
            <span className={styles.channelIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.75 7.85 19L7.55 18.82L4.43 19.64L5.26 16.59L5.06 16.27C4.24 14.97 3.8 13.46 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.45C16.32 14.32 15.1 13.72 14.87 13.64C14.65 13.56 14.48 13.52 14.32 13.77C14.15 14.02 13.67 14.59 13.53 14.76C13.38 14.93 13.23 14.95 12.98 14.82C12.73 14.7 11.93 14.43 10.98 13.59C10.24 12.93 9.74 12.11 9.6 11.86C9.45 11.61 9.58 11.47 9.71 11.35C9.82 11.24 9.96 11.06 10.08 10.92C10.2 10.78 10.25 10.67 10.33 10.51C10.41 10.34 10.37 10.2 10.31 10.07C10.25 9.95 9.76 8.74 9.55 8.24C9.35 7.75 9.15 7.82 9 7.81C8.86 7.8 8.7 7.8 8.53 7.8C8.37 7.8 8.1 7.86 7.87 8.11C7.65 8.36 7.02 8.95 7.02 10.15C7.02 11.35 7.9 12.51 8.02 12.67C8.14 12.84 9.74 15.31 12.19 16.36C12.77 16.61 13.23 16.76 13.58 16.87C14.17 17.06 14.71 17.03 15.13 16.97C15.61 16.9 16.6 16.37 16.81 15.79C17.02 15.21 17.02 14.71 16.96 14.61C16.89 14.51 16.82 14.57 16.57 14.45Z" />
              </svg>
            </span>
            <span>WhatsApp</span>
          </a>

          {/* Channel 3: Contact Form */}
          <Link
            href="/contact/"
            className={`${styles.channelItem} ${styles.channelForm}`}
            role="menuitem"
            aria-label="Send Message through contact form"
            onClick={() => setIsOpen(false)}
          >
            <span className={styles.channelIcon}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <span>Send Message</span>
          </Link>
        </div>
      )}

      {/* Main Trigger Button Wrapper */}
      <div className={styles.triggerWrapper}>
        <button
          ref={triggerRef}
          type="button"
          className={`${styles.triggerBtn} ${isOpen ? styles.triggerBtnOpen : ''}`}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Contact Us"
          aria-expanded={isOpen}
          aria-haspopup="menu"
        >
          {/* Chat icon — visible when closed */}
          <span className={`${styles.iconSlot} ${isOpen ? styles.iconSlotHidden : styles.iconSlotVisible}`}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </span>

          {/* Close (×) icon — visible when open */}
          <span className={`${styles.iconSlot} ${isOpen ? styles.iconSlotVisible : styles.iconSlotHidden}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  )
}

