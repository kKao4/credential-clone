import SmallImageSkeleton from "./SmallImageSkeleton"

const smallImagesSkeleton = 6

export default function SmallImagesSkeleton() {
  return (
    <>
      {
        Array.from({ length: smallImagesSkeleton }, (_, i) => i + 1).map((index) => {
          return <SmallImageSkeleton key={index} text={index.toString()} />
        })
      }
    </>
  )
}