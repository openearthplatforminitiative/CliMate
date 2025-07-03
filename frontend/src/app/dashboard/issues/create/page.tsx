"use client"

import { IssueForm } from "@/components/IssueForm";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CreateIssuePage() {
  const isMobile = useIsMobile();
  const navigate = useRouter();

  const handleCloseSheet = () => {
    navigate.back();
  };

  if (isMobile) {
    return (
      <Sheet open={true} modal={false} onOpenChange={handleCloseSheet}>
        <SheetContent onInteractOutside={e => e.preventDefault()} side="bottom" className="bg-secondary-99">
          <SheetHeader>
            <SheetTitle>Create Report</SheetTitle>
            <SheetClose onClick={handleCloseSheet} />
            <IssueForm />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <div className="bg-primary-100 h-full p-4 w-full">
      <IssueForm />
    </div>
  )
}