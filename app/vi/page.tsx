import MainSection from "@/components/section/MainSection"
import { viId } from "@/constant/pageId"

export default function Home({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const { viewport } = searchParams
  const isMobileDevice = viewport?.includes("mobile")
  return (
    <>
      <MainSection isMobileDevice={isMobileDevice} api={process.env.NEXT_PUBLIC_CREDENTIAL_HOST_URL + viId} />
    </>
  )
}
