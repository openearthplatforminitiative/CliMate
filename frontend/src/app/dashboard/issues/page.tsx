"use client";

import { useIsMobile } from "@/lib/utils";

export default function IssuesPage() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="absolute inset-0 bg-neutral-100">
        <h1 className="text-lg font-bold mt-16">Issues</h1>
        {/* Replace with your mobile issue slider component */}
        <div className="bg-white p-4 rounded shadow">Mobile Issue Slider Placeholder</div>
      </div>
    );
  }
  return (
    <div className="bg-primary-20 h-full px-10 py-5 w-full">
      <h1 className="text-2xl font-bold mb-4">Issues</h1>
      <div className="grid lg:grid-cols-3 grid-cols-2 w-full gap-4">
        <div className="bg-white p-4 rounded shadow">Issue Card Placeholder 1</div>
        <div className="bg-white p-4 rounded shadow">Issue Card Placeholder 2</div>
        <div className="bg-white p-4 rounded shadow">Issue Card Placeholder 3</div>
      </div>
    </div>
  )
}