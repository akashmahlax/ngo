import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto h-20 w-20 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-amber-600" />
          </div>
          <CardTitle className="text-3xl">We'll Be Right Back</CardTitle>
          <CardDescription className="text-lg">
            Our platform is currently undergoing scheduled maintenance to improve your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              We're working hard to make things better. Please check back in a few moments.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4" />
              <span>This page will automatically refresh</span>
            </div>
          </div>

          <div className="pt-6 border-t space-y-4">
            <h3 className="font-semibold text-center">Need Immediate Assistance?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" asChild>
                <Link href="mailto:support@justbecause.asia">
                  Email Support
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://status.justbecause.asia" target="_blank">
                  System Status
                </a>
              </Button>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Thank you for your patience and understanding.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
