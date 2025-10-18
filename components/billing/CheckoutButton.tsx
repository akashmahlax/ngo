"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface RazorpayResponse {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

interface RazorpayError {
  error: {
    code: string
    description: string
    source: string
    step: string
    reason: string
  }
}

interface RazorpayOptions {
  key: string
  order_id: string
  handler: (response: RazorpayResponse) => void
  modal?: {
    ondismiss?: () => void
  }
  theme?: {
    color: string
  }
}

interface RazorpayInstance {
  open: () => void
  on: (event: string, handler: (response: RazorpayError) => void) => void
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export function CheckoutButton({ 
  plan, 
  className 
}: { 
  plan: "volunteer_plus" | "ngo_plus"
  className?: string 
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.Razorpay) return
    const s = document.createElement("script")
    s.src = "https://checkout.razorpay.com/v1/checkout.js"
    s.async = true
    document.body.appendChild(s)
  }, [])

  async function verifyPayment(paymentId: string, orderId: string, signature: string) {
    try {
      const res = await fetch("/api/billing/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature 
        }),
      })
      const data = await res.json()
      return res.ok && data.success
    } catch (error) {
      console.error("Payment verification error:", error)
      return false
    }
  }

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
      
      const options: RazorpayOptions = {
        key: data.keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        order_id: data.order.id,
        handler: async function (response: RazorpayResponse) {
          // Verify payment on server before showing success
          toast.loading("Verifying payment...")
          const verified = await verifyPayment(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          )
          
          if (verified) {
            toast.success("Payment successful! Your plan has been activated.")
            // Redirect to dashboard after successful payment
            setTimeout(() => {
              router.push(plan.startsWith("volunteer") ? "/volunteer" : "/ngo")
              router.refresh()
            }, 1500)
          } else {
            toast.error("Payment verification failed. Please contact support.")
          }
        },
        modal: {
          ondismiss: function() {
            toast.info("Payment cancelled. Your plan has not been upgraded.")
            setLoading(false)
          }
        },
        theme: { color: "#0E7490" },
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (response: RazorpayError){
        toast.error("Payment failed: " + response.error.description)
        setLoading(false)
      })
      rzp.open()
    } catch (e) {
      console.error(e)
      toast.error("Failed to initiate payment. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleClick} disabled={loading} size="lg" className={className || "shadow-lg"}>
      {loading ? "Processing..." : "Pay ₹1 & Upgrade Now"}
    </Button>
  )
}


