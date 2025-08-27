"use client"
import { SessionProvider } from "next-auth/react"

type SessionProviderWrapperProps = {
	children: React.ReactNode
}

const SessionProviderWrapper = ({ children }: SessionProviderWrapperProps) => {
	return <SessionProvider>{children}</SessionProvider>
}

export default SessionProviderWrapper
