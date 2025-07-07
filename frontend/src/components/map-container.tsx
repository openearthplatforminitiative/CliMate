"use client"

import { useState, useEffect } from "react"

export const MapContainer = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [bottomPosition, setBottomPosition] = useState(124)

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const height = window.innerHeight
          const scrollY = window.scrollY

          const newBottomPosition = scrollY
          setBottomPosition(newBottomPosition > height / 2 ? height / 2 : newBottomPosition)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="sticky top-0 h-screen max-h-[calc(90vh-100px)]">
      <div style={{ bottom: bottomPosition }} className={`translate-all absolute top-0 left-0 right-0`}>
        {children}
      </div>
    </div>
  )
}