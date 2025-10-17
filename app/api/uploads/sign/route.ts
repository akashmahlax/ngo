import { NextRequest, NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function GET(req: NextRequest) {
  const ts = Math.floor(Date.now() / 1000)
  const paramsToSign = { timestamp: ts }
  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string)
  return NextResponse.json({ timestamp: ts, signature, cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY })
}


