import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { CONTACT_INFO } from '@/data/contact'
import JsonLd from '@/components/seo/JsonLd'
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from '@/lib/schemaGenerators'
import ScrollReveal from '@/components/ui/ScrollReveal'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Network Coverage & Service Areas',
  description:
    'Check high-speed fiber broadband and dedicated enterprise lease line availability across residential societies, commercial complexes, and institutions.',
  alternates: {
    canonical: 'https://jdairnet.com/coverage/',
  },
  openGraph: {
    title: 'Network Coverage & Service Areas | JDAirNet',
    description:
      'Check high-speed fiber broadband and dedicated enterprise lease line availability in your area.',
    url: 'https://jdairnet.com/coverage/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JDAirNet Network Coverage',
      },
    ],
  },
}

export default function CoveragePage() {
  const webPageSchema = generateWebPageSchema({
    type: 'WebPage',
    name: 'Network Coverage Areas | JDAirNet',
    description:
      'Check high-speed fiber broadband and lease-line coverage in your area.',
    url: '/coverage/',
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Coverage', url: '/coverage/' },
  ])

  return (
    <main className={styles.coveragePage}>
      {/* SEO Schemas */}
      <JsonLd schema={webPageSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <div className="container">
        {/* Header Section */}
        <ScrollReveal y={24} duration={0.6}>
          <div className={styles.headerSection}>
            <span className={styles.eyebrow}>High-Speed Fiber Network</span>
            <h1 className={styles.title}>Network Coverage & Service Areas</h1>
            <p className={styles.subtitle}>
              We are actively expanding our Gigabit optical fiber infrastructure
              across key residential, educational, and commercial zones. Check our
              active deployment hubs below or request a feasibility survey for
              your building.
            </p>
          </div>
        </ScrollReveal>

        {/* Coverage Cards Grid */}
        <ScrollReveal selector={`.${styles.coverageGrid} > *`} y={30} stagger={0.12}>
          <div className={styles.coverageGrid}>
            <div className={styles.coverageCard}>
              <div className={styles.cardIconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h2 className={styles.cardTitle}>Residential & Society Coverage</h2>
              <p className={styles.cardDesc}>
                FTTH (Fiber to the Home) gigabit-ready lines deployed directly to
                apartments, gated societies, residential colonies, and private
                villas with instant activation.
              </p>
              <ul className={styles.areaList}>
                <li className={styles.areaTag}>Rajpur Road</li>
                <li className={styles.areaTag}>Sahastradhara Road</li>
                <li className={styles.areaTag}>GMS Road</li>
                <li className={styles.areaTag}>Chakrata Road</li>
                <li className={styles.areaTag}>Dalanwala</li>
                <li className={styles.areaTag}>Vasant Vihar</li>
                <li className={styles.areaTag}>Subhash Nagar</li>
              </ul>
            </div>

            <div className={styles.coverageCard}>
              <div className={styles.cardIconWrapper}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
              </div>
              <h2 className={styles.cardTitle}>Commercial & Enterprise Corridors</h2>
              <p className={styles.cardDesc}>
                Dedicated redundant fiber rings delivering 1:1 symmetrical lease
                lines with 99.9% SLA guarantees for corporate offices, IT parks,
                hotels, and hospitals.
              </p>
              <ul className={styles.areaList}>
                <li className={styles.areaTag}>IT Park / Sahastradhara</li>
                <li className={styles.areaTag}>Patel Nagar Industrial Area</li>
                <li className={styles.areaTag}>Haridwar Bypass Road</li>
                <li className={styles.areaTag}>Clock Tower Commercial Hub</li>
                <li className={styles.areaTag}>Selaqui Industrial Corridor</li>
                <li className={styles.areaTag}>Transport Nagar</li>
              </ul>
            </div>
          </div>
        </ScrollReveal>

        {/* Feasibility CTA Banner */}
        <ScrollReveal y={30} duration={0.7}>
          <section className={styles.feasibilityBanner}>
            <h2 className={styles.bannerTitle}>Don&apos;t See Your Location Listed?</h2>
            <p className={styles.bannerText}>
              We deploy new fiber nodes weekly based on demand. Contact our local
              network team to run a free optical feasibility check for your home,
              hostel, or office complex.
            </p>
            <div className={styles.bannerActions}>
              <Link href="/contact/" className={styles.primaryBtn}>
                Check Feasibility
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <a href={`tel:${CONTACT_INFO.phone}`} className={styles.secondaryBtn}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Call Us
              </a>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </main>
  )
}
