import { describe, it, expect } from 'vitest'
import { BROADBAND_PLANS } from '@/data/plans'

describe('plans data integrity', () => {
  it('contains exactly 4 broadband plan tiers', () => {
    expect(BROADBAND_PLANS).toHaveLength(4)
  })

  it('every plan has all required properties and valid values', () => {
    BROADBAND_PLANS.forEach((plan) => {
      expect(plan.id).toBeTruthy()
      expect(plan.name).toBeTruthy()
      expect(plan.speed).toMatch(/\d+\s*Mbps/)
      expect(plan.price).toBeGreaterThan(0)
      expect(plan.priceDisplay).toMatch(/^₹/)
      expect(Array.isArray(plan.features)).toBe(true)
      expect(plan.features.length).toBeGreaterThan(0)
      expect(Array.isArray(plan.addons)).toBe(true)
      expect(plan.ctaLabel).toBeTruthy()
      expect(['call', 'whatsapp', 'form']).toContain(plan.ctaType)
    })
  })

  it('has exactly one highlighted plan (Most Popular)', () => {
    const highlightedPlans = BROADBAND_PLANS.filter((p) => p.highlighted)
    expect(highlightedPlans).toHaveLength(1)
    expect(highlightedPlans[0].badge).toBe('Most Popular')
  })
})
