import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import JsonLd from '@/components/seo/JsonLd'
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from '@/lib/schemaGenerators'
import ScrollReveal from '@/components/ui/ScrollReveal'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Discover JDAirNet — delivering ultra-fast fiber broadband for residences and SLA-guaranteed 1:1 dedicated lease lines for enterprises with 24/7 on-ground support.',
  alternates: {
    canonical: 'https://jdairnet.com/about/',
  },
  openGraph: {
    title: 'About Us | JDAirNet',
    description:
      'Learn about JDAirNet, our mission, values, and fiber network infrastructure.',
    url: 'https://jdairnet.com/about/',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'About JDAirNet',
      },
    ],
  },
}

export default function AboutPage() {
  const aboutSchema = generateWebPageSchema({
    type: 'AboutPage',
    name: 'About JDAirNet | Next-Gen Fiber & Lease Lines',
    description:
      'Learn about JDAirNet, our mission, values, and fiber network infrastructure.',
    url: '/about/',
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'About Us', url: '/about/' },
  ])

  return (
    <main className={styles.aboutPage}>
      {/* SEO Schemas */}
      <JsonLd schema={aboutSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <div className="container">
        {/* Header Section */}
        <ScrollReveal y={24} duration={0.6}>
          <div className={styles.headerSection}>
            <span className={styles.eyebrow}>Our Mission & Vision</span>
            <h1 className={styles.title}>Connecting Communities with Gigabit Fiber</h1>
            <p className={styles.subtitle}>
              JDAirNet was founded with a singular purpose: to deliver dependable,
              ultra-high-speed internet with zero compromises on support, speed,
              or transparency.
            </p>
          </div>
        </ScrollReveal>

        {/* Stats Ribbon */}
        <ScrollReveal selector={`.${styles.statsRibbon} > *`} y={25} stagger={0.08}>
          <div className={styles.statsRibbon}>
            <div className={styles.statBox}>
              <div className={styles.statValue}>100%</div>
              <div className={styles.statLabel}>100% Optical Fiber</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>99.9%</div>
              <div className={styles.statLabel}>Uptime SLA</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>&lt; 15ms</div>
              <div className={styles.statLabel}>Low Gaming Latency</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>24/7</div>
              <div className={styles.statLabel}>24/7 Local Engineers</div>
            </div>
          </div>
        </ScrollReveal>

        {/* Story Section */}
        <ScrollReveal y={24}>
          <section className={styles.storySection}>
            <h2 className={styles.storyHeading}>The JDAirNet Standard</h2>
            <div className={styles.storyBody}>
              <p>
                In today&apos;s digital era, reliable connectivity is as fundamental
                as power or water. From remote professionals running continuous
                video conferences to families streaming 4K entertainment and
                enterprises operating critical cloud workloads, internet downtime
                is simply unacceptable.
              </p>
              <p>
                Unlike legacy providers who rely on congested copper infrastructure
                and distant, automated call centers, JDAirNet operates a direct
                end-to-end fiber-optic ring network backed by certified local
                engineers who respond in person within minutes.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* Core Values Grid */}
        <section className={styles.valuesSection}>
          <ScrollReveal y={20}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>What Drives Us</h2>
              <p className={styles.subtitle}>
                Our core principles define every line we pull and every customer we serve.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal selector={`.${styles.valuesGrid} > *`} y={30} stagger={0.08}>
            <div className={styles.valuesGrid}>
              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <h3 className={styles.valueTitle}>Ultra-Low Latency</h3>
                <p className={styles.valueDesc}>
                  Direct peering with tier-1 internet exchanges ensures lightning-fast
                  routing for gaming, trading, and real-time collaboration.
                </p>
              </div>

              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </div>
                <h3 className={styles.valueTitle}>99.9% Uptime Commitment</h3>
                <p className={styles.valueDesc}>
                  Engineered with automatic failover redundancy rings to guarantee
                  continuous connectivity around the clock.
                </p>
              </div>

              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <h3 className={styles.valueTitle}>Local On-Ground NOC</h3>
                <p className={styles.valueDesc}>
                  Real local technicians available on phone, WhatsApp, and on-site
                  for immediate assistance whenever you need it.
                </p>
              </div>

              <div className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <h3 className={styles.valueTitle}>Zero Hidden Charges</h3>
                <p className={styles.valueDesc}>
                  Clear pricing, truthful speed guarantees, and straightforward
                  terms with no surprise throttling or artificial FUP caps.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* CTA Banner */}
        <ScrollReveal y={30} duration={0.7}>
          <section className={styles.aboutCta}>
            <h2 className={styles.ctaTitle}>Experience the JDAirNet Difference</h2>
            <p className={styles.ctaText}>
              Ready to upgrade your home or business to true gigabit fiber? Reach
              out to our team today for same-day installation feasibility.
            </p>
            <div className={styles.ctaActions}>
              <Link href="/contact/" className={styles.primaryBtn}>
                Get in Touch
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link href="/plans/" className={styles.secondaryBtn}>
                Explore Broadband Plans
              </Link>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </main>
  )
}
