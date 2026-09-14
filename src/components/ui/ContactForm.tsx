'use client'

import React, { useState } from 'react'
import styles from './ContactForm.module.css'

interface FormState {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  phone?: string
  message?: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    service: 'Home Broadband (100 Mbps)',
    message: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [serverMessage, setServerMessage] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formElement = e.currentTarget
    const formValues = new FormData(formElement)
    
    const nameVal = (formValues.get('name') as string || formData.name || '').trim()
    const emailVal = (formValues.get('email') as string || formData.email || '').trim()
    const phoneVal = (formValues.get('phone') as string || formData.phone || '').trim()
    const serviceVal = (formValues.get('service') as string || formData.service || '').trim()
    const messageVal = (formValues.get('message') as string || formData.message || '').trim()

    const nextErrors: FormErrors = {}
    if (!nameVal) {
      nextErrors.name = 'Name is required'
    }
    if (!emailVal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
      nextErrors.email = 'Valid email is required'
    }
    if (!messageVal) {
      nextErrors.message = 'Message is required'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    setServerMessage('')

    try {
      const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || '/contact.php'
      
      const body = new FormData()
      body.append('name', nameVal)
      body.append('email', emailVal)
      body.append('phone', phoneVal)
      body.append('service', serviceVal)
      body.append('message', messageVal)

      const response = await fetch(endpoint, {
        method: 'POST',
        body,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus('success')
        setServerMessage(
          data.message || 'Thank you! Your message has been sent successfully.'
        )
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: 'Home Broadband (100 Mbps)',
          message: '',
        })
      } else {
        setSubmitStatus('error')
        setServerMessage(
          data.message || 'Failed to send message. Please call us directly.'
        )
      }
    } catch {
      setSubmitStatus('error')
      setServerMessage('Failed to send message. Please call us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.formWrapper}>
      <h2 className={styles.formTitle}>Send Us a Message</h2>
      <p className={styles.formSubtitle}>
        Fill in your details below and our team will get back to you within 2 hours.
      </p>

      {submitStatus === 'success' && (
        <div className={styles.alertSuccess} role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>{serverMessage}</span>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className={styles.alertError} role="alert">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{serverMessage}</span>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email Address <span className={styles.requiredAsterisk}>*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="e.g. rahul@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="phone" className={styles.label}>
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={styles.input}
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="service" className={styles.label}>
              Service Required
            </label>
            <select
              id="service"
              name="service"
              className={styles.select}
              value={formData.service}
              onChange={handleChange}
            >
              <option value="Starter Broadband (50 Mbps)">Starter Broadband (50 Mbps)</option>
              <option value="Home Broadband (100 Mbps)">Home Broadband (100 Mbps)</option>
              <option value="Power Broadband (200 Mbps)">Power Broadband (200 Mbps)</option>
              <option value="Ultra Broadband (500 Mbps)">Ultra Broadband (500 Mbps)</option>
              <option value="Enterprise Dedicated Lease Line">Enterprise Dedicated Lease Line</option>
              <option value="General Support / Feasibility">General Support / Feasibility</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.label}>
            Message <span className={styles.requiredAsterisk}>*</span>
          </label>
          <textarea
            id="message"
            name="message"
            className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
            placeholder="Tell us about your requirements, address, or questions..."
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && <span className={styles.errorMessage}>{errors.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={styles.submitBtn}
        >
          {isSubmitting ? (
            'Sending Message...'
          ) : (
            <>
              <span>Send Message</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
