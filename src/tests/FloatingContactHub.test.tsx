import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import FloatingContactHub from '@/components/ui/FloatingContactHub'
import { gsap } from '@/lib/animations'

describe('FloatingContactHub', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders main trigger button with accessible attributes', () => {
    render(<FloatingContactHub />)

    const triggerBtn = screen.getByRole('button', { name: /Contact Us/i })
    expect(triggerBtn).toBeInTheDocument()
    expect(triggerBtn).toHaveAttribute('aria-expanded', 'false')
    expect(triggerBtn).toHaveAttribute('aria-haspopup', 'menu')
  })

  it('expands menu when trigger is clicked and renders all 3 contact channels', () => {
    render(<FloatingContactHub />)

    const triggerBtn = screen.getByRole('button', { name: /Contact Us/i })
    fireEvent.click(triggerBtn)

    expect(triggerBtn).toHaveAttribute('aria-expanded', 'true')

    // Channel 1: Phone call
    const callLink = screen.getByRole('menuitem', { name: /Call/i })
    expect(callLink).toBeInTheDocument()
    expect(callLink.getAttribute('href')).toMatch(/^tel:/)

    // Channel 2: WhatsApp
    const whatsappLink = screen.getByRole('menuitem', { name: /WhatsApp/i })
    expect(whatsappLink).toBeInTheDocument()
    expect(whatsappLink.getAttribute('href')).toMatch(/^https:\/\/wa\.me\//)

    // Channel 3: Contact Form
    const formLink = screen.getByRole('menuitem', { name: /Form|Message/i })
    expect(formLink).toBeInTheDocument()
    expect(formLink.getAttribute('href')).toMatch(/^\/contact\/?$/)
  })



  it('closes menu when Escape key is pressed', () => {
    render(<FloatingContactHub />)

    const triggerBtn = screen.getByRole('button', { name: /Contact Us/i })
    fireEvent.click(triggerBtn)
    expect(triggerBtn).toHaveAttribute('aria-expanded', 'true')

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(triggerBtn).toHaveAttribute('aria-expanded', 'false')
  })

  it('initializes perpetual GSAP bounce animation when prefers-reduced-motion is false', () => {
    const timelineSpy = vi.spyOn(gsap, 'timeline')
    render(<FloatingContactHub />)

    expect(timelineSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        repeat: -1,
      })
    )
  })

  it('does NOT initialize perpetual GSAP bounce when prefers-reduced-motion is true', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))

    const timelineSpy = vi.spyOn(gsap, 'timeline')
    render(<FloatingContactHub />)

    expect(timelineSpy).not.toHaveBeenCalled()
  })
})

