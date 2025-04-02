"use client";
import { useCoordinates } from "@/lib/CoordinatesContext";
import { CategorySelect } from "./CatergorySelect";
import { Input } from "./ui/input";
import { ChangeEvent, useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Category, Issue, IssueWithImage } from "@/types/issue";
import { useIssues } from "@/lib/IssuesContext";
import { toast } from "sonner";

interface FormProps {
  setSheetAddOpen: (open: boolean) => void;
  setClickedPoint: (point: [number, number] | null) => void;
}

export const Form = ({ setSheetAddOpen, setClickedPoint }: FormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { coordinates } = useCoordinates();
  const { issues, setIssues } = useIssues();

  const [issue, setIssue] = useState<Issue>({
    title: "",
    description: "",
    category: "Garbage",
    location: { type: "Point", coordinates: coordinates || [0, 0] },
    active: true,
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setIssue((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCategoryChange = (category: Category) => {
    setIssue((prev) => ({
      ...prev,
      category,
    }));
  };

  const handleUpload = async () => {
    try {
      const postData: Issue = {
        title: issue.title,
        description: issue.description,
        category: issue.category,
        location: issue.location,
        user_uuid: "",
        active: true,
      };

      const response = await fetch("/api/issue", {
        method: "POST",
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Failed to upload the issue.");
      }

      const { data }: { data: IssueWithImage } = await response.json();
      console.log("Issue uploaded successfully:", data);
      setIssues((prevIssues: IssueWithImage[]) => [...prevIssues, data]);
      setSheetAddOpen(false);
      toast("Successfully uploaded report");
      setClickedPoint(null);
    } catch (error) {
      console.error("Error uploading issue:", error);
    }
  };

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
          <img
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

        <button
          onClick={handleUpload}
          disabled={!issue.title || !issue.category || !issue.description}
          className="w-full mt-5 mb-10 p-2 bg-[#00391F] text-white rounded"
        >
          Submit report
        </button>
      </div>
    </div>
  );
};
