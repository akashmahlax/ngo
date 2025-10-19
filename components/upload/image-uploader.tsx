"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface ImageUploaderProps {
  currentImage?: string
  onUpload: (file: File) => Promise<string>
  onRemove?: () => void
  maxSize?: number // in MB
  acceptedTypes?: string[]
  className?: string
  aspectRatio?: "square" | "video" | "auto"
}

export function ImageUploader({
  currentImage,
  onUpload,
  onRemove,
  maxSize = 5,
  acceptedTypes = ["image/jpeg", "image/png", "image/webp"],
  className,
  aspectRatio = "square",
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setError("")
    setUploading(true)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const result = await onUpload(file)
      setProgress(100)
      
      clearInterval(progressInterval)
      toast.success("Image uploaded successfully")
    } catch (err: any) {
      setError(err.message || "Failed to upload image")
      toast.error("Failed to upload image")
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": acceptedTypes,
    },
    maxSize: maxSize * 1024 * 1024,
    multiple: false,
    disabled: uploading,
  })

  const handleRemove = () => {
    if (onRemove) {
      onRemove()
      toast.success("Image removed")
    }
  }

  return (
    <div className={className}>
      <Card>
        <CardContent className="p-6">
          {currentImage ? (
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={currentImage} alt="Profile" />
                <AvatarFallback>IMG</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-medium">Current image</p>
                <p className="text-xs text-muted-foreground">
                  Click to replace or remove
                </p>
                <div className="flex gap-2 mt-2">
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <Button variant="outline" size="sm" disabled={uploading}>
                      <Upload className="h-4 w-4 mr-2" />
                      Replace
                    </Button>
                  </div>
                  {onRemove && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemove}
                      disabled={uploading}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
                ${uploading ? "pointer-events-none opacity-50" : "hover:border-primary hover:bg-primary/5"}
              `}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? "Drop image here" : "Upload an image"}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to select
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Max size: {maxSize}MB • Supported: JPEG, PNG, WebP
              </p>
            </div>
          )}

          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Uploading...</span>
                <span className="text-sm">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {error && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
