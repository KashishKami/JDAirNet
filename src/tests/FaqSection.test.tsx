import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import FaqSection from '@/components/sections/FaqSection'
import { HOME_FAQS } from '@/data/faqs'

describe('FaqSection', () => {
  it('renders section title and eyebrow badge', () => {
    render(<FaqSection />)

    expect(screen.getByRole('heading', { level: 2, name: /Frequently Asked Questions/i })).toBeInTheDocument()
    expect(screen.getByText(/GOT QUESTIONS\?/i)).toBeInTheDocument()
  })

  it('renders all FAQ questions from data store', () => {
    render(<FaqSection />)

    HOME_FAQS.forEach((faq) => {
      expect(screen.getByText(faq.question)).toBeInTheDocument()
    })
  })

  it('toggles answer visibility when clicking question accordion buttons', () => {
    render(<FaqSection />)

    const firstQuestionBtn = screen.getByRole('button', { name: new RegExp(HOME_FAQS[0].question, 'i') })
    expect(firstQuestionBtn).toHaveAttribute('aria-expanded', 'false')

    // Click to expand
    fireEvent.click(firstQuestionBtn)
    expect(firstQuestionBtn).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(HOME_FAQS[0].answer)).toBeVisible()

    // Click to collapse
    fireEvent.click(firstQuestionBtn)
    expect(firstQuestionBtn).toHaveAttribute('aria-expanded', 'false')
  })
})
