import { getCollections } from "@/lib/models"

export default async function VolunteersDirectory() {
  const { users } = await getCollections()
  const list = await users.find({ role: "volunteer" }).project({ name: 1, skills: 1 }).limit(50).toArray()
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Volunteers</h1>
      <div className="mt-6 grid gap-3">
        {list.map((u) => (
          <div key={u._id.toString()} className="rounded-md border p-4">
            <div className="font-medium">{u.name ?? u.email}</div>
            <div className="text-sm text-muted-foreground">{(u.skills ?? []).join(", ")}</div>
          </div>
        ))}
      </div>
    </section>
  )
}


