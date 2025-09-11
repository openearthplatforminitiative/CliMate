import { Button } from "./ui/button"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { SheetTrigger } from "./ui/sheet"
type MenuItem = {
	title: string
	path: string
}

const MENU_ITEMS: MenuItem[] = [
	{ title: "Home", path: "/" },
	{ title: "Dashboard", path: "/dashboard" },
	{ title: "Report Issue", path: "/dashboard/issues/create" },
	{ title: "Create Event", path: "/dashboard/events/create" },
]

export const MenuContent = () => {
	const { data: session } = useSession()
	return (
		<div className="flex flex-col justify-between h-full">
			{/* Navigation Links */}
			<div className="flex flex-col items-center w-full gap-1">
				{MENU_ITEMS.map((item) => {
					return (
						<SheetTrigger asChild key={item.title}>
							<Link href={item.path} className="w-full">
								<Button className="bg-primary-20 hover:bg-primary-10 w-full">
									{item.title}
								</Button>
							</Link>
						</SheetTrigger>
					)
				})}
			</div>

			{/* Session Status */}
			<div className="flex flex-col items-center w-full gap-2">
				{session && session.user && (
					<>
						<span className="text-sm text-gray-500">
							Signed in as {session.user.name}
						</span>
						<SheetTrigger asChild>
							<Button
								onClick={() => signOut()}
								className="bg-primary-20 hover:bg-primary-10 w-full"
							>
								Sign out
							</Button>
						</SheetTrigger>
					</>
				)}
				{!session && (
					<>
						<span className="text-sm text-gray-500">Not signed in</span>
						<SheetTrigger asChild>
							<Button
								onClick={() => signIn("keycloak")}
								className="bg-primary-20 hover:bg-primary-10 w-full"
							>
								Sign in
							</Button>
						</SheetTrigger>
					</>
				)}
			</div>
			{/* TODO: User/login, your reports/status */}
		</div>
	)
}
