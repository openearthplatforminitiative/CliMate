"use client";

import { Button } from "@/components/ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetClose, Sheet } from "@/components/ui/sheet";
import { useIsMobile } from "@/lib/utils";
import { Asset, Issue } from "@/types/issue";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { useMap } from "react-map-gl/maplibre";
import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";

export const IssueComponent = ({ issue }: { issue: Issue }) => {
  const isMobile = useIsMobile();
  const navigate = useRouter();
  const map = useMap();

  const [asset, setAsset] = useState<Asset[]>([])

  useEffect(() => {
    if (!issue || !issue.id) return
    const fetchAsset = async () => {
      try {
        const response = await fetch(`/api/asset/${issue.id}`) // Use issueId in the URL
        if (!response.ok) {
          console.error("Failed to fetch asset:", response.statusText)
          throw new Error("Failed to fetch asset")
        }
        const { data }: { data: Asset[] } = await response.json()
        console.log(data)
        setAsset(data)
      } catch (error) {
        toast("Could not fetch asset")
        console.error("Error fetching asset:", error)
      }
    }

    fetchAsset()
  }, [issue])

  useEffect(() => {
    const mapRef = map.ecoMap;
    if (!issue || !mapRef) return;
    mapRef.flyTo({
      center: [issue.location.coordinates[0], issue.location.coordinates[1]],
      zoom: 12,
      duration: 1000,
    });
  }, [issue, map])

  if (issue === undefined || issue === null) return notFound()

  const handleClick = async () => {
    try {
      const putData: Issue = {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        category: issue.category,
        location: issue.location,
        user_uuid: issue.user_uuid,
        active: !issue.active,
      }

      const response = await fetch("/api/issue", {
        method: "PUT",
        body: JSON.stringify(putData),
      })

      if (!response.ok) {
        throw new Error("Failed to upload the issue.")
      }

      const { data }: { data: Issue } = await response.json()
      console.log("Data:", data)
      toast("Successfully updated report")
    } catch (error) {
      toast("Could not update issue")
      console.error("Error updating issue:", error)
    }
  }

  const handleCloseSheet = () => {
    navigate.back();
  };

  console.log(issue)

  const Something = () => (
    <>
      <div className="relative">
        <Button asChild>
          <Link href={".."} className="absolute left-2 top-2">
            <ChevronLeft />
          </Link>
        </Button>
        <Image
          src={asset.length > 0 ? `${asset[0].url}` : "/image-placeholder.png"}
          width={200}
          height={100}
          className="aspect-video w-full object-cover"
          alt="Picture of issue"
        />
      </div>

      <div className="flex flex-col gap-4 p-4 h-full bg-secondary-40 text-secondary-98">
        <h1 className="text-3xl">{issue.title}</h1>
        <div>Category: {issue.category}</div>
        <div>{issue.description}</div>
        <Button
          className="bg-neutral-100 hover:bg-neutral-90 text-secondary-20 self-start"
          onClick={handleClick}
        >
          <Check />
          Set as {issue.active ? "unresolved" : "resolved"}
        </Button>
      </div>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={true} modal={false} onOpenChange={handleCloseSheet}>
        <SheetContent onInteractOutside={e => e.preventDefault()} side="bottom" className="bg-secondary-99">
          <SheetHeader>
            <SheetTitle>{issue.title}</SheetTitle>
            <SheetClose onClick={handleCloseSheet} />
            <Something />
          </SheetHeader>
        </SheetContent>
      </Sheet>
    )
  }
  return (
    <div className="bg-primary-100 h-full w-full">
      <Something />
    </div>
  )
}