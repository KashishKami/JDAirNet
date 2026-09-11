import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import WhyUsSection from '@/components/sections/WhyUsSection'

describe('WhyUsSection', () => {
  it('renders section heading and subtitle', () => {
    render(<WhyUsSection />)

    expect(screen.getByRole('heading', { level: 2, name: /Why Choose JDAirNet/i })).toBeInTheDocument()
    expect(screen.getByText(/Engineered for ultra-fast, uninterrupted connectivity/i)).toBeInTheDocument()
  })

  it('renders all 6 core differentiators/features', () => {
    render(<WhyUsSection />)

    expect(screen.getByText(/99.9% Network Uptime/i)).toBeInTheDocument()
    expect(screen.getByText(/Ultra-Low Latency/i)).toBeInTheDocument()
    expect(screen.getByText(/24\/7 Local Support/i)).toBeInTheDocument()
    expect(screen.getByText(/Dual-Band Wi-Fi 6 Routers/i)).toBeInTheDocument()
    expect(screen.getByText(/Symmetric Speeds/i)).toBeInTheDocument()
    expect(screen.getByText(/Zero Hidden FUP/i)).toBeInTheDocument()
  })
})
