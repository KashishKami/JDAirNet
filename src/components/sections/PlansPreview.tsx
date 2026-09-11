'use client'

import React from 'react'
import Link from 'next/link'
import { BROADBAND_PLANS } from '@/data/plans'
import PlanCard from '@/components/ui/PlanCard'
import styles from './PlansPreview.module.css'

export default function PlansPreview() {
  // Show the 3 featured plans (indices 1, 2, 3: Home 100Mbps, Power 200Mbps, Ultra 500Mbps)
  const previewPlans = BROADBAND_PLANS.slice(1, 4)

  return (
    <section className={styles.section} aria-labelledby="plans-preview-title">
      <div className="container">
        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.eyebrow}>
            <span className="badge badge-primary">FIBER PLANS</span>
          </div>
          <h2 id="plans-preview-title" className={styles.title}>
            Popular Broadband Plans
          </h2>
          <p className={styles.subtitle}>
            Choose the perfect speed for streaming, gaming, and work. All plans include unlimited data,
            free high-speed Wi-Fi router, and local 24/7 support.
          </p>
        </div>

        {/* 3-Card Grid */}
        <div className={styles.grid}>
          {previewPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Bottom CTA to view all plans */}
        <div className={styles.actionWrapper}>
          <Link href="/plans/" className={`btn btn-secondary ${styles.allPlansBtn}`}>
            View All Plans →
          </Link>
          <p className={styles.disclaimer}>*All prices are exclusive of 18% GST. Installation charges may apply based on plan terms.</p>
        </div>
      </div>
    </section>
  )
}
