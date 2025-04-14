"use client"
import { IssueWithImage } from "@/types/issue"
import React, {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useState,
} from "react"

interface IssuesContextProps {
	issues: IssueWithImage[]
	setIssues: React.Dispatch<React.SetStateAction<IssueWithImage[]>>
	loading: boolean
	error: Error | null
}

const IssueContext = createContext<IssuesContextProps | undefined>(undefined)

export const IssuesProvider = ({ children }: { children: ReactNode }) => {
	const [issues, setIssues] = useState<IssueWithImage[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const retrievedIssues = await fetch("/api/issue")
				const { data, error } = await retrievedIssues.json()
				if (error) throw error
				setIssues(data)
			} catch (err) {
				setError(err as Error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	return (
		<IssueContext.Provider value={{ issues, setIssues, loading, error }}>
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
