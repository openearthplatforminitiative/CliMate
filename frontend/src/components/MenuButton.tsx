import { ButtonHTMLAttributes, DetailedHTMLProps } from "react"
import {
	Sheet,
	SheetContent,
	SheetDescription,
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
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
					<SheetDescription className="flex flex-col">
						<Link href="/">
							<Button className="bg-primary-20 hover:bg-primary-10 mt-1">
								Home
							</Button>
						</Link>
						<Link href="/map">
							<Button className="bg-primary-20 hover:bg-primary-10 mt-1">
								Map
							</Button>
						</Link>
						<Link href="/issues">
							<Button className="bg-primary-20 hover:bg-primary-10 mt-1">
								Issues
							</Button>
						</Link>

						{session && session.user && (
							<>
								You are signed in as {session.user.name} <br />
								<Button
									onClick={() => signOut()}
									className="bg-primary-20 hover:bg-primary-10 mt-1"
								>
									Sign out
								</Button>
							</>
						)}
						{!session && (
							<>
								Not signed in <br />
								<Button
									onClick={() => signIn()}
									className="bg-primary-20 hover:bg-primary-10"
								>
									Sign in
								</Button>
							</>
						)}
						{/* TODO: User/login, your reports/status */}
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}
