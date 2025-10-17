import { auth } from "@/auth"
import { getCollections } from "@/lib/models"

export default async function VolunteerDashboard() {
  const session = await auth()
  if (!session?.user) return null
  const { applications } = await getCollections()
  const list = await applications
    .find({ volunteerId: (await import('mongodb')).ObjectId.createFromHexString((session as any).userId) })
    .sort({ createdAt: -1 })
    .limit(10)
    .toArray()
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Your applications</h1>
      <div className="mt-6 grid gap-3">
        {list.map((a) => (
          <div key={a._id.toString()} className="rounded-md border p-4">
            <div className="font-medium">{a.status}</div>
            <div className="text-sm text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
