import MainSection from "@/components/section/MainSection"
import { zhId } from "@/constant/pageId"

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
      <MainSection isMobileDevice={isMobileDevice} api={process.env.CREDENTIAL_HOST_URL + zhId} />
    </>
  )
}
