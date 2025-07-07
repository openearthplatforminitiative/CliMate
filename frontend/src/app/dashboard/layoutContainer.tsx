"use client"

import { BottomDrawer } from "@/components/bottom-drawer"
import { EcoMap } from "@/components/EcoMap"
import { Header } from "@/components/Header"
import { MapContainer } from "@/components/map-container"
import { useIsMobile } from "@/lib/utils"

export function LayoutContainer({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <div className="relative h-full w-full flex flex-col">
        <div className="fixed top-0 left-0 right-0 z-10">
          <Header />
        </div>
        <MapContainer>
          <EcoMap />
        </MapContainer>
        <BottomDrawer>
          {children}
        </BottomDrawer>
      </div>
    )
  }
  return (
    <div className="h-screen w-full grid grid-cols-2 overflow-hidden">
      <div className="flex flex-col h-full w-full overflow-y-scroll">
        <div className="sticky top-0 left-0 right-0 z-10">
          <Header />
        </div>
        {children}
      </div>
      <div className="relative w-full h-full">
        <EcoMap />
      </div>
    </div>
  )
}