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
					<SheetDescription>
						{session && session.user && (
							<>
								Signed in as {session.user.email} <br />
								<button onClick={() => signOut()}>Sign out</button>
							</>
						)}
						{!session && (
							<>
								Not signed in <br />
								<button onClick={() => signIn()}>Sign in</button>
							</>
						)}
						TODO: User/login, reports/status
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}
