import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import PlansPage from '@/app/plans/page'
import { BROADBAND_PLANS } from '@/data/plans'
import { generatePlansItemListSchema } from '@/lib/schemaGenerators'

describe('PlansPage & Schema', () => {
  it('generates valid ItemList schema for all broadband plans', () => {
    const schema = generatePlansItemListSchema(BROADBAND_PLANS)

    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('ItemList')
    expect(schema.numberOfItems).toBe(4)
    expect(schema.itemListElement).toHaveLength(4)

    schema.itemListElement.forEach((item, idx) => {
      expect(item['@type']).toBe('ListItem')
      expect(item.position).toBe(idx + 1)
      expect(item.item['@type']).toBe('Product')
      expect(item.item.name).toContain(BROADBAND_PLANS[idx].name)
      expect(item.item.offers.price).toBe(BROADBAND_PLANS[idx].price)
      expect(item.item.offers.priceCurrency).toBe('INR')
    })
  })

  it('renders all 4 broadband plan cards and section headings', () => {
    render(<PlansPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /Broadband Plans/i })
    ).toBeInTheDocument()

    BROADBAND_PLANS.forEach((plan) => {
      expect(
        screen.getByRole('heading', { level: 3, name: plan.name })
      ).toBeInTheDocument()
      expect(screen.getByText(plan.speed)).toBeInTheDocument()
    })
  })

  it('renders GST disclaimer text', () => {
    render(<PlansPage />)
    expect(screen.getByText(/prices exclude 18% GST/i)).toBeInTheDocument()
  })

  it('renders available add-ons section', () => {
    render(<PlansPage />)
    expect(
      screen.getByRole('heading', { level: 2, name: /Available Add-ons/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Watcho OTT' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Pioneer IPTV' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'Static IP' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 3, name: 'HD Streaming' })
    ).toBeInTheDocument()
  })
})
