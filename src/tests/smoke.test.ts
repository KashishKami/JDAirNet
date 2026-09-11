import { describe, it, expect } from 'vitest'

describe('Environment Smoke Test', () => {
  it('loads NEXT_PUBLIC_SITE_URL from .env.test', () => {
    expect(process.env.NEXT_PUBLIC_SITE_URL).toBe('http://127.0.0.1:3007')
  })
})
