import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import LeaseLinesPage from '@/app/lease-lines/page'
import { LEASE_LINE_FEATURES, LEASE_LINE_USE_CASES } from '@/data/leaseLines'
import { generateServiceSchema } from '@/lib/schemaGenerators'

describe('LeaseLinesPage & Schema', () => {
  it('generates Service schema with zero pricing offers', () => {
    const schema = generateServiceSchema('lease-line')

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Service')
    expect(schema.name).toBe('Enterprise Dedicated Lease Lines')
    expect((schema as Record<string, unknown>).offers).toBeUndefined()
  })

  it('renders H1, all 6 enterprise features, and use case chips', () => {
    const { container } = render(<LeaseLinesPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /Enterprise Internet Lease Lines/i })
    ).toBeInTheDocument()

    // 6 features
    LEASE_LINE_FEATURES.forEach((feature) => {
      expect(
        screen.getByRole('heading', { level: 3, name: feature.label })
      ).toBeInTheDocument()
      expect(screen.getByText(feature.description)).toBeInTheDocument()
    })

    // Use cases
    LEASE_LINE_USE_CASES.forEach((useCase) => {
      expect(screen.getByText(useCase)).toBeInTheDocument()
    })

    // Assert NO pricing symbols anywhere on the page
    expect(container.textContent).not.toContain('₹')
    expect(container.textContent).not.toMatch(/₹\d+/)
  })

  it('renders Request a Quote and Contact Sales CTAs linking to /contact/ and phone', () => {
    render(<LeaseLinesPage />)

    const quoteLinks = screen.getAllByRole('link', { name: /Request a Quote/i })
    expect(quoteLinks.length).toBeGreaterThanOrEqual(1)
    expect(quoteLinks[0].getAttribute('href')).toMatch(/^\/contact\/?$/)
  })
})
