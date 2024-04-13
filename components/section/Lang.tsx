import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import vi from "@/assets/vi-flag.svg"
import en from "@/assets/en-flag.svg"
import zh from "@/assets/zh-flag.svg"

interface LangProps {
  className?: string,
  isMobileDevice?: boolean
}

export default function Lang({ className, isMobileDevice }: LangProps) {
  const pathname = usePathname()
  return (
    <div className={clsx("flex flex-row", className)}>
      <Link href="/vi" className={clsx("flex flex-row items-center transition-300 rounded-full", {
        "bg-neutral-600 px-2 py-1": pathname === "/vi" && !isMobileDevice,
        "bg-neutral-400 px-2 py-1": pathname === "/vi" && isMobileDevice,
        "opacity-60 hover:opacity-100": pathname !== "/vi"
      })}>
        <div className="size-5 rounded-full overflow-hidden flex justify-center items-center">
          <Image src={vi} alt="vietnam language" className="h-full object-cover" />
        </div>
        {pathname === "/vi" && <p className="ml-1.5 text-0.875">vi</p>}
      </Link>
      <Link href="/en" className={clsx("flex flex-row items-center transition-300 rounded-full ml-3", {
        "bg-neutral-600 px-2 py-1": pathname === "/en" && !isMobileDevice,
        "bg-neutral-400 px-2 py-1": pathname === "/en" && isMobileDevice,
        "opacity-60 hover:opacity-100": pathname !== "/en"
      })}>
        <div className="size-5 rounded-full overflow-hidden flex justify-center items-center">
          <Image src={en} alt="english language" className="h-full object-cover" />
        </div>
        {pathname === "/en" && <p className="ml-1.5 text-0.875">en</p>}
      </Link>
      <Link href="/zh" className={clsx("flex flex-row items-center transition-300 rounded-full ml-3", {
        "bg-neutral-600 px-2 py-1": pathname === "/zh" && !isMobileDevice,
        "bg-neutral-400 px-2 py-1": pathname === "/zh" && isMobileDevice,
        "opacity-60 hover:opacity-100": pathname !== "/zh"
      })}>
        <div className="size-5 rounded-full overflow-hidden flex justify-center items-center">
          <Image src={zh} alt="vietnam language" className="h-full object-cover" />
        </div>
        {pathname === "/zh" && <p className="ml-1.5 text-0.875">zh</p>}
      </Link>
    </div>
  )
}