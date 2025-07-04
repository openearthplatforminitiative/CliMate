"use client"

import { EcoMap } from "@/components/EcoMap"
import { Header } from "@/components/Header"
import { useIsMobile } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

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
        <div className="sticky top-0 h-screen max-h-[calc(100vh-124px)]">
          <EcoMap />
        </div>
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
      <EcoMap />
    </div>
  )
}

const BottomDrawer = ({ children }: { children: React.ReactNode }) => {
  const isDragging = useRef(false)
  const path = usePathname()

  useEffect(() => {
    console.log("BottomDrawer mounted")
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
    }, 0)
  }, [path])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging.current) {
        window.scrollBy(0, -e.movementY)
      }
    }

    const stopDragging = () => {
      isDragging.current = false
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", stopDragging)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", stopDragging)
    }
  }, [])

  return (
    <div className="relative z-20 w-full min-h-96 h-full max-h-[calc(100vh - 76px)] bg-white shadow-lg bg-primary-99 flex flex-col rounded-t-4xl">
      <div className="group p-4 self-center cursor-pointer"
        onMouseDown={() => {
          isDragging.current = true
        }}
      >
        <div
          className="h-1 w-24 bg-neutral-90 group:hover:bg-neutral-80 rounded-full"
        />
      </div>
      {children}
    </div>
  )
}