import { auth } from "@/auth"
import { CheckoutButton } from "@/components/billing/CheckoutButton"

export default async function UpgradePage({ searchParams }: { searchParams: { plan?: "volunteer_plus" | "ngo_plus" } }) {
  const session = await auth()
  const plan = searchParams.plan || (((session as any).role === "ngo") ? "ngo_plus" : "volunteer_plus")
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


