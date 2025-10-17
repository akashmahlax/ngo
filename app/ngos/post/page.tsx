"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function PostJobPage() {
  const r = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit() {
    setLoading(true)
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed")
      r.push(`/jobs/${data.jobId}`)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-2xl font-semibold">Post a Job</h1>
      <div className="mt-6 grid gap-4">
        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button onClick={submit} disabled={loading || !title || !description}>{loading ? "Posting..." : "Post"}</Button>
      </div>
    </section>
  )
}


