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
			<div className="relative h-full w-full flex flex-col">
				<div className="fixed top-0 left-0 right-0 z-10">
					<Header />
				</div>
				<div className="sticky inset-0 w-full h-screen">
					<EcoMap />
				</div>
				{children}
			</div>
		)
	}
	return (
		<div className="h-screen w-full flex overflow-hidden">
			<div className="flex flex-col h-full w-1/2 max-w-6xl overflow-y-scroll">
				<div className="sticky top-0 left-0 right-0 z-10">
					<Header />
				</div>
				{children}
			</div>
			<div className="relative h-full grow">
				<EcoMap />
			</div>
		</div>
	)
}
