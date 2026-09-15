'use client'

import React, { useRef } from 'react'
import { useScrollReveal, type ScrollRevealOptions } from '@/hooks/useScrollReveal'

interface ScrollRevealProps extends ScrollRevealOptions {
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}

export default function ScrollReveal({
  children,
  className,
  as: Tag = 'div',
  selector,
  y = 16,
  scale = 0.98,
  duration = 0.5,
  stagger = 0.08,
  start = 'top 95%',
  ease = 'power2.out',
  enabled,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useScrollReveal(containerRef, {
    selector,
    y,
    scale,
    duration,
    stagger,
    start,
    ease,
    enabled,
  })

  const ComponentTag = Tag as React.ElementType

  return (
    <ComponentTag ref={containerRef} className={className}>
      {children}
    </ComponentTag>
  )
}
