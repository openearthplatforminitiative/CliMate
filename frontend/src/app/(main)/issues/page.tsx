import { CardList } from "@/components/CardList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Issues = () => {
	return (
		<div className="flex flex-col w-full min-h-screen bg-secondary-95 items-center">
			<Tabs defaultValue="non-resolved" className="w-full items-center mt-2">
				<TabsList className="bg-primary-10 w-3/4">
					<TabsTrigger value="non-resolved" className="border-0">
						Not resolved
					</TabsTrigger>
					<TabsTrigger value="resolved" className="border-0">
						Resolved
					</TabsTrigger>
				</TabsList>
				<TabsContent value="non-resolved" className="w-full">
					<CardList />
				</TabsContent>
				<TabsContent value="resolved" className="w-full">
					<CardList resolved={true} />
				</TabsContent>
			</Tabs>
		</div>
	)
}

export default Issues
