export interface BroadbandPlan {
  id: string
  name: string
  speed: string
  price: number
  priceDisplay: string
  highlighted: boolean
  badge: string | null
  features: string[]
  addons: string[]
  ctaLabel: string
  ctaType: 'call' | 'whatsapp' | 'form'
}

export interface LeaseLineFeature {
  icon: string
  label: string
  description: string
}

export interface ServiceItem {
  id: string
  title: string
  category: 'residential' | 'enterprise'
  tagline: string
  description: string
  features: string[]
  ctaLabel: string
  ctaHref: string
  badge?: string
}

export interface ContactInfo {
  phone: string
  phoneDisplay: string
  whatsapp: string
  whatsappDisplay: string
  whatsappMessage: string
  email: string
  address: {
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  businessHours: string
  googleMapsUrl: string
  socialLinks: {
    instagram?: string
    facebook?: string
    twitter?: string
  }
}

export interface FaqItem {
  question: string
  answer: string
}

export interface BreadcrumbItem {
  name: string
  url: string
}
