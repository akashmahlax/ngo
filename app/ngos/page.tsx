import { getCollections } from "@/lib/models"

export default async function NgosDirectory() {
  const { users } = await getCollections()
  const list = await users.find({ role: "ngo" }).project({ name: 1, orgName: 1, website: 1 }).limit(50).toArray()
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">NGOs</h1>
      <div className="mt-6 grid gap-3">
        {list.map((u) => (
          <div key={u._id.toString()} className="rounded-md border p-4">
            <div className="font-medium">{u.orgName ?? u.name ?? u.email}</div>
            <div className="text-sm text-muted-foreground">{u.website ?? "—"}</div>
          </div>
        ))}
      </div>
    </section>
  )
}


