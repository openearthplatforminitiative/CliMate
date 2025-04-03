import type { Metadata } from "next"
import { Newsreader, Inter } from "next/font/google"
import "./globals.css"
import { CoordinatesProvider } from "@/lib/CoordinatesContext"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({
	subsets: ["latin"],
})

// ts-ignore
const newsreader = Newsreader({
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "EcoReport",
	description: "TODO",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>
				<CoordinatesProvider>{children}</CoordinatesProvider>
				<Toaster />
			</body>
		</html>
	)
}
