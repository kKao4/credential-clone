import MainSection from "@/components/section/MainSection"
import { viId } from "@/constant/pageId"

async function getData() {
  const res = await fetch(process.env.NEXT_PUBLIC_CREDENTIAL_HOST_URL + viId)
  if (!res.ok) {
    throw new Error("Failed to fetch data")
  }
  return res.json()
}

export default async function Home({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const data = await getData()
  const { viewport } = searchParams
  const isMobileDevice = viewport?.includes("mobile")
  return (
    <>
      <MainSection isMobileDevice={isMobileDevice} data={data} />
    </>
  )
}
