import { BroadbandPlan, FaqItem, BreadcrumbItem } from '@/types'
import { CONTACT_INFO } from '@/data/contact'

const BASE_URL = 'https://jdairnet.com'

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JDAirNet',
    legalName: 'JDAirNet Internet Services',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.svg`,
    description: 'High-speed broadband and dedicated enterprise lease line solutions for homes and businesses.',
    email: CONTACT_INFO.email,
    telephone: CONTACT_INFO.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_INFO.address.street,
      addressLocality: CONTACT_INFO.address.city,
      addressRegion: CONTACT_INFO.address.state,
      postalCode: CONTACT_INFO.address.postalCode,
      addressCountry: 'IN',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: CONTACT_INFO.phone,
        contactType: 'customer service',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
      },
      {
        '@type': 'ContactPoint',
        telephone: `+${CONTACT_INFO.whatsapp}`,
        contactType: 'sales',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi'],
      },
    ],
    sameAs: [
      CONTACT_INFO.socialLinks.facebook || '',
      CONTACT_INFO.socialLinks.instagram || '',
    ].filter(Boolean),
  }
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JDAirNet',
    url: `${BASE_URL}/`,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/plans/?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'JDAirNet',
    image: `${BASE_URL}/og-image.jpg`,
    '@id': `${BASE_URL}/#localbusiness`,
    url: BASE_URL,
    telephone: CONTACT_INFO.phone,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT_INFO.address.street,
      addressLocality: CONTACT_INFO.address.city,
      addressRegion: CONTACT_INFO.address.state,
      postalCode: CONTACT_INFO.address.postalCode,
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '21:00',
      },
    ],
  }
}

export function generateServiceSchema(type: 'broadband' | 'lease-line') {
  if (type === 'broadband') {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Broadband Internet Access',
      provider: {
        '@type': 'Organization',
        name: 'JDAirNet',
        url: BASE_URL,
      },
      name: 'High-Speed Fiber Broadband',
      description: 'Fiber-optic broadband internet for homes and offices with unlimited data and 24/7 support.',
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Uttarakhand, India',
      },
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Dedicated Internet Access (Lease Line)',
    provider: {
      '@type': 'Organization',
      name: 'JDAirNet',
      url: BASE_URL,
    },
    name: 'Enterprise Dedicated Lease Lines',
    description: '1:1 symmetrical dedicated lease lines with 99.9% SLA, low latency, and static IP pool for businesses.',
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Uttarakhand, India',
    },
  }
}

export function generatePlansItemListSchema(plans: BroadbandPlan[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'JDAirNet Broadband Plans',
    description: 'High-speed broadband plans for homes and offices',
    url: `${BASE_URL}/plans/`,
    numberOfItems: plans.length,
    itemListElement: plans.map((plan, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: `JDAirNet ${plan.name} Plan`,
        description: `${plan.speed} broadband — ${plan.features.join(', ')}`,
        offers: {
          '@type': 'Offer',
          price: plan.price,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          seller: { '@type': 'Organization', name: 'JDAirNet' },
        },
      },
    })),
  }
}

export function generateFAQSchema(faqs: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  }
}

export function generateWebPageSchema(input: {
  type: 'WebPage' | 'AboutPage' | 'ContactPage'
  name: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': input.type,
    name: input.name,
    description: input.description,
    url: input.url.startsWith('http') ? input.url : `${BASE_URL}${input.url}`,
    isPartOf: { '@type': 'WebSite', url: `${BASE_URL}/` },
    publisher: { '@type': 'Organization', name: 'JDAirNet' },
  }
}

export function generateArticleSchema(input: {
  headline: string
  description: string
  slug: string
  datePublished: string
  dateModified?: string
  authorName?: string
  imageUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.headline,
    description: input.description,
    url: `${BASE_URL}/blog/${input.slug}/`,
    datePublished: input.datePublished,
    dateModified: input.dateModified || input.datePublished,
    author: {
      '@type': 'Person',
      name: input.authorName || 'JDAirNet Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'JDAirNet',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.svg`,
      },
    },
    image: input.imageUrl ? `${BASE_URL}${input.imageUrl}` : `${BASE_URL}/og-image.jpg`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${input.slug}/`,
    },
  }
}
