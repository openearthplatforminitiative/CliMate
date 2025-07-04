"use client"

import { IssueForm } from "@/components/IssueForm";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/lib/utils";
import { CircleX } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateIssuePage() {
  const isMobile = useIsMobile();
  const navigate = useRouter();

  const handleCloseSheet = () => {
    navigate.back();
  };

  if (isMobile) {
    return (
      <div className="p-4">
        <Button
          variant="ghost"
          className="absolute top-2 right-2 z-10"
          onClick={handleCloseSheet}
        >
          <CircleX />
        </Button>
        <h1 className="text-2xl">Create Report</h1>
        <IssueForm />
      </div>
    )
  }
  return (
    <div className="bg-primary-100 h-full p-4 w-full">
      <IssueForm />
    </div>
  )
}