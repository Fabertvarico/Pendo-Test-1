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

    ;(function(apiKey: string){
      (function(p: any,e: any,n: any,d: any,o?: any){var v: string[],w: number,x: number,y: any,z: any;o=p[d]=p[d]||{};o._q=o._q||[];
      v=['initialize','identify','updateOptions','pageLoad','track','trackAgent'];for(w=0,x=v.length;w<x;++w)(function(m: string){
      o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
      y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
      z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
    })('77e1e52f-3a56-4984-95e7-87db40a3ff1a');

    window.pendo.initialize({
      visitor: { id: 'anonymous' },
      account: { id: 'anonymous' },
    })
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.pendo?.pageLoad) {
      window.pendo.pageLoad()
    }
  }, [pathname])

  return null
}