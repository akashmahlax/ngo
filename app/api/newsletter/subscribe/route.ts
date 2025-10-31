import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 }
      )
    }

    const client = await clientPromise
    const db = client.db()

    // Check if already subscribed
    const existing = await db.collection("newsletter_subscribers").findOne({ email: email.toLowerCase() })

    if (existing) {
      return NextResponse.json(
        { message: "You're already subscribed!" },
        { status: 200 }
      )
    }

    // Add to newsletter subscribers
    await db.collection("newsletter_subscribers").insertOne({
      email: email.toLowerCase(),
      subscribedAt: new Date(),
      active: true,
      source: "footer_form"
    })

    return NextResponse.json({ 
      success: true,
      message: "Successfully subscribed to newsletter!" 
    })
  } catch (error: any) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    )
  }
}
