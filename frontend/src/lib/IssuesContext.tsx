"use client"
import { IssueWithImage } from "@/types/issue"
import React, { createContext, ReactNode, useContext, useState } from "react"

interface IssuesContextProps {
	issues: IssueWithImage[]
	setIssues: React.Dispatch<React.SetStateAction<IssueWithImage[]>>
}

const IssueContext = createContext<IssuesContextProps | undefined>(undefined)

export const IssuesProvider = ({ children }: { children: ReactNode }) => {
	const [issues, setIssues] = useState<IssueWithImage[]>([])

	return (
		<IssueContext.Provider value={{ issues, setIssues }}>
			{children}
		</IssueContext.Provider>
	)
}

export const useIssues = () => {
	const context = useContext(IssueContext)
	if (!context) {
		throw new Error("useIssues must be used within a IssuesProvider")
	}
	return context
}
