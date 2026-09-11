import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import PlansPreview from '@/components/sections/PlansPreview'

describe('PlansPreview', () => {
  it('renders section title and subtitle', () => {
    render(<PlansPreview />)

    expect(screen.getByRole('heading', { level: 2, name: /Popular Broadband Plans/i })).toBeInTheDocument()
    expect(screen.getByText(/Choose the perfect speed for streaming, gaming, and work/i)).toBeInTheDocument()
  })

  it('renders exactly 3 featured plan cards', () => {
    render(<PlansPreview />)

    expect(screen.getByRole('heading', { level: 3, name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Power' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 3, name: 'Ultra' })).toBeInTheDocument()
  })

  it('renders "View All Plans" link pointing to /plans/', () => {
    render(<PlansPreview />)

    const viewAllLink = screen.getByRole('link', { name: /View All Plans/i })
    expect(viewAllLink).toBeInTheDocument()
    expect(viewAllLink.getAttribute('href')).toMatch(/^\/plans\/?$/)
  })
})
