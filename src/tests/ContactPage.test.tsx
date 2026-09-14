import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import ContactPage from '@/app/contact/page'
import { CONTACT_INFO } from '@/data/contact'
import {
  generateWebPageSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
} from '@/lib/schemaGenerators'

describe('ContactPage & Schema', () => {
  it('generates ContactPage, LocalBusiness, and Breadcrumb schemas', () => {
    const contactSchema = generateWebPageSchema({
      type: 'ContactPage',
      name: 'Contact JDAirNet | Customer Support & Sales',
      description: 'Get in touch with JDAirNet via phone, WhatsApp, or contact form.',
      url: 'https://jdairnet.com/contact/',
    })

    expect(contactSchema['@context']).toBe('https://schema.org')
    expect(contactSchema['@type']).toBe('ContactPage')

    const localBizSchema = generateLocalBusinessSchema()
    expect(localBizSchema['@type']).toBe('LocalBusiness')
    expect(localBizSchema.name).toBe('JDAirNet')

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Contact Us', url: '/contact/' },
    ])
    expect(breadcrumbSchema.itemListElement).toHaveLength(2)
  })

  it('renders H1, all 3 contact channels, office details, and contact form', () => {
    render(<ContactPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /Get in Touch with JDAirNet/i })
    ).toBeInTheDocument()

    // 3 channels: Call, WhatsApp, Email/Office
    const callLinks = screen.getAllByRole('link', { name: CONTACT_INFO.phoneDisplay })
    expect(callLinks.length).toBeGreaterThanOrEqual(1)
    expect(callLinks[0].getAttribute('href')).toMatch(/^tel:/)

    const whatsappLinks = screen.getAllByRole('link', { name: /Chat on WhatsApp/i })
    expect(whatsappLinks.length).toBeGreaterThanOrEqual(1)
    expect(whatsappLinks[0].getAttribute('href')).toMatch(/^https:\/\/wa\.me\//)

    // Business address and hours
    expect(screen.getByText(new RegExp(CONTACT_INFO.address.city, 'i'))).toBeInTheDocument()
    expect(screen.getByText(new RegExp(CONTACT_INFO.businessHours, 'i'))).toBeInTheDocument()

    // Form present
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
  })
})
