"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Check } from "lucide-react"

interface ShareButtonProps {
  title: string
  text?: string
  className?: string
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
}

export function ShareButton({ 
  title, 
  text, 
  className = "",
  variant = "outline",
  size = "lg"
}: ShareButtonProps) {
  const [shareSuccess, setShareSuccess] = useState(false)

  const handleShare = async () => {
    const shareData = {
      title,
      text: text || title,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      }
    } catch (error) {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        setShareSuccess(true)
        setTimeout(() => setShareSuccess(false), 2000)
      } catch (clipboardError) {
        console.error("Failed to share:", clipboardError)
      }
    }
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={className}
      onClick={handleShare}
    >
      {shareSuccess ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </>
      )}
    </Button>
  )
}
