import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { BROADBAND_PLANS } from '@/data/plans'
import PlanCard from '@/components/ui/PlanCard'
import JsonLd from '@/components/seo/JsonLd'
import {
  generateWebPageSchema,
  generateServiceSchema,
  generatePlansItemListSchema,
  generateBreadcrumbSchema,
} from '@/lib/schemaGenerators'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'High-Speed Fiber Broadband Plans',
  description:
    'Explore unlimited high-speed broadband plans from JDAirNet. Affordable fiber internet for homes and offices with 24/7 priority support and free installation.',
  alternates: {
    canonical: 'https://jdairnet.com/plans/',
  },
  openGraph: {
    title: 'High-Speed Fiber Broadband Plans | JDAirNet',
    description:
      'Explore unlimited high-speed broadband plans from JDAirNet. Affordable fiber internet for homes and offices with 24/7 priority support.',
    url: 'https://jdairnet.com/plans/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JDAirNet Broadband Plans',
      },
    ],
  },
}

const ADDONS = [
  {
    name: 'Watcho OTT',
    desc: 'Stream 15+ premium OTT entertainment platforms including SonyLIV and Zee5 seamlessly.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
        <polyline points="17 2 12 7 7 2" />
      </svg>
    ),
  },
  {
    name: 'Pioneer IPTV',
    desc: '300+ Live HD TV channels with zero lag and crystal-clear broadcast clarity.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    name: 'Static IP',
    desc: 'Dedicated public static IP for low-latency gaming, CCTV surveillance, and remote servers.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
        <line x1="6" y1="6" x2="6.01" y2="6" />
        <line x1="6" y1="18" x2="6.01" y2="18" />
      </svg>
    ),
  },
  {
    name: 'HD Streaming',
    desc: 'Optimized network routing for buffer-free 4K/8K ultra-high-definition streaming across multiple devices.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
  },
]

export default function PlansPage() {
  const webPageSchema = generateWebPageSchema({
    type: 'WebPage',
    name: 'High-Speed Fiber Broadband Plans | JDAirNet',
    description:
      'Explore unlimited high-speed broadband plans from JDAirNet. Affordable fiber internet for homes and offices.',
    url: '/plans/',
  })

  const serviceSchema = generateServiceSchema('broadband')
  const itemListSchema = generatePlansItemListSchema(BROADBAND_PLANS)
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Plans', url: '/plans/' },
  ])

  return (
    <main className={styles.plansPage}>
      {/* SEO Schemas */}
      <JsonLd schema={webPageSchema} />
      <JsonLd schema={serviceSchema} />
      <JsonLd schema={itemListSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <div className="container">
        {/* Header */}
        <div className={styles.headerSection}>
          <span className={styles.eyebrow}>Pricing & Packages</span>
          <h1 className={styles.title}>High-Speed Fiber Broadband Plans</h1>
          <p className={styles.subtitle}>
            Ultra-fast, symmetric fiber internet engineered for gaming, streaming, remote work, and multi-user homes.
          </p>
        </div>

        {/* 4 Plans Grid */}
        <div className={styles.plansGrid}>
          {BROADBAND_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* GST & Terms Note */}
        <div className={styles.gstDisclaimer}>
          <p>
            * All prices exclude 18% GST. Free installation applies on multi-month subscriptions. Router provided as per plan specifications.
          </p>
        </div>

        {/* Add-ons Section */}
        <section className={styles.addonsSection} aria-labelledby="addons-heading">
          <div className={styles.addonsHeader}>
            <h2 id="addons-heading" className={styles.addonsTitle}>
              Available Add-ons & Services
            </h2>
            <p className={styles.addonsSubtitle}>
              Enhance your broadband connection with our entertainment, live TV, and enterprise network add-ons.
            </p>
          </div>

          <div className={styles.addonsGrid}>
            {ADDONS.map((addon, index) => (
              <div key={index} className={styles.addonCard}>
                <div className={styles.addonIcon} aria-hidden="true">
                  {addon.icon}
                </div>
                <h3 className={styles.addonName}>{addon.name}</h3>
                <p className={styles.addonDesc}>{addon.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Enterprise Lease Lines Cross-Link Banner */}
        <div className={styles.leaseLineBanner}>
          <div className={styles.bannerContent}>
            <h2 className={styles.bannerTitle}>Need Dedicated Bandwidth for Business?</h2>
            <p className={styles.bannerText}>
              Explore our Enterprise Lease Lines featuring 1:1 uncontended symmetrical speeds, 99.9% uptime SLA, and local NOC support.
            </p>
          </div>
          <Link href="/lease-lines/" className={`btn btn-primary ${styles.bannerBtn}`}>
            Explore Lease Lines →
          </Link>
        </div>
      </div>
    </main>
  )
}
