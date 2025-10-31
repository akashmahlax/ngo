import { requireAdmin } from "@/lib/admin-auth"
import clientPromise from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Eye
} from "lucide-react"
import Link from "next/link"

export default async function AdminBillingPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  await requireAdmin()
  
  const params = await searchParams
  const search = params.search || ""
  const statusFilter = params.status || "all"

  const client = await clientPromise
  const db = client.db()

  // Build query
  const query: any = {}
  if (search) {
    query.$or = [
      { orderId: { $regex: search, $options: "i" } },
      { userEmail: { $regex: search, $options: "i" } }
    ]
  }
  if (statusFilter !== "all") {
    query.status = statusFilter
  }

  // Get orders with user info
  const orders = await db
    .collection("orders")
    .aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", 0] }
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 100 }
    ])
    .toArray()

  // Get statistics
  const stats = await db
    .collection("orders")
    .aggregate([
      {
        $facet: {
          totalRevenue: [
            { $match: { status: "paid" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
          ],
          totalOrders: [
            { $count: "count" }
          ],
          successfulOrders: [
            { $match: { status: "paid" } },
            { $count: "count" }
          ],
          failedOrders: [
            { $match: { status: "failed" } },
            { $count: "count" }
          ],
          pendingOrders: [
            { $match: { status: "pending" } },
            { $count: "count" }
          ]
        }
      }
    ])
    .toArray()

  const statistics = {
    totalRevenue: stats[0]?.totalRevenue[0]?.total || 0,
    totalOrders: stats[0]?.totalOrders[0]?.count || 0,
    successfulOrders: stats[0]?.successfulOrders[0]?.count || 0,
    failedOrders: stats[0]?.failedOrders[0]?.count || 0,
    pendingOrders: stats[0]?.pendingOrders[0]?.count || 0
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Billing & Payments</h1>
        <p className="text-muted-foreground mt-2">
          Manage orders and track revenue
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{statistics.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalOrders}</div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statistics.successfulOrders}</div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{statistics.failedOrders}</div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{statistics.pendingOrders}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <form method="GET" className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search by order ID or email..."
                  defaultValue={search}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                name="status"
                value="all"
                variant={statusFilter === "all" ? "default" : "outline"}
              >
                All
              </Button>
              <Button
                type="submit"
                name="status"
                value="paid"
                variant={statusFilter === "paid" ? "default" : "outline"}
              >
                Paid
              </Button>
              <Button
                type="submit"
                name="status"
                value="failed"
                variant={statusFilter === "failed" ? "default" : "outline"}
              >
                Failed
              </Button>
              <Button
                type="submit"
                name="status"
                value="pending"
                variant={statusFilter === "pending" ? "default" : "outline"}
              >
                Pending
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>
            Showing {orders.length} order{orders.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order: any) => (
                <div
                  key={order._id.toString()}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold">{order.orderId || order._id.toString()}</h3>
                        <Badge
                          variant={
                            order.status === "paid"
                              ? "default"
                              : order.status === "failed"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {order.status}
                        </Badge>
                        {order.plan && (
                          <Badge variant="outline" className="capitalize">
                            {order.plan} Plan
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Customer:</span>
                          <p className="font-medium">
                            {order.user?.name || order.user?.email || "Unknown"}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <p className="font-medium">₹{order.amount?.toLocaleString() || 0}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Date:</span>
                          <p className="font-medium">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {order.paymentMethod && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Payment Method:</span>
                          <span className="ml-2 capitalize">{order.paymentMethod}</span>
                        </div>
                      )}

                      {order.transactionId && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Transaction ID:</span>
                          <span className="ml-2 font-mono text-xs">{order.transactionId}</span>
                        </div>
                      )}

                      {order.failureReason && (
                        <div className="text-sm text-red-600">
                          <span className="font-medium">Failure Reason:</span>
                          <span className="ml-2">{order.failureReason}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/billing/${order._id.toString()}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
