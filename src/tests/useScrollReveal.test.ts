import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { gsap } from '@/lib/animations'

describe('useScrollReveal', () => {
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

  it('initializes GSAP context when element ref is provided', () => {
    const el = document.createElement('div')
    const ref = { current: el }
    const contextSpy = vi.spyOn(gsap, 'context')

    const { unmount } = renderHook(() => useScrollReveal(ref, { selector: '.child', enabled: true }))

    expect(contextSpy).toHaveBeenCalled()
    unmount()
  })


  it('skips animations when prefers-reduced-motion is true', () => {
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

    const el = document.createElement('div')
    const ref = { current: el }
    const fromToSpy = vi.spyOn(gsap, 'fromTo')

    renderHook(() => useScrollReveal(ref, { selector: '.child' }))

    expect(fromToSpy).not.toHaveBeenCalled()
  })
})
