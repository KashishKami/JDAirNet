import React from 'react'

interface JsonLdProps {
  schema?: Record<string, unknown> | Array<Record<string, unknown>>
  data?: Record<string, unknown> | Array<Record<string, unknown>>
}

export default function JsonLd({ schema, data }: JsonLdProps) {
  const content = schema || data
  if (!content) return null

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(content) }}
    />
  )
}
