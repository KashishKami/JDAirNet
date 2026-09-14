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
  title: 'Privacy Policy',
  description:
    'Read the JDAirNet Privacy Policy to understand how we collect, use, and protect your personal information.',
  alternates: {
    canonical: 'https://jdairnet.com/privacy-policy/',
  },
  openGraph: {
    title: 'Privacy Policy | JDAirNet',
    description:
      'Learn how JDAirNet safeguards customer data, subscriber information, and network traffic privacy.',
    url: 'https://jdairnet.com/privacy-policy/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'JDAirNet' }],
  },
}

export default function PrivacyPolicyPage() {
  const webPageSchema = generateWebPageSchema({
    type: 'WebPage',
    name: 'Privacy Policy | JDAirNet',
    description: 'Privacy policy and data protection terms for JDAirNet subscribers.',
    url: '/privacy-policy/',
  })

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Privacy Policy', url: '/privacy-policy/' },
  ])

  return (
    <main className={styles.legalPage}>
      <JsonLd schema={webPageSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <div className={styles.legalContainer}>
        <ScrollReveal y={20} duration={0.6}>
          <div className={styles.header}>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.lastUpdated}>Last Updated: September 2026</p>
          </div>
        </ScrollReveal>

        <ScrollReveal y={25} duration={0.6}>
          <article className={styles.articleCard}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>1. Introduction</h2>
              <p className={styles.paragraph}>
                JDAirNet (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting the
                privacy and confidentiality of personal information provided by our
                subscribers and website visitors. This Privacy Policy details how we
                collect, process, and safeguard your data.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>2. Information We Collect</h2>
              <p className={styles.paragraph}>
                We collect information necessary to deliver high-speed broadband and
                enterprise connectivity services, including:
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <strong>Contact Details:</strong> Full name, telephone number,
                  email address, and physical installation address.
                </li>
                <li className={styles.listItem}>
                  <strong>Identification & KYC:</strong> Government-issued ID proofs
                  mandated by the Department of Telecommunications (DoT) regulations.
                </li>
                <li className={styles.listItem}>
                  <strong>Service Usage Data:</strong> Connection status, bandwidth
                  consumption, and billing records.
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>3. How We Protect Your Data</h2>
              <p className={styles.paragraph}>
                We deploy industry-standard technical encryption and administrative
                access controls to prevent unauthorized access, alteration, or disclosure
                of subscriber records. Customer personal information is never sold or
                rented to third-party marketing entities.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>4. Contact Us Regarding Privacy</h2>
              <p className={styles.paragraph}>
                If you have inquiries or wish to request corrections to your personal
                information, please contact our Data Officer at{' '}
                <strong>info@jdairnet.com</strong>.
              </p>
            </section>
          </article>
        </ScrollReveal>
      </div>
    </main>
  )
}
