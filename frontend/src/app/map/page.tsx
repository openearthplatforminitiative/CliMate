import { EcoMap } from "@/components/EcoMap"
import { IssuesProvider } from "@/lib/IssuesContext"

const Report = () => {
	return (
		<IssuesProvider>
			<EcoMap />
		</IssuesProvider>
	)
}

export default Report
