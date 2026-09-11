import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BASE_URL = 'https://jdairnet.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const isBlogEnabled = process.env.NEXT_PUBLIC_BLOG_ENABLED === 'true'
  const currentDate = new Date().toISOString()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/plans/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/lease-lines/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/coverage/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/about/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/contact/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/privacy-policy/`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms-of-service/`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  if (isBlogEnabled) {
    staticPages.push({
      url: `${BASE_URL}/blog/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    })
  }

  return staticPages
}
