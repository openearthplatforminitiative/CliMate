import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"

interface MenuButtonProps
	extends DetailedHTMLProps<
		ButtonHTMLAttributes<HTMLButtonElement>,
		HTMLButtonElement
	> {
	className?: string
}

export const MenuButton = ({ className }: MenuButtonProps) => {
	const { data: session } = useSession()

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button className={cn("top-4 right-4 z-10", className)}>Menu</Button>
			</SheetTrigger>
			<SheetContent side="right" className="bg-secondary-99">
				<SheetHeader className="h-full">
					<SheetTitle>Menu</SheetTitle>
					<div className="flex flex-col justify-between h-full">
						{/* Navigation Links */}
						<div className="flex flex-col items-center w-full gap-1">
							<Link href="/" className="w-full">
								<Button className="bg-primary-20 hover:bg-primary-10 w-full">
									Home
								</Button>
							</Link>
							<Link href="/map" className="w-full">
								<Button className="bg-primary-20 hover:bg-primary-10 w-full">
									Map
								</Button>
							</Link>
							<Link href="/dashboard/issues" className="w-full">
								<Button className="bg-primary-20 hover:bg-primary-10 w-full">
									Issues
								</Button>
							</Link>
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
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}
