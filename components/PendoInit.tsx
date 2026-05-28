'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    pendo: any
  }
}

export default function PendoInit() {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.pendo?.isReady?.()) return

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://cdn.pendo.io/agent/static/77e1e52f-3a56-4984-95e7-87db40a3ff1a/pendo.js'

    script.onload = () => {
      window.pendo.initialize({
        visitor: { id: 'anonymous' },
        account: { id: 'anonymous' },
      })
    }

    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.pendo?.pageLoad) {
      window.pendo.pageLoad()
    }
  }, [pathname])

  return null
}