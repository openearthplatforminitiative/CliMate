"use client";
import { MenuButton } from "@/components/MenuButton";
import { Button } from "@/components/ui/button";
import { Newsreader } from "next/font/google";
import { useRouter } from "next/navigation";

const newsreader = Newsreader({
  subsets: ["latin"],
});

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-center p-5 bg-[#002110]">
        <h1
          className={`text-2xl font-bold text-[#DFF7E3] ${newsreader.className}`}
        >
          CliMate
        </h1>
        <MenuButton className="bg-[#DFF7E3] text-[#002110]" />
      </div>
      <div className="flex flex-col justify-center h-screen w-full bg-[#00391F] pl-5">
        <h1
          className={`text-5xl font-bold text-[#DFF7E3] ${newsreader.className}`}
        >
          CliMate
        </h1>
        <p className="text-3xl text-[#DFF7E3]">Saving our planet together</p>
        <div className="mt-2">
          <Button
            className="bg-[#DFF7E3] text-2xl text-[#002110] p-7"
            onClick={() => router.push("/map")}
          >
            Join our mission
          </Button>
        </div>
      </div>
    </div>
  );
}
