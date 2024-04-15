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
      <MainSection isMobileDevice={isMobileDevice} api={process.env.CMS_CREDENTIAL_EN!} />
    </>
  )
}
