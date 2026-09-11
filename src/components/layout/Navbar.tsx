'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { CONTACT_INFO } from '@/data/contact'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Plans', href: '/plans/' },
  { label: 'Lease Lines', href: '/lease-lines/' },
  { label: 'Coverage', href: '/coverage/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        {/* Brand Logo */}
        <Link href="/" className={styles.logo} onClick={closeMenu}>
          <span>JD<span className={styles.logoAccent}>AirNet</span></span>
          <span className={styles.logoTag}>FIBER</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav} aria-label="Main Navigation">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Desktop Action (Direct Call CTA) */}
        <div className={styles.headerActions}>
          <a
            href={`tel:${CONTACT_INFO.phone}`}
            className={styles.callBtn}
            aria-label={`Call JDAirNet at ${CONTACT_INFO.phoneDisplay}`}
          >
            <svg
              width="16"
              height="16"
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
            <span>{CONTACT_INFO.phoneDisplay}</span>
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className={`${styles.mobileToggle} ${isOpen ? styles.mobileToggleOpen : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className={styles.mobileMenu}>
          <nav aria-label="Mobile Navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={styles.mobileNavLink}
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className={styles.mobileMenuActions}>
            <a
              href={`tel:${CONTACT_INFO.phone}`}
              className={`btn btn-primary ${styles.mobileCallBtn}`}
              onClick={closeMenu}
            >
              Call {CONTACT_INFO.phoneDisplay}
            </a>
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`btn btn-whatsapp ${styles.mobileCallBtn}`}
              onClick={closeMenu}
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
