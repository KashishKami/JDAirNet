import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'

const mockOn = vi.fn()
const mockDestroy = vi.fn()
const mockRaf = vi.fn()
const mockScrollTo = vi.fn()
const mockConstructor = vi.fn()

vi.mock('lenis', () => {
  return {
    default: class MockLenis {
      on = mockOn
      destroy = mockDestroy
      raf = mockRaf
      scrollTo = mockScrollTo
      constructor(options?: Record<string, unknown>) {
        mockConstructor(options)
      }
    },
  }
})



describe('SmoothScrollProvider', () => {
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

  it('renders children correctly', () => {
    render(
      <SmoothScrollProvider>
        <div data-testid="child-element">Test Content</div>
      </SmoothScrollProvider>
    )

    expect(screen.getByTestId('child-element')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('initializes Lenis when prefers-reduced-motion is false', () => {
    render(
      <SmoothScrollProvider>
        <div>Content</div>
      </SmoothScrollProvider>
    )

    expect(mockConstructor).toHaveBeenCalledTimes(1)
  })

  it('does NOT initialize Lenis when prefers-reduced-motion is true', () => {
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

    render(
      <SmoothScrollProvider>
        <div>Content</div>
      </SmoothScrollProvider>
    )

    expect(mockConstructor).not.toHaveBeenCalled()
  })

  it('calls lenis.destroy on unmount', () => {
    const { unmount } = render(
      <SmoothScrollProvider>
        <div>Content</div>
      </SmoothScrollProvider>
    )

    unmount()
    expect(mockDestroy).toHaveBeenCalled()
  })
})

