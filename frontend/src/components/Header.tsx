import { MenuButton } from "@/components/MenuButton"
import Link from "next/link"

export const Header = () => {
	return (
		<header className="w-full bg-transparent lg:bg-primary-20">
			<nav className="mx-auto w-full max-w-[1350px] lg:border-b lg:border-secondary-98 flex justify-between items-center py-5 px-10">
				<Link
					href="/"
					className={`text-2xl font-semibold text-secondary-30 hover:text-secondary-20 lg:text-secondary-98 lg:hover:text-secondary-80 font-[Newsreader]`}>
					CliMate
				</Link>
				<div className="flex items-center gap-5">
					<Link
						href="/dashboard"
						className="hidden lg:block text-secondary-98 hover:text-secondary-80"
					>Dashboard</Link>
					<Link
						href="/dashboard/issues/create"
						className="hidden lg:block text-secondary-98 hover:text-secondary-80"
					>Report Issue</Link>
					<MenuButton className="bg-secondary-98 hover:bg-secondary-80 text-primary-10" />
				</div>
			</nav>
		</header>
	)
}
