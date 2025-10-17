import { getCollections } from "@/lib/models"

export default async function JobsPage() {
  const { jobs } = await getCollections()
  const list = await jobs.find({ status: "open" }).project({ title: 1, category: 1, createdAt: 1 }).sort({ createdAt: -1 }).limit(50).toArray()
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Latest roles</h1>
      <div className="mt-6 grid gap-3">
        {list.map((j) => (
          <div key={j._id.toString()} className="rounded-md border p-4">
            <div className="font-medium">{j.title}</div>
            <div className="text-sm text-muted-foreground">{j.category ?? "General"}</div>
          </div>
        ))}
      </div>
    </section>
  )
}


