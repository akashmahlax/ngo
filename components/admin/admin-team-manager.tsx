"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
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
import { toast } from "sonner"
import { Loader2, Mail, Shield, Trash2, UserPlus } from "lucide-react"

const ADMIN_LEVEL_OPTIONS = [
  { value: "super", label: "Super Admin" },
  { value: "moderator", label: "Moderator" },
  { value: "support", label: "Support" },
] as const

type AdminLevel = (typeof ADMIN_LEVEL_OPTIONS)[number]["value"]

type AdminTeamManagerProps = {
  initialAdmins: Array<{
    id: string
    name: string
    email: string
    role?: string
    adminLevel: AdminLevel
    adminPermissions: string[]
    createdAt: string
    lastLoginAt: string | null
  }>
}

const PERMISSION_OPTIONS = [
  { value: "manage_users", label: "Manage Users" },
  { value: "manage_jobs", label: "Manage Jobs" },
  { value: "manage_billing", label: "Manage Billing" },
  { value: "manage_content", label: "Moderate Content" },
  { value: "manage_settings", label: "Manage Settings" },
]

export function AdminTeamManager({ initialAdmins }: AdminTeamManagerProps) {
  const [admins, setAdmins] = useState(initialAdmins)
  const [loadingIds, setLoadingIds] = useState<string[]>([])
  const [promoteEmail, setPromoteEmail] = useState("")
  const [promoteLevel, setPromoteLevel] = useState<AdminLevel>("moderator")
  const [promotePermissions, setPromotePermissions] = useState<string[]>([
    "manage_users",
  ])
  const [promoteLoading, setPromoteLoading] = useState(false)

  const sortedAdmins = useMemo(() => {
    return [...admins].sort((a, b) => a.name.localeCompare(b.name))
  }, [admins])

  function isLoading(id: string) {
    return loadingIds.includes(id)
  }

  function togglePermissionList(list: string[], value: string) {
    if (list.includes(value)) {
      return list.filter((item) => item !== value)
    }
    return [...list, value]
  }

  async function handlePromote() {
    if (!promoteEmail.trim()) {
      toast.error("Enter an email to promote")
      return
    }

    setPromoteLoading(true)
    try {
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: promoteEmail.trim().toLowerCase(),
          level: promoteLevel,
          permissions: promotePermissions,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to promote admin")
      }

      const data = await res.json()
      setAdmins((prev) => [...prev, data.admin])
      setPromoteEmail("")
      setPromoteLevel("moderator")
      setPromotePermissions(["manage_users"])
      toast.success("Admin added to the team")
    } catch (error: any) {
      toast.error(error.message || "Failed to promote admin")
    } finally {
      setPromoteLoading(false)
    }
  }

  async function handleUpdate(id: string, updates: { level?: AdminLevel; permissions?: string[] }) {
    setLoadingIds((prev) => [...prev, id])
    try {
      const res = await fetch(`/api/admin/team/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to update admin")
      }

      const data = await res.json()
      setAdmins((prev) => prev.map((admin) => (admin.id === id ? data.admin : admin)))
      toast.success("Admin updated")
    } catch (error: any) {
      toast.error(error.message || "Failed to update admin")
    } finally {
      setLoadingIds((prev) => prev.filter((item) => item !== id))
    }
  }

  async function handleRemove(id: string) {
    setLoadingIds((prev) => [...prev, id])
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: "DELETE" })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to remove admin")
      }

      setAdmins((prev) => prev.filter((admin) => admin.id !== id))
      toast.success("Admin removed from the team")
    } catch (error: any) {
      toast.error(error.message || "Failed to remove admin")
    } finally {
      setLoadingIds((prev) => prev.filter((item) => item !== id))
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Shield className="h-5 w-5" />
            Admin Team
          </CardTitle>
          <CardDescription>
            Manage platform administrators, permissions, and responsibilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <Input
                placeholder="admin@example.com"
                value={promoteEmail}
                onChange={(event) => setPromoteEmail(event.target.value)}
                disabled={promoteLoading}
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground">Admin Level</label>
              <Select
                value={promoteLevel}
                onValueChange={(value: AdminLevel) => setPromoteLevel(value)}
                disabled={promoteLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_LEVEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Permissions</p>
            <div className="grid gap-3 md:grid-cols-2">
              {PERMISSION_OPTIONS.map((option) => (
                <label key={option.value} className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                  <Checkbox
                    checked={promotePermissions.includes(option.value)}
                    onCheckedChange={() =>
                      setPromotePermissions((prev) => togglePermissionList(prev, option.value))
                    }
                    disabled={promoteLoading}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </div>

          <Button className="mt-6" onClick={handlePromote} disabled={promoteLoading}>
            {promoteLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Promoting...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Admin
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Team</CardTitle>
          <CardDescription>
            {sortedAdmins.length === 0
              ? "No administrators found. Promote a user to get started."
              : "Review existing administrators and adjust responsibilities."}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAdmins.map((admin) => {
                const loading = isLoading(admin.id)
                return (
                  <TableRow key={admin.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{admin.name}</span>
                        {admin.role && (
                          <span className="text-xs text-muted-foreground">Role: {admin.role}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{admin.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={admin.adminLevel}
                        onValueChange={(value: AdminLevel) =>
                          handleUpdate(admin.id, { level: value })
                        }
                        disabled={loading}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ADMIN_LEVEL_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-2">
                        {PERMISSION_OPTIONS.map((option) => (
                          <label key={option.value} className="flex items-center gap-2 rounded-md border px-2 py-1 text-xs">
                            <Checkbox
                              checked={admin.adminPermissions.includes(option.value)}
                              onCheckedChange={() => {
                                const nextPermissions = togglePermissionList(
                                  admin.adminPermissions,
                                  option.value
                                )
                                handleUpdate(admin.id, { permissions: nextPermissions })
                              }}
                              disabled={loading}
                            />
                            {option.label}
                          </label>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs text-muted-foreground">
                        <span>Joined {new Date(admin.createdAt).toLocaleDateString()}</span>
                        <span>
                          Last login {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : "—"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={loading}>
                            {loading ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove admin privileges?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove access to all admin tools for {admin.name}. They will retain their regular account access.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRemove(admin.id)}>
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
