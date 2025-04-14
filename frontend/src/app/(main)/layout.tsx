import { IssuesProvider } from "@/lib/IssuesContext"

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return <IssuesProvider>{children}</IssuesProvider>
}
