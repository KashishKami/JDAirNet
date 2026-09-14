import React from 'react'
import type { Metadata } from 'next'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import PlansPreview from '@/components/sections/PlansPreview'
import WhyUsSection from '@/components/sections/WhyUsSection'
import SpeedTestSection from '@/components/sections/SpeedTestSection'
import FaqSection from '@/components/sections/FaqSection'
import ContactCTA from '@/components/sections/ContactCTA'
import JsonLd from '@/components/seo/JsonLd'
import { generateWebPageSchema, generateFAQSchema } from '@/lib/schemaGenerators'
import { HOME_FAQS } from '@/data/faqs'

export const metadata: Metadata = {
  title: 'JDAirNet | High-Speed Fiber Broadband & Enterprise Lease Lines',
  description:
    'Experience lightning-fast broadband internet and dedicated lease lines for homes and businesses. Unlimited data, 99.9% uptime, and 24/7 dedicated local support.',
  alternates: {
    canonical: 'https://jdairnet.com/',
  },
  openGraph: {
    title: 'JDAirNet | High-Speed Fiber Broadband & Enterprise Lease Lines',
    description:
      'Experience lightning-fast broadband internet and dedicated lease lines for homes and businesses. Unlimited data, 99.9% uptime, and 24/7 support.',
    url: 'https://jdairnet.com/',
    siteName: 'JDAirNet',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JDAirNet High-Speed Fiber Broadband',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
}

export default function HomePage() {
  const webPageSchema = generateWebPageSchema({
    type: 'WebPage',
    name: 'JDAirNet — High-Speed Fiber Broadband & Enterprise Lease Lines',
    description:
      'Lightning-fast broadband and dedicated lease line solutions for homes and businesses.',
    url: 'https://jdairnet.com/',
  })

  const faqSchema = generateFAQSchema(HOME_FAQS)

  return (
    <main>
      {/* Structured Data */}
      <JsonLd schema={webPageSchema} />
      <JsonLd schema={faqSchema} />

      {/* Page Sections */}
      <HeroSection />
      <ServicesSection />
      <PlansPreview />
      <WhyUsSection />
      <SpeedTestSection />
      <FaqSection />
      <ContactCTA />
    </main>
  )
}
