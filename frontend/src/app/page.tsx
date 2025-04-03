"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/Header"
import { NoradLogo, OpenEpiLogo } from "@/components/Logos"
import { ProjectCard } from "@/components/ProjectCard"

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Header />
      <main>
        <div className="relative flex flex-col lg:h-[80vh] w-full bg-primary-20">
          <div className="flex flex-col justify-center max-w-[1350px] lg:h-full h-[80vh] px-10 mx-auto w-full">
            <h1
              className={`text-7xl sm:text-[128px] leading-none text-secondary-98 font-[Newsreader]`}
            >
              CliMate
            </h1>
            <p className="flex flex-col gap-2 text-xl sm:text-3xl text-secondary-98">Saving our planet<span
              className="w-min bg-primary-30 border-r-4 p-2 !border-primary-40">together</span></p>
            <div className="mt-5">
              <Button
                className="bg-secondary-98 rounded-full hover:bg-secondary-80 text-2xl font-normal text-primary-10 p-7"
                onClick={() => router.push("/map")}
              >
                Join our mission
              </Button>
            </div>
          </div>
          <div className={`relative lg:absolute w-full lg:w-1/3 h-96 lg:h-full lg:right-0`}>
            <Image
              style={{ objectFit: "cover", objectPosition: "center center" }}
              alt="image of trash on the beach"
              fill
              src="/river.jpg"
            />
          </div>

        </div>
        <div className={`flex flex-col-reverse lg:flex-row bg-primary-20 lg:py-32 text-secondary-98`}>
          <div className={`relative w-full h-96 lg:h-auto lg:w-1/3`}>
            <Image
              style={{ objectFit: "cover" }}
              alt="image of trash on the beach"
              fill
              src="/beach.jpg"
            />
          </div>
          <div className="flex flex-col py-32 max-w-[1000px] justify-center h-full px-10">

            <h2 className="font-[newsreader] text-5xl mb-5 sm:mb-10">What is CliMate</h2>
            <p className="text-xl sm:text-2xl">
              CliMate is an open platform initiative to report all kinds of climate related issues, and a collaborate
              way to
              save and support our earth.
            </p>
          </div>
        </div>
        <div className="flex bg-secondary-40 py-32 text-secondary-98">
          <div className="flex flex-col justify-center max-w-[1350px] h-full px-10 mx-auto w-full">
            <h2 className="font-[newsreader] text-5xl mb-5 sm:mb-10">Popular Projects</h2>
            <p className="text-xl sm:text-2xl">Projects is science projects that you can support</p>
            <div
              className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 -mx-10 md:mx-0 overflow-x-auto mt-5 mb-24 px-10 md:px-0">
              <ProjectCard title="Project" description="Lorem ipsum dolor" />
              <ProjectCard title="Project" description="Lorem ipsum dolor" />
              <ProjectCard title="Project" description="Lorem ipsum dolor" />
              <ProjectCard title="Project" description="Lorem ipsum dolor" />
            </div>
            <h2 className="font-[newsreader] text-5xl mb-5 sm:mb-10">Popular Events</h2>
            <p className="text-xl sm:text-2xl">Events is arranged by organizations or private persons to clean up
              areas</p>
            <div
              className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-5 -mx-10 md:mx-0 overflow-x-auto mt-5 mb-10 px-10 md:px-0">
              <ProjectCard title="Event" description="Lorem ipsum dolor" date={new Date} />
              <ProjectCard title="Event" description="Lorem ipsum dolor" date={new Date} />
              <ProjectCard title="Event" description="Lorem ipsum dolor" date={new Date} />
              <ProjectCard title="Event" description="Lorem ipsum dolor" date={new Date} />
            </div>
          </div>
        </div>
        <div className="flex bg-primary-20 py-16 text-secondary-98">
          <div className="flex flex-col justify-center max-w-[1350px] h-full px-10 mx-auto w-full">
            <h2 className="font-[newsreader] text-5xl mb-5 sm:mb-10">
              Partners
            </h2>

            <div className="flex gap-10 flex-wrap justify-between items-center">
              <OpenEpiLogo />
              <NoradLogo />
              <OpenEpiLogo />
              <NoradLogo />
            </div>
          </div>
        </div>
      </main>
      <footer className="flex bg-primary-10 py-16 text-secondary-98">
        <div className="flex flex-col justify-center max-w-[1350px] h-full px-10 mx-auto w-full">
          <h2 className="font-[newsreader] text-5xl mb-5 sm:mb-10">
            Partners
          </h2>
        </div>
      </footer>
    </>
  )
}
