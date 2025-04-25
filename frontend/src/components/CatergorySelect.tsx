import { Category } from "@/types/issue"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "./ui/select"

interface CategorySelectProps {
	value: string
	onChange: (category: Category) => void
}

export const CategorySelect = ({ value, onChange }: CategorySelectProps) => {
	const values = [
		{ value: "garbage", title: "Garbage" },
		{ value: "chemicals", title: "Chemicals" },
		{ value: "deforestation", title: "Deforestation" },
		{ value: "destruction", title: "Destruction" },
	]
	return (
		<Select value={value} onValueChange={onChange}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Select a category" />
			</SelectTrigger>
			<SelectContent className="w-full">
				<SelectGroup className="w-full">
					<SelectLabel>Category</SelectLabel>
					{values.map((val, index) => (
						<SelectItem key={index} value={val.value}>
							{val.title}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
