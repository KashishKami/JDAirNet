'use client'

import React from 'react'
import { BroadbandPlan } from '@/types'
import { CONTACT_INFO } from '@/data/contact'
import styles from './PlanCard.module.css'

interface PlanCardProps {
  plan: BroadbandPlan
}

export default function PlanCard({ plan }: PlanCardProps) {
  const isHighlighted = plan.highlighted

  const getCtaHref = () => {
    if (plan.ctaType === 'whatsapp') {
      const message = `Hello JDAirNet, I would like to inquire about the ${plan.name} (${plan.speed}) plan.`
      return `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(message)}`
    }
    // Default or 'call'
    return `tel:${CONTACT_INFO.phone}`
  }

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

      {/* CTA Button */}
      <div className={styles.cardAction}>
        <a
          href={getCtaHref()}
          className={`btn ${isHighlighted ? 'btn-primary' : styles.cardBtnSecondary} ${styles.cardBtn}`}
          aria-label={`${plan.ctaLabel} - ${plan.name} ${plan.speed}`}
        >
          {plan.ctaLabel} →
        </a>
      </div>
    </div>
  )
}
