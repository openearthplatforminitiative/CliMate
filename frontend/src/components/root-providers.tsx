"use client"

import SessionProviderWrapper from "@/lib/SessionsProviderWrapper"
import { Provider } from "jotai"

export function RootProviders({ children }: { children: React.ReactNode }) {
	return (
		<Provider>
			<SessionProviderWrapper>{children}</SessionProviderWrapper>
		</Provider>
	)
}
