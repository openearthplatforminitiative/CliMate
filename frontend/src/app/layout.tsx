import type { Metadata } from "next"
import { Newsreader, Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { RootProviders } from "@/components/root-providers"

const inter = Inter({
	subsets: ["latin"],
})

// eslint-disable-next-line
const newsreader = Newsreader({
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "CliMate",
	description: "TODO",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased h-full bg-primary-20`}>
				<RootProviders>
					{children}
					<Toaster />
				</RootProviders>
			</body>
		</html>
	)
}
