'use client'

import { useEffect } from 'react'

/**
 * Mounts a CSS class on <body> that hides the shared Navbar, Footer,
 * and FloatingContactHub — used on the 404 page which has its own
 * full-screen layout and needs no chrome.
 */
export default function HideLayoutChrome() {
  useEffect(() => {
    document.body.classList.add('hide-layout-chrome')
    return () => {
      document.body.classList.remove('hide-layout-chrome')
    }
  }, [])

  return null
}
