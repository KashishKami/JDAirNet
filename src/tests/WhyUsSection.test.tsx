import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import WhyUsSection from '@/components/sections/WhyUsSection'

describe('WhyUsSection', () => {
  it('renders section heading and subtitle', () => {
    render(<WhyUsSection />)

    expect(screen.getByRole('heading', { level: 2, name: /Why Choose Us/i })).toBeInTheDocument()
    expect(screen.getByText(/Engineered for ultra-fast, uninterrupted connectivity/i)).toBeInTheDocument()
  })

  it('renders all 6 core differentiators/features', () => {
    render(<WhyUsSection />)

    expect(screen.getAllByText(/99.9% Network Uptime/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Ultra-Low Latency/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/24\/7 Local Support/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Dual-Band Wi-Fi 6 Routers/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Symmetric Speeds/i).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/Zero Hidden FUP/i).length).toBeGreaterThan(0)
  })
})
