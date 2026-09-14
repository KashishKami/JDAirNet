import { Metadata } from 'next'
import React from 'react'
import { CONTACT_INFO } from '@/data/contact'
import ContactForm from '@/components/ui/ContactForm'
import JsonLd from '@/components/seo/JsonLd'
import {
  generateWebPageSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
} from '@/lib/schemaGenerators'
import ScrollReveal from '@/components/ui/ScrollReveal'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Contact JDAirNet for new broadband connections, enterprise lease lines, feasibility inquiries, and 24/7 technical customer support.',
  alternates: {
    canonical: 'https://jdairnet.com/contact/',
  },
  openGraph: {
    title: 'Contact Us | JDAirNet',
    description:
      'Reach out to JDAirNet via phone, WhatsApp, or send an inquiry via our contact form.',
    url: 'https://jdairnet.com/contact/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact JDAirNet',
      },
    ],
  },
}

export default function ContactPage() {
  const contactSchema = generateWebPageSchema({
    type: 'ContactPage',
    name: 'Contact JDAirNet | Customer Support & Sales',
    description:
      'Get in touch with JDAirNet via phone, WhatsApp, or contact form.',
    url: '/contact/',
  })

  const localBizSchema = generateLocalBusinessSchema()
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Contact Us', url: '/contact/' },
  ])

  return (
    <main className={styles.contactPage}>
      {/* SEO Schemas */}
      <JsonLd schema={contactSchema} />
      <JsonLd schema={localBizSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <div className="container">
        {/* Header Section */}
        <ScrollReveal y={24} duration={0.6}>
          <div className={styles.headerSection}>
            <span className={styles.eyebrow}>Support & Inquiries</span>
            <h1 className={styles.title}>Get in Touch with JDAirNet</h1>
            <p className={styles.subtitle}>
              Have questions about new broadband plans, dedicated enterprise lease
              lines, or need technical assistance? Reach us through any channel below.
            </p>
          </div>
        </ScrollReveal>

        {/* Layout: Left Channels + Right Form */}
        <div className={styles.layoutGrid}>
          {/* Channels Column */}
          <ScrollReveal selector={`.${styles.channelsCol} > *`} y={25} stagger={0.1} className={styles.channelsCol}>
            {/* Phone Channel */}
            <div className={styles.channelCard}>
              <div className={styles.channelIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className={styles.channelInfo}>
                <h3 className={styles.channelTitle}>Direct Phone Call</h3>
                <p className={styles.channelDesc}>
                  Immediate assistance for bookings & emergency support
                </p>
                <a href={`tel:${CONTACT_INFO.phone}`} className={styles.channelLink}>
                  {CONTACT_INFO.phoneDisplay}
                </a>
              </div>
            </div>

            {/* WhatsApp Channel */}
            <div className={styles.channelCard}>
              <div className={`${styles.channelIcon} ${styles.channelIconWhatsApp}`}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.016-.476-1.558-.646-2.586-2.222-2.664-2.327-.078-.104-.633-.842-.633-1.608 0-.766.4-1.144.542-1.298.144-.156.313-.195.417-.195.105 0 .209.002.301.006.096.004.225-.036.353.271.132.318.45 1.099.49 1.178.04.078.067.17.013.276-.053.104-.08.17-.157.261-.078.092-.164.204-.234.275-.078.078-.16.163-.069.319.091.156.404.667.868 1.08 1.069.952 1.353.978 1.545 1.074.192.096.304.084.417-.046.113-.131.486-.566.616-.761.13-.195.26-.163.436-.098.176.065 1.119.528 1.312.624.192.096.32.144.368.225.048.08.048.47-.096.875z" />
                </svg>
              </div>
              <div className={styles.channelInfo}>
                <h3 className={styles.channelTitle}>WhatsApp Chat</h3>
                <p className={styles.channelDesc}>
                  Instant chat for quick plan recommendations & feasibility checks
                </p>
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(
                    CONTACT_INFO.whatsappMessage
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.channelLink} ${styles.channelLinkWhatsApp}`}
                >
                  Chat on WhatsApp &rarr;
                </a>
              </div>
            </div>

            {/* Office & Hours */}
            <div className={styles.channelCard}>
              <div className={styles.channelIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className={styles.channelInfo}>
                <h3 className={styles.channelTitle}>Regional Headquarters</h3>
                <p className={styles.officeText}>
                  {CONTACT_INFO.address.street}, {CONTACT_INFO.address.city},{' '}
                  {CONTACT_INFO.address.state} - {CONTACT_INFO.address.postalCode}
                </p>
                <p className={styles.officeSubtext}>
                  <strong>Operating Hours:</strong> {CONTACT_INFO.businessHours}
                </p>
              </div>
            </div>
          </ScrollReveal>

          {/* Contact Form Column */}
          <ScrollReveal y={25} duration={0.6}>
            <ContactForm />
          </ScrollReveal>
        </div>
      </div>
    </main>
  )
}
