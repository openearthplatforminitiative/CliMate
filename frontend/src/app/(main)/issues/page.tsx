import { CardList } from "@/components/CardList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Issues = () => {
	return (
		<>
			<div className="flex flex-col w-full min-h-screen bg-secondary-95 items-center">
				<Tabs defaultValue="account" className="w-full items-center mt-2">
					<TabsList className="bg-primary-10">
						<TabsTrigger value="account" className="border-0">
							Not resolved
						</TabsTrigger>
						<TabsTrigger value="password" className="border-0">
							Resolved
						</TabsTrigger>
					</TabsList>
					<TabsContent value="account" className="w-full">
						<CardList />
					</TabsContent>
					<TabsContent value="password">Change your password here.</TabsContent>
				</Tabs>
			</div>
		</>
	)
}

export default Issues
