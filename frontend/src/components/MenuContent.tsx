import { Button } from "./ui/button"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
type MenuItem = {
	title: string
	path: string
}

const MENU_ITEMS: MenuItem[] = [
	{ title: "Home", path: "/" },
	{ title: "Map", path: "/dashboard" },
	{ title: "Issues", path: "/dashboard/issues" },
	{ title: "Events", path: "/dashboard/events" },
]

export const MenuContent = () => {
	const { data: session } = useSession()
	return (
		<div className="flex flex-col justify-between h-full">
			{/* Navigation Links */}
			<div className="flex flex-col items-center w-full gap-1">
				{MENU_ITEMS.map((item) => {
					return (
						<Link href={item.path} className="w-full" key={item.title}>
							<Button className="bg-primary-20 hover:bg-primary-10 w-full">
								{item.title}
							</Button>
						</Link>
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
						<Button
							onClick={() => signOut()}
							className="bg-primary-20 hover:bg-primary-10 w-full"
						>
							Sign out
						</Button>
					</>
				)}
				{!session && (
					<>
						<span className="text-sm text-gray-500">Not signed in</span>
						<Button
							onClick={() => signIn()}
							className="bg-primary-20 hover:bg-primary-10 w-full"
						>
							Sign in
						</Button>
					</>
				)}
			</div>
			{/* TODO: User/login, your reports/status */}
		</div>
	)
}
