import React from 'react'
import Link from 'next/link'
import { CONTACT_INFO } from '@/data/contact'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <div className={styles.brandLogo}>
            <span>JD<span className={styles.brandAccent}>AirNet</span></span>
          </div>
          <p className={styles.brandDescription}>
            Delivering high-speed fiber broadband to homes and ultra-reliable 1:1 dedicated lease lines to enterprises with 24/7 on-ground support.
          </p>
          <ul className={styles.contactList}>
            <li className={styles.contactItem}>
              <span>📞</span>
              <a href={`tel:${CONTACT_INFO.phone}`} className={styles.contactLink}>
                {CONTACT_INFO.phoneDisplay}
              </a>
            </li>
            <li className={styles.contactItem}>
              <span>💬</span>
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLink}
              >
                WhatsApp: {CONTACT_INFO.whatsappDisplay}
              </a>
            </li>
            <li className={styles.contactItem}>
              <span>✉️</span>
              <a href={`mailto:${CONTACT_INFO.email}`} className={styles.contactLink}>
                {CONTACT_INFO.email}
              </a>
            </li>
            <li className={styles.contactItem}>
              <span>📍</span>
              <span>{CONTACT_INFO.address.street}, {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state}</span>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className={styles.footerHeading}>Quick Links</h4>
          <ul className={styles.linksList}>
            <li><Link href="/" className={styles.footerLink}>Home</Link></li>
            <li><Link href="/plans/" className={styles.footerLink}>Broadband Plans</Link></li>
            <li><Link href="/lease-lines/" className={styles.footerLink}>Enterprise Lease Lines</Link></li>
            <li><Link href="/coverage/" className={styles.footerLink}>Coverage Area</Link></li>
            <li><Link href="/about/" className={styles.footerLink}>About Us</Link></li>
            <li><Link href="/contact/" className={styles.footerLink}>Contact & Support</Link></li>
          </ul>
        </div>

        {/* Legal & Support */}
        <div>
          <h4 className={styles.footerHeading}>Legal & Support</h4>
          <ul className={styles.linksList}>
            <li><Link href="/privacy-policy/" className={styles.footerLink}>Privacy Policy</Link></li>
            <li><Link href="/terms-of-service/" className={styles.footerLink}>Terms of Service</Link></li>
            <li><Link href="/contact/" className={styles.footerLink}>24/7 Help Desk</Link></li>
            <li><Link href="/contact/#faq" className={styles.footerLink}>Frequently Asked Questions</Link></li>
          </ul>
        </div>
      </div>

      <div className={`container ${styles.bottomBar}`}>
        <p>© {currentYear} JDAirNet Internet Services. All rights reserved.</p>
        <p>Ultra-Fast Fiber & Dedicated Bandwidth Solutions</p>
      </div>
    </footer>
  )
}
