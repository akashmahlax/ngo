"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Zap,
  Crown
} from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface Payment {
  id: string
  orderId: string
  amount: number
  status: string
  plan: string
  createdAt: string
  paidAt: string | null
  paymentId: string | null
}

export default function BillingPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [switching, setSwitching] = useState(false)

  const userSession = session as { 
    role?: string
    plan?: string
    planExpiresAt?: string
    user?: { email?: string }
  }

  const currentRole = userSession?.role || "volunteer"
  const currentPlan = userSession?.plan || "volunteer_free"
  const planExpiresAt = userSession?.planExpiresAt ? new Date(userSession.planExpiresAt) : null
  const isPlusUser = currentPlan === "volunteer_plus" || currentPlan === "ngo_plus"

  useEffect(() => {
    fetchPayments()
  }, [])

  const fetchPayments = async () => {
    try {
      setLoading(true)
      const res = await fetch("/api/billing/history")
      if (res.ok) {
        const data = await res.json()
        setPayments(data.payments || [])
      }
    } catch (error) {
      console.error("Failed to fetch payments:", error)
      toast.error("Failed to load payment history")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    setCancelling(true)
    try {
      const res = await fetch("/api/billing/cancel", { method: "POST" })
      const data = await res.json()
      
      if (res.ok) {
        toast.success(data.message)
        await update() // Refresh session
        router.refresh()
      } else {
        toast.error(data.error || "Failed to cancel subscription")
      }
    } catch (error) {
      console.error("Cancel error:", error)
      toast.error("Failed to cancel subscription")
    } finally {
      setCancelling(false)
    }
  }

  const handleSwitchRole = async () => {
    setSwitching(true)
    try {
      const newRole = currentRole === "volunteer" ? "ngo" : "volunteer"
      const res = await fetch("/api/billing/switch-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newRole })
      })
      const data = await res.json()
      
      if (res.ok) {
        toast.success(data.message)
        await update() // Refresh session
        // Redirect to new dashboard
        setTimeout(() => {
          router.push(newRole === "volunteer" ? "/volunteer" : "/ngo")
          router.refresh()
        }, 1500)
      } else {
        toast.error(data.error || "Failed to switch role")
      }
    } catch (error) {
      console.error("Switch role error:", error)
      toast.error("Failed to switch role")
    } finally {
      setSwitching(false)
    }
  }

  const getPlanName = (plan: string) => {
    const names: Record<string, string> = {
      volunteer_free: "Volunteer Free",
      volunteer_plus: "Volunteer Plus",
      ngo_base: "NGO Base",
      ngo_plus: "NGO Plus"
    }
    return names[plan] || plan
  }

  const getStatusBadge = (status: string) => {
    if (status === "paid") {
      return <Badge className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1" />Paid</Badge>
    }
    if (status === "created") {
      return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
    }
    return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
  }

  const isExpired = planExpiresAt && new Date() > planExpiresAt
  const daysUntilExpiry = planExpiresAt 
    ? Math.ceil((planExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 dark:from-[#050517] dark:via-[#0A0A1E] dark:to-[#111132]">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and payment history</p>
        </div>

        {/* Current Plan Card */}
        <Card className="mb-6 bg-card/90 dark:bg-[#0F0F23]/80 border border-border/50 dark:border-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {isPlusUser && <Crown className="h-5 w-5 text-yellow-500" />}
                  Current Plan
                </CardTitle>
                <CardDescription>Your active subscription details</CardDescription>
              </div>
              {isPlusUser && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                  <Zap className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-muted/30 dark:bg-[#0B0B1C]/50 rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-bold">{getPlanName(currentPlan)}</h3>
                  {isPlusUser ? (
                    <Badge className="bg-green-600">Active</Badge>
                  ) : (
                    <Badge variant="secondary">Free Tier</Badge>
                  )}
                </div>
                
                {planExpiresAt && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {isExpired ? (
                      <span className="text-destructive font-medium">
                        Expired {formatDistanceToNow(planExpiresAt, { addSuffix: true })}
                      </span>
                    ) : (
                      <span>
                        {daysUntilExpiry && daysUntilExpiry <= 7 ? (
                          <span className="text-orange-600 dark:text-orange-400 font-medium">
                            Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
                          </span>
                        ) : (
                          <>Expires on {planExpiresAt.toLocaleDateString()}</>
                        )}
                      </span>
                    )}
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground">
                  {currentRole === "volunteer" ? "Individual volunteer account" : "Organization account"}
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                {!isPlusUser && (
                  <Button 
                    onClick={() => router.push(`/upgrade?plan=${currentRole}_plus`)}
                    className="shadow-lg"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Upgrade to Plus
                  </Button>
                )}
                
                {isPlusUser && !isExpired && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10">
                        Cancel Subscription
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                        <AlertDialogDescription>
                          You will retain access to your Plus features until {planExpiresAt?.toLocaleDateString()}.
                          After that, you will be downgraded to the free tier.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleCancelSubscription}
                          disabled={cancelling}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          {cancelling ? "Cancelling..." : "Yes, Cancel"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {isExpired && (
                  <Button onClick={() => router.push(`/upgrade?plan=${currentRole}_plus`)}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Renew Plan
                  </Button>
                )}
              </div>
            </div>

            {/* Features comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-background/60 dark:bg-[#0B0B1C]/60 rounded-lg border border-border/50 dark:border-white/10">
                <h4 className="font-semibold mb-2">Current Features</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {currentRole === "volunteer" ? (
                    <>
                      <li>✓ Apply to unlimited jobs</li>
                      <li>✓ Profile visibility</li>
                      {isPlusUser && <li className="text-primary font-medium">✓ Priority applications</li>}
                      {isPlusUser && <li className="text-primary font-medium">✓ Advanced analytics</li>}
                      {isPlusUser && <li className="text-primary font-medium">✓ Featured profile</li>}
                    </>
                  ) : (
                    <>
                      <li>✓ Post jobs</li>
                      <li>✓ Review applications</li>
                      {isPlusUser && <li className="text-primary font-medium">✓ Priority job listings</li>}
                      {isPlusUser && <li className="text-primary font-medium">✓ Advanced analytics</li>}
                      {isPlusUser && <li className="text-primary font-medium">✓ Featured organization</li>}
                    </>
                  )}
                </ul>
              </div>

              <div className="p-4 bg-background/60 dark:bg-[#0B0B1C]/60 rounded-lg border border-border/50 dark:border-white/10">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  Switch Role
                  <Badge variant="outline" className="text-xs">Free</Badge>
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Want to switch to {currentRole === "volunteer" ? "NGO" : "Volunteer"} mode?
                </p>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Switch to {currentRole === "volunteer" ? "NGO" : "Volunteer"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Switch Role?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Switching to {currentRole === "volunteer" ? "NGO" : "Volunteer"} will:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>Change your account type</li>
                          <li>Downgrade you to the free tier</li>
                          <li>You can upgrade to Plus again after switching</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleSwitchRole}
                        disabled={switching}
                      >
                        {switching ? "Switching..." : "Yes, Switch Role"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Expiry Warning */}
        {daysUntilExpiry && daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
          <Alert className="mb-6 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900/50">
            <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              Your subscription expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}. 
              <Button 
                variant="link" 
                className="px-2 text-orange-600 dark:text-orange-400"
                onClick={() => router.push(`/upgrade?plan=${currentRole}_plus`)}
              >
                Renew now
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Payment History */}
        <Card className="bg-card/90 dark:bg-[#0F0F23]/80 border border-border/50 dark:border-white/10 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment History
            </CardTitle>
            <CardDescription>View all your past transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading payment history...
              </div>
            ) : payments.length === 0 ? (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">No payment history yet</p>
                <Button 
                  className="mt-4"
                  onClick={() => router.push(`/upgrade?plan=${currentRole}_plus`)}
                >
                  Upgrade to Plus
                </Button>
              </div>
            ) : (
              <div className="rounded-lg border border-border/50 dark:border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 dark:bg-[#0B0B1C]/50 hover:bg-muted/40">
                      <TableHead>Date</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Payment ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {getPlanName(payment.plan)}
                          </Badge>
                        </TableCell>
                        <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {payment.paymentId || payment.orderId}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
