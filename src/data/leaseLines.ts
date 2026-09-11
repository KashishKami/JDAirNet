import { LeaseLineFeature } from '@/types'

export const LEASE_LINE_FEATURES: LeaseLineFeature[] = [
  {
    icon: 'symmetric',
    label: 'Symmetric Speeds',
    description: 'Equal 1:1 upload & download bandwidth for video conferencing, VoIP, and heavy cloud transfers.',
  },
  {
    icon: 'dedicated',
    label: 'Dedicated Bandwidth',
    description: '100% uncontended, dedicated pipe with zero bandwidth sharing or speed throttling during peak hours.',
  },
  {
    icon: 'sla',
    label: '99.9% Uptime SLA',
    description: 'Enterprise-grade Service Level Agreement with guaranteed low latency and priority MTTR resolution.',
  },
  {
    icon: 'security',
    label: 'Enhanced Security & Static IPs',
    description: 'Private, secure fiber route with dedicated pool of static IPv4 / IPv6 addresses and custom routing.',
  },
  {
    icon: 'noc',
    label: '24/7 Local NOC Support',
    description: 'Direct access to level-3 network engineers and local on-ground technical response teams.',
  },
  {
    icon: 'scalable',
    label: 'Scalable Bandwidth',
    description: 'Easily scale your capacity from 50 Mbps up to 10 Gbps as your business operations expand.',
  },
]

export const LEASE_LINE_USE_CASES: string[] = [
  'Corporate Offices & Co-working Spaces',
  'Hostels & Student Accommodations',
  'Colleges & Educational Campuses',
  'Residential High-Rise Societies',
  'Hospitals & Healthcare Facilities',
  'Hotels & Hospitality Resorts',
]
