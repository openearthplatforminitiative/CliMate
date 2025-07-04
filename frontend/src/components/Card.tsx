import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type CardProps = {
  title: string
  description: string
  imageSrc?: string
  href: string
  date?: Date
}

export const Card = ({ title, description, date, imageSrc, href }: CardProps) => {
  return (
    <Link
      href={href}
      className="flex group flex-col min-w-56 bg-secondary-50 hover:bg-secondary-60 rounded-2xl overflow-hidden cursor-pointer">
      <div className="relative grow h-full w-full aspect-[13/11]">
        <Image src={imageSrc || "/image-placeholder.png"} alt={"test"} className="object-cover transition duration-500 group-hover:scale-105" fill />
        {date && (
          <div
            className="absolute flex flex-col size-16 items-center justify-center p-2 bg-secondary-95 rounded-xl text-primary-30 -bottom-2 right-2">
            <span className="text-3xl">{date.getDate()}</span>
            <span className="text-xs">{date.toLocaleString("en-US", { month: "short" })}</span>
          </div>
        )}
      </div>
      <div className="px-3 py-2 min-h-20 h-20 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg line-clamp-1 text-secondary-95">{title}</h3>
          <p className="text-secondary-90 text-xs line-clamp-2">{description}</p>
        </div>
        <div className="text-secondary-90 transition group-hover:translate-x-1 self-center w-6 h-6">
          <ChevronRight />
        </div>
      </div>
    </Link>
  )
}