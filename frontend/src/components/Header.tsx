import { MenuButton } from "@/components/MenuButton"

export const Header = () => {
	return (
		<header className="fixed left-0 right-0 top-0 bg-primary-20 z-50 border-b border-b-secondary-98">
			<nav className="mx-auto max-w-[1350px] flex justify-between items-center py-5 px-10">
				<h1 className={`text-2xl text-secondary-98 font-[Newsreader]`}>
					CliMate
				</h1>
				<MenuButton className="bg-secondary-98 text-primary-10" />
			</nav>
		</header>
	)
}
