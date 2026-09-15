import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import HeroSection from '@/components/sections/HeroSection'

describe('HeroSection', () => {
  it('renders full-screen video with required playback and poster attributes', () => {
    const { container } = render(<HeroSection />)
    const video = container.querySelector('video')

    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('autoplay')
    expect(video).toHaveAttribute('loop')
    expect(video).toHaveAttribute('playsinline')
    expect(video).toHaveAttribute('poster', '/hero-poster.jpg')
    expect(video).toHaveAttribute('preload', 'none')

    const sources = video?.querySelectorAll('source')
    expect(sources?.length).toBeGreaterThanOrEqual(1)
    const srcs = Array.from(sources || []).map((s) => s.getAttribute('src'))
    expect(srcs).toContain('/Hero.webm')
    expect(srcs).toContain('/Hero.mp4')
  })

  it('renders eyebrow badge, primary H1, and subtext', () => {
    render(<HeroSection />)

    expect(screen.getByText(/BEST BROADBAND SOLUTION/i)).toBeInTheDocument()
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeInTheDocument()
    expect(h1.textContent?.length).toBeGreaterThan(10)
    expect(screen.getByText(/Lightning-fast fiber internet/i)).toBeInTheDocument()
  })

  it('renders primary CTA linking to /plans/', () => {
    render(<HeroSection />)

    const plansLink = screen.getByRole('link', { name: /View Plans/i })
    expect(plansLink).toBeInTheDocument()
    expect(plansLink.getAttribute('href')).toMatch(/^\/plans\/?$/)
  })
})
