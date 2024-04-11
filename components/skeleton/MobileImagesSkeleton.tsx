import MobileImageSkeleton from "./MobileImageSkeleton"

const mobileImagesSkeleton = 6

export default function MobileImagesSkeleton() {
  return (
    <>
      {
        Array.from({ length: mobileImagesSkeleton }, (_, i) => i + 1).map((index) => {
          return <MobileImageSkeleton key={index} />
        })
      }
    </>
  )
}