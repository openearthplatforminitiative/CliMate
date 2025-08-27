import { DashboardProviders } from "@/components/dashboard-providers"
import { LayoutContainer } from "./layoutContainer"

export default function Layout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<DashboardProviders>
			<LayoutContainer>{children}</LayoutContainer>
		</DashboardProviders>
	)
}
