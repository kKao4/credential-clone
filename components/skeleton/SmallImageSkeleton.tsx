import clsx from "clsx"

interface SmallImageSkeletonProps {
  text: string
}

export default function SmallImageSkeleton({ text }: SmallImageSkeletonProps) {
  return (
    <div
      className="mx-auto flex flex-col h-[6.7rem] w-[9.15rem] transition-400 cursor-pointer image-thumb scroll-py-4 select-none"
    >
      <div
        className="h-[5.1rem] w-full bg-neutral-400 animate-pulse"
      />
      <p className={clsx("text-center text-white text-0.75 mt-2.5 transition-400",
        { "opacity-50": text !== "1" },
      )}>{text}</p>
    </div>
  )
}