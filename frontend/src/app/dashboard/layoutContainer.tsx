"use client"

import { EcoMap } from "@/components/EcoMap"
import { Header } from "@/components/Header"
import { useIsMobile } from "@/lib/utils"

export function LayoutContainer({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="h-full w-full min-h-screen flex flex-col">
        <div className="absolute top-0 left-0 right-0 z-10">
          <Header />
        </div>
        <EcoMap />
        {children}
      </div>
    )
  }
  return (
    <div className="h-full w-full grid grid-cols-2">
      <div className="flex flex-col h-full w-full">
        <Header />
        {children}
      </div>
      <EcoMap />
    </div>
  )
}