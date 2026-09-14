import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import ServicesSection from '@/components/sections/ServicesSection'

describe('ServicesSection Component', () => {
  it('renders section container with proper heading and accessibility labels', () => {
    render(<ServicesSection />)
    const section = screen.getByRole('region', { name: /services|solutions/i })
    expect(section).toBeInTheDocument()

    const heading = screen.getByRole('heading', { level: 2, name: /services|solutions/i })
    expect(heading).toBeInTheDocument()
  })

  it('renders all 5 core service offerings with titles and descriptions', () => {
    render(<ServicesSection />)

    expect(screen.getByRole('heading', { level: 3, name: /^Home Broadband$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /^Internet Leased Line$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /^Managed Leased Line$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /^Business Internet$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: /^Managed Wi-Fi Solution$/i })).toBeInTheDocument()
  })

  it('renders correct navigation CTA links to broadband plans and leased lines', () => {
    render(<ServicesSection />)

    const broadbandLinks = screen.getAllByRole('link', { name: /explore plans|view plans|get broadband/i })
    expect(broadbandLinks.length).toBeGreaterThan(0)
    expect(broadbandLinks[0].getAttribute('href')).toMatch(/^\/plans\/?$/)

    const leasedLineLinks = screen.getAllByRole('link', { name: /get leased line|request quote|request wi-fi/i })
    expect(leasedLineLinks.length).toBeGreaterThan(0)
    expect(leasedLineLinks[0].getAttribute('href')).toMatch(/^\/lease-lines\/?$/)
  })

  it('renders the visual feature image', () => {
    const { container } = render(<ServicesSection />)
    const images = container.querySelectorAll('img')
    const hasFeatureImage = Array.from(images).some((img) =>
      img.getAttribute('src')?.includes('Why_choose_us-removebg-preview.png')
    )
    expect(hasFeatureImage).toBe(true)
  })
})
