import { Metadata } from 'next'
import React from 'react'
import JsonLd from '@/components/seo/JsonLd'
import {
  generateWebPageSchema,
  generateBreadcrumbSchema,
} from '@/lib/schemaGenerators'
import ScrollReveal from '@/components/ui/ScrollReveal'
import styles from '@/app/legal.module.css'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Read the JDAirNet Terms of Service covering broadband subscription, equipment provisioning, SLAs, and acceptable usage.',
  alternates: {
    canonical: 'https://jdairnet.com/terms-of-service/',
  },
  openGraph: {
    title: 'Terms of Service | JDAirNet',
    description:
      'Service terms, acceptable usage policy, and billing conditions for JDAirNet internet services.',
    url: 'https://jdairnet.com/terms-of-service/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'JDAirNet' }],
  },
}

export default function TermsOfServicePage() {
  const webPageSchema = generateWebPageSchema({
    type: 'WebPage',
    name: 'Terms of Service | JDAirNet',
    description: 'Terms and conditions for JDAirNet broadband and lease-line services.',
    url: '/terms-of-service/',
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Terms of Service', url: '/terms-of-service/' },
  ])

  return (
    <main className={styles.legalPage}>
      <JsonLd schema={webPageSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <div className={styles.legalContainer}>
        <ScrollReveal y={20} duration={0.6}>
          <div className={styles.header}>
            <h1 className={styles.title}>Terms of Service</h1>
            <p className={styles.lastUpdated}>Last Updated: September 2026</p>
          </div>
        </ScrollReveal>

        <ScrollReveal y={25} duration={0.6}>
          <article className={styles.articleCard}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Agreement to Terms</h2>
              <p className={styles.paragraph}>
                By subscribing to, accessing, or using internet broadband or dedicated
                lease-line connectivity provided by JDAirNet, you agree to be bound
                by these Terms of Service.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Service Delivery & Installation</h2>
              <p className={styles.paragraph}>
                Broadband and lease-line installations are subject to technical and
                optical fiber feasibility at the customer premises. All Customer
                Premises Equipment (CPE) provided on lease (such as fiber ONT routers)
                remains the property of JDAirNet and must be returned in good working
                condition upon service termination.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Fair Usage & Acceptable Use</h2>
              <p className={styles.paragraph}>
                Our unlimited broadband plans provide uncapped data for legitimate
                personal, residential, or business usage. Users agree not to utilize the
                connection for unlawful activities, network attacks, or unauthorized
                commercial redistribution without an Enterprise Lease Line agreement.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Billing & Taxes</h2>
              <p className={styles.paragraph}>
                Broadband subscription charges are billed on a recurring monthly or
                annual cycle in advance. All displayed base rates exclude statutory
                taxes (18% Goods and Services Tax - GST) unless explicitly stated
                otherwise.
              </p>
            </section>
          </article>
        </ScrollReveal>
      </div>
    </main>
  )
}
