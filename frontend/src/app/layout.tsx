import type { Metadata } from "next"
import { Newsreader, Inter } from "next/font/google"
import "./globals.css"
import { CoordinatesProvider } from "@/lib/CoordinatesContext"
import { Toaster } from "@/components/ui/sonner"
import SessionProviderWrapper from "@/lib/SessionsProviderWrapper"

const inter = Inter({
	subsets: ["latin"],
})

// eslint-disable-next-line
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
				<SessionProviderWrapper>
					<CoordinatesProvider>{children}</CoordinatesProvider>
					<Toaster />
				</SessionProviderWrapper>
			</body>
		</html>
	)
}
