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
    <div ref={containerRef} className={styles.hubContainer}>
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
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
          {isOpen ? (
            <svg className={styles.triggerIcon} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg className={styles.triggerIcon} width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}

