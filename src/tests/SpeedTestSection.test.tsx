import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import SpeedTestSection from '@/components/sections/SpeedTestSection'

describe('SpeedTestSection Component', () => {
  beforeEach(() => {
    // Mock global fetch with a readable stream for speed test simulation
    global.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('bytes=0') || url.includes('trace') || url.includes('favicon')) {
        return Promise.resolve(new Response('ok', { status: 200 }))
      }

      // Stream sample bytes
      const sampleChunk = new Uint8Array(200000) // 200KB chunk
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(sampleChunk)
          controller.close()
        },
      })

      return Promise.resolve(new Response(stream, { status: 200 }))
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders section header, gauge, and initial Start Speed Test trigger', () => {
    render(<SpeedTestSection />)

    expect(screen.getByRole('heading', { level: 2, name: /Test Your Internet Speed|Speed Test/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start Speed Test|Test Connection/i })).toBeInTheDocument()
    expect(screen.getByText(/0.0/)).toBeInTheDocument()
  })

  it('progresses through testing state when start button is clicked and displays results with recommendation', async () => {
    render(<SpeedTestSection />)

    const startBtn = screen.getByRole('button', { name: /Start Speed Test|Test Connection/i })
    fireEvent.click(startBtn)

    // Should transition to measuring
    expect(screen.getAllByText(/Testing|Measuring/i).length).toBeGreaterThan(0)

    // Wait for the test to complete
    await waitFor(() => {
      expect(screen.getByText(/Recommended: JDAirNet/i)).toBeInTheDocument()
    }, { timeout: 6000 })

    expect(screen.getByRole('link', { name: /Upgrade to/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Test Again/i })).toBeInTheDocument()
  })
})
