import '@testing-library/jest-dom/vitest'
import { vi, afterEach } from 'vitest'
import { gsap } from 'gsap'

vi.mock('gsap/ScrollTrigger', () => {
  const dummyScrollTrigger = {
    register: vi.fn(),
    getAll: vi.fn(() => []),
    killAll: vi.fn(),
    clearMatchMedia: vi.fn(),
    config: vi.fn(),
    update: vi.fn(),
    create: vi.fn(() => ({ kill: vi.fn() })),
    refresh: vi.fn(),
  }
  return {
    ScrollTrigger: dummyScrollTrigger,
    default: dummyScrollTrigger,
  }
})

const rafPolyfill = (callback: FrameRequestCallback) =>
  setTimeout(() => callback(Date.now()), 0) as unknown as number
const cafPolyfill = (id: number) => clearTimeout(id)

const globalScope = globalThis as typeof globalThis & {
  requestAnimationFrame: (callback: FrameRequestCallback) => number
  cancelAnimationFrame: (id: number) => void
}

globalScope.requestAnimationFrame = rafPolyfill
globalScope.cancelAnimationFrame = cafPolyfill

if (typeof window !== 'undefined') {
  window.requestAnimationFrame = rafPolyfill
  window.cancelAnimationFrame = cafPolyfill

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  })
}

afterEach(() => {
  gsap.killTweensOf('*')
  gsap.globalTimeline?.clear?.()
})


