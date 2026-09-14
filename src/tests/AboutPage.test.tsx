import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import AboutPage from '@/app/about/page'
import { generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/schemaGenerators'

describe('AboutPage & Schema', () => {
  it('generates AboutPage schema and Breadcrumb schema correctly', () => {
    const aboutSchema = generateWebPageSchema({
      type: 'AboutPage',
      name: 'About JDAirNet | Next-Gen Fiber & Lease Lines',
      description: 'Learn about JDAirNet, our mission, values, and fiber network infrastructure.',
      url: 'https://jdairnet.com/about/',
    })

    expect(aboutSchema['@context']).toBe('https://schema.org')
    expect(aboutSchema['@type']).toBe('AboutPage')
    expect(aboutSchema.name).toContain('About')

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'About Us', url: '/about/' },
    ])
    expect(breadcrumbSchema.itemListElement).toHaveLength(2)
    expect(breadcrumbSchema.itemListElement[1].name).toBe('About Us')
  })

  it('renders H1, mission, core values, and network highlights', () => {
    render(<AboutPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /Connecting Communities with Gigabit Fiber/i })
    ).toBeInTheDocument()

    // Core company values
    expect(screen.getByText(/Ultra-Low Latency/i)).toBeInTheDocument()
    expect(screen.getByText(/99.9% Uptime Commitment/i)).toBeInTheDocument()
    expect(screen.getByText(/Local On-Ground NOC/i)).toBeInTheDocument()
    expect(screen.getByText(/Zero Hidden Charges/i)).toBeInTheDocument()

    // Key stats / milestones
    expect(screen.getByText(/100% Optical Fiber/i)).toBeInTheDocument()
    expect(screen.getByText(/24\/7 Local Engineers/i)).toBeInTheDocument()

    // Contact CTA
    const contactLinks = screen.getAllByRole('link', { name: /Get in Touch/i })
    expect(contactLinks.length).toBeGreaterThanOrEqual(1)
    expect(contactLinks[0].getAttribute('href')).toMatch(/^\/contact\/?$/)
  })
})
