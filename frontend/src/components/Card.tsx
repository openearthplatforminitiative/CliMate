import Image from "next/image"
import Link from "next/link"

type ProjectCardProps = {
  title: string
  description: string
  imageSrc: string
  href: string
  date?: Date
}

export const ProjectCard = ({ title, description, date, imageSrc, href }: ProjectCardProps) => {
  return (
    <Link
      href={href}
      className="flex flex-col min-w-52 aspect-square bg-secondary-50 hover:bg-secondary-60 rounded-2xl overflow-hidden cursor-pointer">
      <div className="relative grow h-full">
        <Image src={imageSrc} alt={"test"} className="object-cover" fill />
        {date && (
          <div
            className="absolute flex flex-col size-16 items-center justify-center p-2 bg-secondary-95 rounded-xl text-primary-30 -bottom-2 right-2">
            <span className="text-3xl">{date.getDate()}</span>
            <span className="text-xs">{date.toLocaleString("en-US", { month: "short" })}</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg">{title}</h3>
        <p>{description}</p>
      </div>
    </Link>
  )
}