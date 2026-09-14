import React from 'react'
import Link from 'next/link'
import { CONTACT_INFO } from '@/data/contact'
import styles from './ContactBar.module.css'

export default function ContactBar() {
  return (
    <aside className={styles.bar} aria-label="Quick Contact Actions">
      {/* 1. Direct Call */}
      <a
        href={`tel:${CONTACT_INFO.phone}`}
        className={`${styles.channelBtn} ${styles.callBtn}`}
        aria-label="Call Us"
      >
        <span>📞</span>
        <span>Call Us</span>
      </a>

      {/* 2. WhatsApp Chat */}
      <a
        href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(CONTACT_INFO.whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.channelBtn} ${styles.whatsappBtn}`}
        aria-label="WhatsApp"
      >
        <span>💬</span>
        <span>WhatsApp</span>
      </a>

      {/* 3. Contact Form */}
      <Link
        href="/contact/"
        className={`${styles.channelBtn} ${styles.formBtn}`}
        aria-label="Send Message"
      >
        <span>✉️</span>
        <span>Send Message</span>
      </Link>
    </aside>
  )
}
