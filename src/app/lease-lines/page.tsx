import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { LEASE_LINE_FEATURES, LEASE_LINE_USE_CASES } from '@/data/leaseLines'
import { CONTACT_INFO } from '@/data/contact'
import JsonLd from '@/components/seo/JsonLd'
import {
  generateWebPageSchema,
  generateServiceSchema,
  generateBreadcrumbSchema,
} from '@/lib/schemaGenerators'
import ScrollReveal from '@/components/ui/ScrollReveal'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'Enterprise Internet Lease Lines',
  description:
    'Dedicated 1:1 symmetrical internet lease lines with 99.9% uptime SLA, low latency, and 24/7 NOC support for corporate offices, colleges, and institutions.',
  alternates: {
    canonical: 'https://jdairnet.com/lease-lines/',
  },
  openGraph: {
    title: 'Enterprise Internet Lease Lines | JDAirNet',
    description:
      'Dedicated 1:1 symmetrical internet lease lines with 99.9% uptime SLA, low latency, and 24/7 NOC support.',
    url: 'https://jdairnet.com/lease-lines/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JDAirNet Enterprise Lease Lines',
      },
    ],
  },
}

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  symmetric: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 11 12 6 7 11" />
      <polyline points="7 13 12 18 17 13" />
      <line x1="12" y1="6" x2="12" y2="18" />
    </svg>
  ),
  dedicated: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  sla: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  security: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  noc: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  scalable: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
}

export default function LeaseLinesPage() {
  const webPageSchema = generateWebPageSchema({
    type: 'WebPage',
    name: 'Enterprise Internet Lease Lines | JDAirNet',
    description:
      'Dedicated 1:1 symmetrical internet lease lines with 99.9% uptime SLA and 24/7 NOC support.',
    url: '/lease-lines/',
  })

  const serviceSchema = generateServiceSchema('lease-line')
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Lease Lines', url: '/lease-lines/' },
  ])

  return (
    <main className={styles.leasePage}>
      {/* SEO Schemas */}
      <JsonLd schema={webPageSchema} />
      <JsonLd schema={serviceSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <div className="container">
        {/* Header Section */}
        <ScrollReveal y={24} duration={0.6}>
          <div className={styles.headerSection}>
            <span className={styles.eyebrow}>Enterprise Dedicated Connectivity</span>
            <h1 className={styles.title}>Enterprise Internet Lease Lines</h1>
            <p className={styles.subtitle}>
              Mission-critical, dedicated fiber bandwidth engineered with 1:1 uncontended symmetrical throughput, guaranteed 99.9% SLA, and local NOC level-3 engineering.
            </p>

            <div className={styles.headerActions}>
              <Link href="/contact/" className="btn btn-primary">
                Request a Quote →
              </Link>
              <a href={`tel:${CONTACT_INFO.phone}`} className="btn btn-secondary">
                Talk to Sales: {CONTACT_INFO.phoneDisplay}
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Stats / Value Highlights Banner */}
        <ScrollReveal selector={`.${styles.statsBanner} > *`} y={25} stagger={0.1}>
          <div className={styles.statsBanner} aria-label="Key Performance Indicators">
            <div className={styles.statItem}>
              <div className={styles.statValue}>1:1</div>
              <div className={styles.statLabel}>Dedicated Symmetrical Speed</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>99.9%</div>
              <div className={styles.statLabel}>SLA Uptime Commitment</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>&lt; 15ms</div>
              <div className={styles.statLabel}>Ultra-Low Core Latency</div>
            </div>
          </div>
        </ScrollReveal>

        {/* 6 Features Grid */}
        <section className={styles.featuresSection} aria-labelledby="features-heading">
          <ScrollReveal y={20}>
            <div className={styles.sectionHeader}>
              <h2 id="features-heading" className={styles.sectionTitle}>
                Engineered for Enterprise Performance
              </h2>
              <p className={styles.sectionSubtitle}>
                Built on resilient optical fiber architecture to power enterprise cloud systems, VoIP, and mission-critical workflows.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal selector={`.${styles.featuresGrid} > *`} y={30} stagger={0.08}>
            <div className={styles.featuresGrid}>
              {LEASE_LINE_FEATURES.map((feature, idx) => (
                <div key={idx} className={styles.featureCard}>
                  <div className={styles.featureIcon} aria-hidden="true">
                    {FEATURE_ICONS[feature.icon] || FEATURE_ICONS.dedicated}
                  </div>
                  <h3 className={styles.featureTitle}>{feature.label}</h3>
                  <p className={styles.featureDesc}>{feature.description}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Use Cases Section */}
        <section className={styles.useCasesSection} aria-labelledby="usecases-heading">
          <ScrollReveal y={20}>
            <h2 id="usecases-heading" className={styles.sectionTitle}>
              Who Relies on JDAirNet Lease Lines?
            </h2>
            <p className={styles.sectionSubtitle}>
              Custom-tailored fiber infrastructure for multi-user campuses, enterprises, and high-density institutions.
            </p>
          </ScrollReveal>

          <ScrollReveal selector={`.${styles.useCasesGrid} > *`} y={20} stagger={0.04}>
            <div className={styles.useCasesGrid}>
              {LEASE_LINE_USE_CASES.map((useCase, index) => (
                <div key={index} className={styles.useCaseChip}>
                  <span className={styles.chipDot} aria-hidden="true" />
                  <span>{useCase}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Enterprise Bottom Conversion CTA */}
        <ScrollReveal y={30} duration={0.7}>
          <div className={styles.enterpriseCta}>
            <h2 className={styles.ctaTitle}>Ready to Deploy Enterprise Fiber?</h2>
            <p className={styles.ctaSubtitle}>
              Get a tailored proposal with custom bandwidth configurations, route diversity, and enterprise SLAs.
            </p>
            <div className={styles.ctaButtonGroup}>
              <Link href="/contact/" className="btn btn-primary">
                Request a Quote →
              </Link>
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent('Hello JDAirNet, I would like to request an Enterprise Lease Line quote.')}`}
                className="btn btn-whatsapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  )
}
