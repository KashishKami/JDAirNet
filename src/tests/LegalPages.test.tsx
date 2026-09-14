import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import PrivacyPolicyPage from '@/app/privacy-policy/page'
import TermsOfServicePage from '@/app/terms-of-service/page'
import NotFound from '@/app/not-found'

describe('Legal Pages & Custom 404', () => {
  it('renders Privacy Policy page with H1 and data privacy content', () => {
    render(<PrivacyPolicyPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /Privacy Policy/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/Information We Collect/i)).toBeInTheDocument()
    expect(screen.getByText(/How We Protect Your Data/i)).toBeInTheDocument()
  })

  it('renders Terms of Service page with H1 and broadband terms content', () => {
    render(<TermsOfServicePage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /Terms of Service/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/Service Delivery & Installation/i)).toBeInTheDocument()
    expect(screen.getByText(/Fair Usage & Acceptable Use/i)).toBeInTheDocument()
  })

  it('renders custom 404 page with return home CTA', () => {
    render(<NotFound />)

    expect(
      screen.getByRole('heading', { level: 1, name: /404/i })
    ).toBeInTheDocument()
    expect(screen.getByText(/slipped beyond our reach/i)).toBeInTheDocument()

    const homeLink = screen.getByRole('link', { name: /Back to Homepage|Go Home/i })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink.getAttribute('href')).toBe('/')
  })
})
