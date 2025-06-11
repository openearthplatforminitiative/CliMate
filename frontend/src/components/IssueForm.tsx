"use client"
import { useCoordinates } from "@/lib/CoordinatesContext"
import { CategorySelect } from "./CatergorySelect"
import { Input } from "./ui/input"
import { ChangeEvent, useState } from "react"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Asset, Category, Issue } from "@/types/issue"
import { useIssues } from "@/lib/IssuesContext"
import { toast } from "sonner"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { Button } from "./ui/button"

interface IssueFormProps {
	setSheetAddOpen: (open: boolean) => void
	setClickedPoint: (point: [number, number] | null) => void
}

export const IssueForm = ({
	setSheetAddOpen,
	setClickedPoint,
}: IssueFormProps) => {
	const [file, setFile] = useState<File | null>(null)
	const [preview, setPreview] = useState<string | null>(null)
	const { coordinates } = useCoordinates()
	const { setIssues } = useIssues()
	const { data: session } = useSession()

	const [issue, setIssue] = useState<Issue>({
		title: "",
		description: "",
		category: "garbage",
		location: { type: "Point", coordinates: coordinates || [0, 0] },
		resolved: false,
	})

	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length > 0) {
			const selectedFile = event.target.files[0]
			setFile(selectedFile)
			setPreview(URL.createObjectURL(selectedFile))
		}
	}

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { id, value } = e.target
		setIssue((prev) => ({
			...prev,
			[id]: value,
		}))
	}

	const handleCategoryChange = (category: Category) => {
		setIssue((prev) => ({
			...prev,
			category,
		}))
	}

	const handleUpload = async () => {
		// todo: get id from issue post success, and upload picture
		try {
			const postData: Issue = {
				title: issue.title,
				description: issue.description,
				category: issue.category,
				location: issue.location,
				user_uuid: session?.user?.id || "",
				resolved: false,
			}

			const response = await fetch("/api/issue", {
				method: "POST",
				body: JSON.stringify(postData),
			})

			if (!response.ok) {
				throw new Error("Failed to upload the issue.")
			}

			const { data }: { data: Issue } = await response.json()
			console.log("Issue uploaded successfully:", data)

			// upload picture
			if (!data.id || !file) {
				throw new Error("No file or issue ID provided")
			}
			const formData = new FormData()
			formData.append("issueId", data.id)
			formData.append("image", file)
			const imageResponse = await fetch("/api/asset", {
				method: "POST",
				body: formData,
			})

			if (!imageResponse.ok) {
				throw new Error("Failed to upload the image.")
			}

			const { data: imageData }: { data: Asset } = await imageResponse.json()
			console.log(imageData)

			// construct Issue
			const issueResult: Issue = {
				...data,
				image_url: imageData.url,
			}

			// set local states
			setIssues((prevIssues: Issue[]) => [...prevIssues, issueResult])
			setSheetAddOpen(false)
			toast("Successfully uploaded report")
			setClickedPoint(null)
		} catch (error) {
			toast("Could not create issue")
			console.error("Error uploading issue:", error)
		}
	}

	return (
		<div>
			<div className="file-upload mt-5">
				<Label htmlFor="picture">Choose or take picture</Label>
				<Input
					id="picture"
					type="file"
					onChange={handleFileChange}
					className="mt-2"
				/>
				{file && <p>Selected file: {file.name}</p>}
				{preview && (
					<Image
						width={32}
						height={32}
						src={preview}
						alt="Preview"
						className="w-32 h-32 object-cover mt-2"
					/>
				)}

				<Input
					id="title"
					type="text"
					placeholder="Title"
					value={issue.title}
					onChange={handleInputChange}
					className="mt-5"
				/>

				<div className="mt-5">
					<CategorySelect
						value={issue.category}
						onChange={handleCategoryChange}
					/>
				</div>
				<Textarea
					id="description"
					placeholder="Description"
					value={issue.description}
					onChange={handleInputChange}
					className="mt-5"
					rows={3}
				/>

				<Button
					onClick={handleUpload}
					disabled={!issue.title || !issue.category || !issue.description}
					className="w-full mt-5 mb-10 bg-primary-20"
				>
					Submit report
				</Button>
			</div>
		</div>
	)
}
