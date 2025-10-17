"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

declare global {
  interface Window {
    Razorpay: any
  }
}

export function CheckoutButton({ plan }: { plan: "volunteer_plus" | "ngo_plus" }) {
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.Razorpay) return
    const s = document.createElement("script")
    s.src = "https://checkout.razorpay.com/v1/checkout.js"
    s.async = true
    document.body.appendChild(s)
  }, [])

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch("/api/billing/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Failed to create order")
      const options = {
        key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: data.order.id,
        handler: function () {
          // Webhook will finalize plan; we can optionally poll or show success
          window.location.reload()
        },
        theme: { color: "#111827" },
      }
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading}>
      {loading ? "Processing..." : "Upgrade"}
    </Button>
  )
}


