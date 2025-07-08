"use client"

import { IssueForm } from "@/components/IssueForm";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/lib/utils";
import { X } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { Sheet, SheetRef } from "react-modal-sheet";

const SNAP_POINTS = [-40, 650, 90];

export default function CreateIssuePage() {
  const sheetRef = useRef<SheetRef>(null);

  const isMobile = useIsMobile();

  const handleClose = () => {
    const sheet = sheetRef.current
    if (sheet) {
      sheet.snapTo(2)
    }
  }

  if (isMobile) {
    return (
      <Sheet ref={sheetRef} isOpen={true} onClose={handleClose} snapPoints={SNAP_POINTS} initialSnap={1}>
        <Sheet.Container className="rounded-t-4xl bg-primary-99">
          <Sheet.Header />
          <Sheet.Content>

            <div className="p-4">
              <div className="flex justify-between mb-4">
                <h1 className="text-2xl">Create Report</h1>
                <Button className="bg-neutral-90 hover:bg-neutral-80 text-neutral-0 ml-4" size="icon" asChild>
                  <Link href={".."}>
                    <X />
                  </Link>
                </Button>
              </div>
              <IssueForm />
            </div>
          </Sheet.Content>
        </Sheet.Container>
      </Sheet>
    )
  }
  return (
    <div className="bg-primary-100 h-full p-4 w-full">
      <IssueForm />
    </div>
  )
}