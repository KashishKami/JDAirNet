import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import React from 'react'
import ContactForm from '@/components/ui/ContactForm'

describe('ContactForm Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('renders name, email, phone, service selection, message fields and submit button', () => {
    render(<ContactForm />)

    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Service Required/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Send Message|Submit Inquiry/i })
    ).toBeInTheDocument()
  })

  it('validates required fields on submit without calling fetch if invalid', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch')
    render(<ContactForm />)

    const submitBtn = screen.getByRole('button', { name: /Send Message|Submit Inquiry/i })
    fireEvent.click(submitBtn)

    // Form should show validation error messages and NOT call fetch
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Valid email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/Message is required/i)).toBeInTheDocument()
    })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('submits form data to contact endpoint and displays success alert on success', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, message: 'Message sent successfully.' }),
    } as Response)

    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Rahul Sharma' },
    })
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'rahul@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '9876543210' },
    })
    fireEvent.change(screen.getByLabelText(/Service Required/i), {
      target: { value: 'Home Broadband (100 Mbps)' },
    })
    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { value: 'Please check connection availability at Rajpur Road.' },
    })

    const submitBtn = screen.getByRole('button', { name: /Send Message|Submit Inquiry/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\/contact\.php$/),
        expect.objectContaining({
          method: 'POST',
        })
      )
      expect(screen.getByText(/Message sent successfully/i)).toBeInTheDocument()
    })
  })

  it('handles server failure gracefully and displays error alert', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: false,
      json: async () => ({ success: false, message: 'Server error' }),
    } as Response)

    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Rahul Sharma' },
    })
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'rahul@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/Message/i), {
      target: { value: 'Inquiry message.' },
    })

    const submitBtn = screen.getByRole('button', { name: /Send Message|Submit Inquiry/i })
    fireEvent.click(submitBtn)

    await waitFor(() => {
      expect(
        screen.getByText(/Server error/i)
      ).toBeInTheDocument()
    })
  })
})
