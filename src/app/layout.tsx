import type { Metadata, Viewport } from 'next'
import { Unbounded, Kanit, Poppins } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FloatingContactHub from '@/components/ui/FloatingContactHub'
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider'
import JsonLd from '@/components/seo/JsonLd'
import { generateOrganizationSchema, generateWebSiteSchema } from '@/lib/schemaGenerators'
import '@/styles/globals.css'

const unbounded = Unbounded({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display-family',
  display: 'swap',
})

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading-family',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body-family',
  display: 'swap',
})

export const viewport: Viewport = {
  themeColor: '#0a0a1a',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://jdairnet.com'),
  title: {
    default: 'JDAirNet | Fast Broadband & Enterprise Lease Lines',
    template: '%s | JDAirNet',
  },
  description:
    'JDAirNet delivers ultra-fast fiber broadband for homes and dedicated 1:1 symmetrical lease lines for businesses with 99.9% uptime SLA.',
  keywords: [
    'broadband',
    'fiber internet',
    'lease line',
    'enterprise internet',
    'JDAirNet',
    'high speed internet',
    'ISP',
  ],
  authors: [{ name: 'JDAirNet' }],
  creator: 'JDAirNet',
  publisher: 'JDAirNet',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: 'https://jdairnet.com/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://jdairnet.com/',
    siteName: 'JDAirNet',
    title: 'JDAirNet | Fast Broadband & Enterprise Lease Lines',
    description:
      'High-speed fiber broadband and dedicated enterprise lease line solutions with 24/7 support.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'JDAirNet Fast Internet Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JDAirNet | Fast Broadband & Enterprise Lease Lines',
    description:
      'High-speed fiber broadband and dedicated enterprise lease line solutions with 24/7 support.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const orgSchema = generateOrganizationSchema()
  const webSiteSchema = generateWebSiteSchema()

  return (
    <html
      lang="en"
      className={`${unbounded.variable} ${kanit.variable} ${poppins.variable}`}
    >
      <head>
        <JsonLd schema={orgSchema} />
        <JsonLd schema={webSiteSchema} />
      </head>
      <body>
        <SmoothScrollProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingContactHub />
        </SmoothScrollProvider>
      </body>
    </html>
  )
}

