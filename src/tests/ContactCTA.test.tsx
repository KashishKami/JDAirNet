import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import ContactCTA from '@/components/sections/ContactCTA'
import { CONTACT_INFO } from '@/data/contact'

describe('ContactCTA', () => {
  it('renders call to action headline and description', () => {
    render(<ContactCTA />)

    expect(screen.getByRole('heading', { level: 2, name: /Ready for Blazing Fast Internet\?/i })).toBeInTheDocument()
    expect(screen.getByText(/Get installed within 24–48 hours/i)).toBeInTheDocument()
  })

  it('renders all three conversion channels: Call, WhatsApp, and Online Inquiry', () => {
    render(<ContactCTA />)

    const callLink = screen.getByRole('link', { name: /Call/i })
    expect(callLink).toHaveAttribute('href', `tel:${CONTACT_INFO.phone}`)

    const waLink = screen.getByRole('link', { name: /WhatsApp/i })
    expect(waLink.getAttribute('href')).toContain(`wa.me/${CONTACT_INFO.whatsapp}`)

    const formLink = screen.getByRole('link', { name: /Send Message/i })
    expect(formLink.getAttribute('href')).toMatch(/^\/contact\/?$/)
  })
})
