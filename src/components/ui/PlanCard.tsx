'use client'

import React from 'react'
import Link from 'next/link'
import { BroadbandPlan } from '@/types'
import { CONTACT_INFO } from '@/data/contact'
import styles from './PlanCard.module.css'

interface PlanCardProps {
  plan: BroadbandPlan
}

export default function PlanCard({ plan }: PlanCardProps) {
  const isHighlighted = plan.highlighted
  const waMessage = `Hello JDAirNet, I would like to inquire about the ${plan.name} (${plan.speed}) plan.`

  return (
    <div className={`${styles.card} ${isHighlighted ? styles.highlighted : ''}`}>
      {/* Top Center Badge if present */}
      {plan.badge && (
        <div className={styles.badgeContainer}>
          <span className={styles.cardBadge}>★ {plan.badge}</span>
        </div>
      )}

      {/* Plan Header - Centered Name & Speed */}
      <div className={styles.cardHeader}>
        <h3 className={styles.planName}>{plan.name}</h3>
        <div className={styles.speedDisplay}>
          <span>{plan.speed}</span>
        </div>
      </div>

      {/* Price - Centered with /mo and GST note */}
      <div className={styles.priceContainer}>
        <div className={styles.priceRow}>
          <span className={styles.price}>{plan.priceDisplay}</span>
          <span className={styles.priceUnit}>/mo</span>
        </div>
        <span className={styles.pricePeriod}>+ 18% GST</span>
      </div>

      {/* Divider */}
      <div className={styles.divider} aria-hidden="true" />

      {/* Features list */}
      <ul className={styles.featuresList}>
        {plan.features.map((feature, idx) => (
          <li key={idx} className={styles.featureItem}>
            <svg
              className={styles.checkIcon}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* 3 Contact Options in One Horizontal Line */}
      <div className={styles.cardActions}>
        {/* Option 1: Call Us */}
        <a
          href={`tel:${CONTACT_INFO.phone}`}
          className={`${styles.actionBtn} ${styles.callBtn}`}
          aria-label={`Call Us for ${plan.name} ${plan.speed}`}
          title="Call Us"
        >
          <svg
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
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>

        {/* Option 2: WhatsApp */}
        <a
          href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(waMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${styles.actionBtn} ${styles.whatsappBtn}`}
          aria-label={`WhatsApp for ${plan.name} ${plan.speed}`}
          title="WhatsApp"
        >
          <svg
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
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          </svg>
        </a>

        {/* Option 3: Send Message */}
        <Link
          href={`/contact/?plan=${encodeURIComponent(plan.id)}`}
          className={`${styles.actionBtn} ${styles.messageBtn}`}
          aria-label={`Send Message for ${plan.name} ${plan.speed}`}
          title="Send Message"
        >
          <svg
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
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
