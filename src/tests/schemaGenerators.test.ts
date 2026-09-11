import { describe, it, expect } from 'vitest'
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateLocalBusinessSchema,
  generateServiceSchema,
  generatePlansItemListSchema,
  generateFAQSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  generateArticleSchema,
} from '@/lib/schemaGenerators'
import { BROADBAND_PLANS } from '@/data/plans'
import { HOME_FAQS } from '@/data/faqs'

describe('schemaGenerators', () => {
  it('generates valid Organization schema with ContactPoint array', () => {
    const schema = generateOrganizationSchema()
    expect(schema['@type']).toBe('Organization')
    expect(schema.name).toBe('JDAirNet')
    expect(schema.url).toBe('https://jdairnet.com')
    expect(Array.isArray(schema.contactPoint)).toBe(true)
    expect(schema.contactPoint.length).toBeGreaterThanOrEqual(2)
  })

  it('generates valid WebSite schema with SearchAction', () => {
    const schema = generateWebSiteSchema()
    expect(schema['@type']).toBe('WebSite')
    expect(schema.name).toBe('JDAirNet')
    expect(schema.potentialAction).toBeDefined()
    expect(schema.potentialAction['@type']).toBe('SearchAction')
  })

  it('generates valid LocalBusiness schema', () => {
    const schema = generateLocalBusinessSchema()
    expect(schema['@type']).toBe('LocalBusiness')
    expect(schema.name).toBe('JDAirNet')
    expect(schema.telephone).toBeDefined()
    expect(schema.address).toBeDefined()
    expect(schema.openingHoursSpecification).toBeDefined()
  })

  it('generates valid Service schema for broadband and lease line', () => {
    const broadband = generateServiceSchema('broadband')
    expect(broadband['@type']).toBe('Service')
    expect(broadband.serviceType).toContain('Broadband')

    const leaseLine = generateServiceSchema('lease-line')
    expect(leaseLine['@type']).toBe('Service')
    expect(leaseLine.serviceType).toContain('Lease Line')
  })

  it('generates valid ItemList schema for broadband plans', () => {
    const schema = generatePlansItemListSchema(BROADBAND_PLANS)
    expect(schema['@type']).toBe('ItemList')
    expect(schema.numberOfItems).toBe(BROADBAND_PLANS.length)
    expect(schema.itemListElement.length).toBe(BROADBAND_PLANS.length)
    expect(schema.itemListElement[0].item['@type']).toBe('Product')
  })

  it('generates valid FAQPage schema', () => {
    const schema = generateFAQSchema(HOME_FAQS)
    expect(schema['@type']).toBe('FAQPage')
    expect(schema.mainEntity.length).toBe(HOME_FAQS.length)
    expect(schema.mainEntity[0]['@type']).toBe('Question')
    expect(schema.mainEntity[0].acceptedAnswer['@type']).toBe('Answer')
  })

  it('generates valid BreadcrumbList schema', () => {
    const schema = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Plans', url: '/plans/' },
    ])
    expect(schema['@type']).toBe('BreadcrumbList')
    expect(schema.itemListElement.length).toBe(2)
    expect(schema.itemListElement[0].item).toBe('https://jdairnet.com/')
    expect(schema.itemListElement[1].item).toBe('https://jdairnet.com/plans/')
  })

  it('generates valid WebPage schema for different page types', () => {
    const pageSchema = generateWebPageSchema({
      type: 'AboutPage',
      name: 'About Us',
      description: 'About JDAirNet',
      url: '/about/',
    })
    expect(pageSchema['@type']).toBe('AboutPage')
    expect(pageSchema.name).toBe('About Us')
    expect(pageSchema.url).toBe('https://jdairnet.com/about/')
  })

  it('generates valid Article schema for blog posts', () => {
    const article = generateArticleSchema({
      headline: 'Best Wi-Fi Routers for 2026',
      description: 'A guide to high speed home Wi-Fi.',
      slug: 'best-wifi-routers-2026',
      datePublished: '2026-09-12T00:00:00Z',
    })
    expect(article['@type']).toBe('BlogPosting')
    expect(article.headline).toBe('Best Wi-Fi Routers for 2026')
    expect(article.url).toBe('https://jdairnet.com/blog/best-wifi-routers-2026/')
  })
})
