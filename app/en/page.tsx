import MainSection from "@/components/section/MainSection"

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
      <MainSection isMobileDevice={isMobileDevice} api="https://okhub.vn/wp-json/acf/v3/pages/11583" />
    </>
  )
}
