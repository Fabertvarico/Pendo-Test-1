'use client'

import PendoInit from '@/components/PendoInit'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PendoInit />
      {children}
    </>
  )
}