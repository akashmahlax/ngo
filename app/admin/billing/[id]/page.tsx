"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DollarSign,
  Calendar,
  CreditCard,
  User,
  Building2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Mail
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [orderId, setOrderId] = useState<string>("")
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    params.then(p => {
      setOrderId(p.id)
    })
  }, [params])

  useEffect(() => {
    if (orderId) {
      loadOrderData()
    }
  }, [orderId])

  async function loadOrderData() {
    if (!orderId) return
    try {
      const res = await fetch(`/api/admin/billing/${orderId}`)
      if (res.ok) {
        const data = await res.json()
        setOrder(data.order)
      } else {
        toast.error("Failed to load order data")
        router.push("/admin/billing")
      }
    } catch (error) {
      console.error("Error loading order:", error)
      toast.error("Failed to load order data")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
        <p className="text-muted-foreground">Order not found</p>
        <Button asChild className="mt-4">
          <Link href="/admin/billing">Back to Billing</Link>
        </Button>
      </div>
    )
  }

  const StatusIcon = order.status === "paid" 
    ? CheckCircle 
    : order.status === "failed" 
    ? XCircle 
    : Clock

  const statusColor = order.status === "paid" 
    ? "text-green-600" 
    : order.status === "failed" 
    ? "text-red-600" 
    : "text-amber-600"

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button asChild variant="outline" size="icon">
          <Link href="/admin/billing">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground mt-1">
            {order.orderId || order._id}
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <StatusIcon className={`h-8 w-8 ${statusColor}`} />
              <div>
                <Badge
                  variant={
                    order.status === "paid"
                      ? "default"
                      : order.status === "failed"
                      ? "destructive"
                      : "secondary"
                  }
                  className="text-base px-3 py-1"
                >
                  {order.status}
                </Badge>
                {order.failureReason && (
                  <p className="text-sm text-red-600 mt-2">
                    <strong>Failure Reason:</strong> {order.failureReason}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Amount</p>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-2xl font-bold">₹{order.amount?.toLocaleString() || 0}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Plan</p>
                <Badge variant="outline" className="text-base capitalize px-3 py-1">
                  {order.plan || "Unknown"} Plan
                </Badge>
              </div>
            </div>

            {order.paymentMethod && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
              </div>
            )}

            {order.transactionId && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
                <code className="bg-muted px-3 py-1 rounded text-sm">
                  {order.transactionId}
                </code>
              </div>
            )}

            {order.razorpayOrderId && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Razorpay Order ID</p>
                <code className="bg-muted px-3 py-1 rounded text-sm">
                  {order.razorpayOrderId}
                </code>
              </div>
            )}

            {order.razorpayPaymentId && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Razorpay Payment ID</p>
                <code className="bg-muted px-3 py-1 rounded text-sm">
                  {order.razorpayPaymentId}
                </code>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground mb-1">Created At</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {order.paidAt && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Paid At</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(order.paidAt).toLocaleString()}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Details */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Name</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{order.user?.name || "N/A"}</span>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{order.user?.email || "N/A"}</span>
              </div>
            </div>

            {order.user?.role && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Role</p>
                <Badge variant="outline" className="capitalize">
                  {order.user.role}
                </Badge>
              </div>
            )}

            {order.user?.orgName && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Organization</p>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{order.user.orgName}</span>
                </div>
              </div>
            )}

            <Button asChild variant="outline">
              <Link href={`/admin/users/${order.userId}`}>
                View User Profile
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Subscription Details (if applicable) */}
        {order.subscriptionId && (
          <Card>
            <CardHeader>
              <CardTitle>Subscription Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Subscription ID</p>
                <code className="bg-muted px-3 py-1 rounded text-sm">
                  {order.subscriptionId}
                </code>
              </div>

              {order.subscriptionStartDate && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Start Date</p>
                  <span>{new Date(order.subscriptionStartDate).toLocaleDateString()}</span>
                </div>
              )}

              {order.subscriptionEndDate && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">End Date</p>
                  <span>{new Date(order.subscriptionEndDate).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
