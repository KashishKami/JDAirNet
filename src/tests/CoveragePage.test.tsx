import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import CoveragePage from '@/app/coverage/page'
import { generateWebPageSchema, generateBreadcrumbSchema } from '@/lib/schemaGenerators'

describe('CoveragePage & Schema', () => {
  it('generates WebPage and Breadcrumb schemas correctly for coverage', () => {
    const webPageSchema = generateWebPageSchema({
      type: 'WebPage',
      name: 'Network Coverage Areas | JDAirNet',
      description: 'Check high-speed fiber broadband and lease-line coverage in your area.',
      url: 'https://jdairnet.com/coverage/',
    })

    expect(webPageSchema['@context']).toBe('https://schema.org')
    expect(webPageSchema['@type']).toBe('WebPage')
    expect(webPageSchema.name).toContain('Coverage')

    const breadcrumbSchema = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Coverage', url: '/coverage/' },
    ])
    expect(breadcrumbSchema.itemListElement).toHaveLength(2)
    expect(breadcrumbSchema.itemListElement[1].name).toBe('Coverage')
  })

  it('renders H1, service areas, feasibility checker info, and CTAs', () => {
    render(<CoveragePage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /Network Coverage & Service Areas/i })
    ).toBeInTheDocument()

    // Key regions / service features
    expect(screen.getByText(/Residential & Society Coverage/i)).toBeInTheDocument()
    expect(screen.getByText(/Commercial & Enterprise Corridors/i)).toBeInTheDocument()

    // Feasibility check / Contact CTA
    const checkFeasibilityLinks = screen.getAllByRole('link', { name: /Check Feasibility/i })
    expect(checkFeasibilityLinks.length).toBeGreaterThanOrEqual(1)
    expect(checkFeasibilityLinks[0].getAttribute('href')).toMatch(/^\/contact\/?$/)

    // Call CTA
    const callLinks = screen.getAllByRole('link', { name: /Call Support/i })
    expect(callLinks.length).toBeGreaterThanOrEqual(1)
    expect(callLinks[0].getAttribute('href')).toMatch(/^tel:/)
  })
})
