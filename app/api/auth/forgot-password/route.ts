import { NextRequest, NextResponse } from "next/server"
import { getCollections } from "@/lib/models"
import { z } from "zod"
import crypto from "crypto"

const schema = z.object({
  email: z.string().email(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    const parsed = schema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const { email } = parsed.data
    const { users } = await getCollections()
    
    // Find user by email
    const user = await users.findOne({ email })
    
    // SECURITY: Always return success even if user doesn't exist
    // This prevents email enumeration attacks
    if (!user) {
      return NextResponse.json({ 
        success: true,
        message: "If an account exists with that email, you will receive a password reset link shortly."
      })
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex")
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex")
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Save hashed token to database
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          passwordResetToken: resetTokenHash,
          passwordResetExpiry: resetTokenExpiry,
          updatedAt: new Date(),
        },
      }
    )

    // TODO: Send email with reset link
    // In production, you would send an email here with:
    // const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`
    
    // For development, log the reset token
    if (process.env.NODE_ENV === "development") {
      console.log("=".repeat(80))
      console.log("PASSWORD RESET TOKEN (DEV ONLY)")
      console.log("Email:", email)
      console.log("Token:", resetToken)
      console.log("Reset URL:", `http://localhost:3000/reset-password?token=${resetToken}`)
      console.log("=".repeat(80))
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with that email, you will receive a password reset link shortly.",
      // Include token in response for development only
      ...(process.env.NODE_ENV === "development" && { 
        devToken: resetToken,
        devResetUrl: `http://localhost:3000/reset-password?token=${resetToken}`
      }),
    })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
