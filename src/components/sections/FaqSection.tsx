'use client'

import React, { useState, useRef } from 'react'
import { HOME_FAQS } from '@/data/faqs'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import styles from './FaqSection.module.css'

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const accordionRef = useRef<HTMLDivElement>(null)

  useScrollReveal(accordionRef, {
    selector: `.${styles.faqItem}`,
    y: 20,
    stagger: 0.08,
    duration: 0.65,
  })

  const toggleFaq = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-section-title">
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className="badge badge-primary">GOT QUESTIONS?</span>
          </div>
          <h2 id="faq-section-title" className={styles.title}>
            Frequently Asked Questions
          </h2>
          <p className={styles.subtitle}>
            Have questions about setup, plans, or technical details? Find quick answers below or reach out directly to our 24/7 team.
          </p>
        </div>

        {/* Accordion Container */}
        <div ref={accordionRef} className={styles.accordionContainer}>

          {HOME_FAQS.map((faq, index) => {
            const isOpen = openIndex === index
            const questionId = `faq-q-${index}`
            const answerId = `faq-a-${index}`

            return (
              <div
                key={index}
                className={`${styles.faqItem} ${isOpen ? styles.faqItemOpen : ''}`}
              >
                <button
                  type="button"
                  id={questionId}
                  className={styles.questionButton}
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                >
                  <span>{faq.question}</span>
                  <svg
                    className={`${styles.chevronIcon} ${isOpen ? styles.chevronIconOpen : ''}`}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {isOpen && (
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    className={styles.answerWrapper}
                  >
                    <p className={styles.answerText}>{faq.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
