import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'
import ScrollReveal from '@/components/ui/ScrollReveal'

describe('ScrollReveal Component', () => {
  it('renders children correctly', () => {
    render(
      <ScrollReveal>
        <div data-testid="child-item">Animated Content</div>
      </ScrollReveal>
    )

    expect(screen.getByTestId('child-item')).toBeInTheDocument()
    expect(screen.getByText('Animated Content')).toBeInTheDocument()
  })

  it('passes custom className to wrapper', () => {
    const { container } = render(
      <ScrollReveal className="custom-wrapper">
        <span>Item</span>
      </ScrollReveal>
    )

    expect(container.firstChild).toHaveClass('custom-wrapper')
  })
})
