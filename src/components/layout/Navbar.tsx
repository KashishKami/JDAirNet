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
    <header className={`${styles.header} ${pathname === '/' ? '' : styles.headerDark}`}>
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
            <span>Call Us</span>
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

      {/* Mobile Drawer Menu (with smooth transition) */}
      <div
        className={`${styles.mobileMenu} ${isOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!isOpen}
      >
        <nav className={styles.mobileNav} aria-label="Mobile Navigation">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.mobileNavLink} ${isActive ? styles.mobileNavLinkActive : ''}`}
                onClick={closeMenu}
                tabIndex={isOpen ? 0 : -1}
              >
                <span>{link.label}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            )
          })}
        </nav>
        <div className={styles.mobileMenuActions}>
          <a
            href={`tel:${CONTACT_INFO.phone}`}
            className={`btn btn-primary ${styles.mobileActionBtn}`}
            onClick={closeMenu}
            tabIndex={isOpen ? 0 : -1}
            aria-label="Call Us"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </a>
          <a
            href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`btn btn-whatsapp ${styles.mobileActionBtn}`}
            onClick={closeMenu}
            tabIndex={isOpen ? 0 : -1}
            aria-label="WhatsApp"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.57 20.15 9.12 19.75 7.85 19L7.55 18.82L4.43 19.64L5.26 16.59L5.06 16.27C4.24 14.97 3.8 13.46 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.05 20.15ZM16.57 14.45C16.32 14.32 15.1 13.72 14.87 13.64C14.65 13.56 14.48 13.52 14.32 13.77C14.15 14.02 13.67 14.59 13.53 14.76C13.38 14.93 13.23 14.95 12.98 14.82C12.73 14.7 11.93 14.43 10.98 13.59C10.24 12.93 9.74 12.11 9.6 11.86C9.45 11.61 9.58 11.47 9.71 11.35C9.82 11.24 9.96 11.06 10.08 10.92C10.2 10.78 10.25 10.67 10.33 10.51C10.41 10.34 10.37 10.2 10.31 10.07C10.25 9.95 9.76 8.74 9.55 8.24C9.35 7.75 9.15 7.82 9 7.81C8.86 7.8 8.7 7.8 8.53 7.8C8.37 7.8 8.1 7.86 7.87 8.11C7.65 8.36 7.02 8.95 7.02 10.15C7.02 11.35 7.9 12.51 8.02 12.67C8.14 12.84 9.74 15.31 12.19 16.36C12.77 16.61 13.23 16.76 13.58 16.87C14.17 17.06 14.71 17.03 15.13 16.97C15.61 16.9 16.6 16.37 16.81 15.79C17.02 15.21 17.02 14.71 16.96 14.61C16.89 14.51 16.82 14.57 16.57 14.45Z" />
            </svg>
          </a>
          <Link
            href="/contact/"
            className={`btn btn-secondary ${styles.mobileActionBtn} ${styles.mobileMessageBtn}`}
            onClick={closeMenu}
            tabIndex={isOpen ? 0 : -1}
            aria-label="Send Message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
