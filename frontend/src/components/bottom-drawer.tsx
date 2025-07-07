"use client"

import { usePathname } from "next/navigation"
import { useRef, useEffect } from "react"

export const BottomDrawer = ({ children }: { children: React.ReactNode }) => {
  const isDragging = useRef(false)
  const path = usePathname()

  useEffect(() => {
    const height = window.innerHeight
    window.scrollTo({ top: height / 2 - 124, behavior: "smooth" })
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
    <div className="relative -mt-6 z-20 w-full min-h-96 h-full max-h-[calc(100vh - 76px)] bg-white shadow-lg bg-primary-99 flex flex-col rounded-t-4xl">
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