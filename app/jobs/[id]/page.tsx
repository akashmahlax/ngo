import { JobDetailPageClient } from "./JobDetailClient"

export default async function JobDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params
  return <JobDetailPageClient jobId={resolvedParams.id} />
}