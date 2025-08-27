"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MapPage() {
	const router = useRouter()

	useEffect(() => {
		router.push("/dashboard/issues")
	})
}
