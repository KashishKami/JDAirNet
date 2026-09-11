import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import PlanCard from '@/components/ui/PlanCard'
import { BROADBAND_PLANS } from '@/data/plans'

describe('PlanCard', () => {
  const starterPlan = BROADBAND_PLANS[0]
  const homePlan = BROADBAND_PLANS[1]

  it('renders plan name, speed, and formatted price', () => {
    render(<PlanCard plan={starterPlan} />)

    expect(screen.getByRole('heading', { level: 3, name: starterPlan.name })).toBeInTheDocument()
    expect(screen.getByText(starterPlan.speed)).toBeInTheDocument()
    expect(screen.getByText(starterPlan.priceDisplay)).toBeInTheDocument()
    expect(screen.getByText(/\/month/i)).toBeInTheDocument()
  })

  it('renders all features included in the plan', () => {
    render(<PlanCard plan={starterPlan} />)

    starterPlan.features.forEach((feature) => {
      expect(screen.getByText(feature)).toBeInTheDocument()
    })
  })

  it('does not render badge when highlighted is false', () => {
    render(<PlanCard plan={starterPlan} />)
    expect(screen.queryByText(/Most Popular/i)).not.toBeInTheDocument()
  })

  it('renders "Most Popular" badge when highlighted is true', () => {
    render(<PlanCard plan={homePlan} />)
    expect(screen.getByText(/Most Popular/i)).toBeInTheDocument()
  })

  it('renders CTA button linking to tel: or whatsapp', () => {
    render(<PlanCard plan={homePlan} />)

    const ctaButton = screen.getByRole('link', { name: new RegExp(homePlan.ctaLabel, 'i') })
    expect(ctaButton).toBeInTheDocument()
    const href = ctaButton.getAttribute('href') || ''
    expect(href.startsWith('tel:') || href.startsWith('https://wa.me/')).toBe(true)
  })
})
