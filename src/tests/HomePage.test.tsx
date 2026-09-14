import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import HomePage from '@/app/page'

describe('HomePage', () => {
  it('renders all 5 core sections: Hero, Plans Preview, Why Us, FAQs, and Contact CTA', () => {
    const { container } = render(<HomePage />)

    // Hero section
    expect(screen.getByRole('heading', { level: 1, name: /Best Internet Services In Your Region/i })).toBeInTheDocument()

    // Plans Preview section
    expect(screen.getByRole('heading', { level: 2, name: /Popular Broadband Plans/i })).toBeInTheDocument()

    // Why Us section
    expect(screen.getByRole('heading', { level: 2, name: /Why Choose Us/i })).toBeInTheDocument()

    // FAQ section
    expect(screen.getByRole('heading', { level: 2, name: /Frequently Asked Questions/i })).toBeInTheDocument()

    // Contact CTA section
    expect(screen.getByRole('heading', { level: 2, name: /Ready for Blazing Fast Internet\?/i })).toBeInTheDocument()

    // JSON-LD scripts
    const jsonLdScripts = container.querySelectorAll('script[type="application/ld+json"]')
    expect(jsonLdScripts.length).toBeGreaterThanOrEqual(2)
  })
})
