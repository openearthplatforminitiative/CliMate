"use client"

import { Header } from "@/components/Header"

type IssuesLayoutProps = {
	children: React.ReactNode
}

const IssuesLayout = ({ children }: IssuesLayoutProps) => {
	return (
		<>
			<Header />
			<div className="bg-primary-95">{children}</div>
		</>
	)
}

export default IssuesLayout
