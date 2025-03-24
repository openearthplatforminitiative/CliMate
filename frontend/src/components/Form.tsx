"use client";
import { useCoordinates } from "@/lib/CoordinatesContext";
import { CategorySelect } from "./CatergorySelect";
import { Input } from "./ui/input";
import { ChangeEvent, useState } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

export const Form = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { coordinates } = useCoordinates();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = () => {
    if (file) {
      console.log("Uploading file:", file.name, "at", coordinates);
    }
  };

  return (
    <div>
      {/* <h1 className="text-2xl font-bold">Create report</h1> */}

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

        <Input id="title" type="text" placeholder="Title" className="mt-5" />

        <div className="mt-5">
          <CategorySelect />
        </div>
        <Textarea
          id="description"
          placeholder="Description"
          className="mt-5"
          rows={4} // Adjust the number of rows as needed
        />

        <button
          onClick={handleUpload}
          disabled={!file}
          className="w-full mt-5 mb-10 p-2 bg-[#00391F] text-white rounded"
        >
          Submit report
        </button>
      </div>
    </div>
  );
};
