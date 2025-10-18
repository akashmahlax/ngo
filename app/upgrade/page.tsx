import { auth } from "@/auth"
import { CheckoutButton } from "@/components/billing/CheckoutButton"

type UpgradeSearchParams = {
  plan?: "volunteer_plus" | "ngo_plus"
}

export default async function UpgradePage({
  searchParams,
}: {
  searchParams: Promise<UpgradeSearchParams>
}) {
  const [params, session] = await Promise.all([searchParams, auth()])
  type SessionWithRole = typeof session & {
    role?: "volunteer" | "ngo"
    user?: {
      role?: "volunteer" | "ngo"
    }
  }
  const sessionWithRole = session as SessionWithRole
  const userRole = sessionWithRole?.role || sessionWithRole?.user?.role
  const plan = params?.plan || (userRole === "ngo" ? "ngo_plus" : "volunteer_plus")
  return (
    <section className="container mx-auto px-4 py-12">
      <h1 className="text-2xl font-semibold">Upgrade</h1>
      <p className="mt-2 text-muted-foreground">Complete your one-time payment to activate your plan.</p>
      <div className="mt-6">
        <CheckoutButton plan={plan} />
      </div>
    </section>
  )
}


