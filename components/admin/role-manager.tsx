"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
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
import { Users, Building2, Shield, RefreshCw } from "lucide-react"
import { toast } from "sonner"

const ROLE_OPTIONS = [
  { value: "volunteer", label: "Volunteer", icon: Users, color: "text-blue-600" },
  { value: "ngo", label: "NGO", icon: Building2, color: "text-green-600" },
  { value: "admin", label: "Admin", icon: Shield, color: "text-red-600" },
] as const

const ADMIN_LEVEL_OPTIONS = [
  { value: "super", label: "Super Admin" },
  { value: "moderator", label: "Moderator" },
  { value: "support", label: "Support" },
] as const

const PERMISSION_OPTIONS = [
  { value: "manage_users", label: "Manage Users" },
  { value: "manage_jobs", label: "Manage Jobs" },
  { value: "manage_billing", label: "Manage Billing" },
  { value: "manage_content", label: "Moderate Content" },
  { value: "manage_settings", label: "Manage Settings" },
]

type RoleManagerProps = {
  userId: string
  currentRole: string
  isAdmin: boolean
  adminLevel?: string
  adminPermissions?: string[]
  onUpdate: () => void
}

export function RoleManager({
  userId,
  currentRole,
  isAdmin,
  adminLevel,
  adminPermissions,
  onUpdate,
}: RoleManagerProps) {
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState(currentRole || "volunteer")
  const [makeAdmin, setMakeAdmin] = useState(isAdmin)
  const [selectedAdminLevel, setSelectedAdminLevel] = useState(adminLevel || "moderator")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(
    adminPermissions || ["manage_users"]
  )

  function togglePermission(permission: string) {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permission))
    } else {
      setSelectedPermissions([...selectedPermissions, permission])
    }
  }

  async function handleRoleChange() {
    setLoading(true)
    try {
      const body: any = {}

      // If role changed
      if (selectedRole !== currentRole) {
        body.role = selectedRole
      }

      // If admin status changed
      if (makeAdmin !== isAdmin) {
        body.makeAdmin = makeAdmin
      }

      // If making admin, include level and permissions
      if (makeAdmin) {
        body.adminLevel = selectedAdminLevel
        body.adminPermissions = selectedPermissions
      }

      // If role is being changed to admin
      if (selectedRole === "admin") {
        body.role = "admin"
        body.makeAdmin = true
        body.adminLevel = selectedAdminLevel
        body.adminPermissions = selectedPermissions
      }

      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Failed to change role")
      }

      toast.success("User role updated successfully")
      onUpdate()
    } catch (error: any) {
      toast.error(error.message || "Failed to change role")
    } finally {
      setLoading(false)
    }
  }

  const currentRoleInfo = ROLE_OPTIONS.find((r) => r.value === currentRole)
  const selectedRoleInfo = ROLE_OPTIONS.find((r) => r.value === selectedRole)
  const hasChanges =
    selectedRole !== currentRole ||
    makeAdmin !== isAdmin ||
    (makeAdmin && selectedAdminLevel !== adminLevel) ||
    (makeAdmin && JSON.stringify(selectedPermissions) !== JSON.stringify(adminPermissions))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Role Management
        </CardTitle>
        <CardDescription>Change user role and permissions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Role Display */}
        <div>
          <Label className="text-sm text-muted-foreground">Current Role</Label>
          <div className="flex items-center gap-2 mt-2">
            {currentRoleInfo && (
              <>
                <currentRoleInfo.icon className={`h-5 w-5 ${currentRoleInfo.color}`} />
                <Badge variant="outline" className="text-base">
                  {currentRoleInfo.label}
                </Badge>
              </>
            )}
            {isAdmin && (
              <Badge className="bg-red-600 text-white">
                Admin ({adminLevel})
              </Badge>
            )}
          </div>
        </div>

        {/* New Role Selection */}
        <div className="space-y-3">
          <Label>Change Role To</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROLE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <option.icon className={`h-4 w-4 ${option.color}`} />
                    {option.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Admin Promotion */}
        {(selectedRole === "volunteer" || selectedRole === "ngo") && (
          <div className="rounded-lg border p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="makeAdmin"
                checked={makeAdmin}
                onCheckedChange={(checked) => setMakeAdmin(checked === true)}
              />
              <Label htmlFor="makeAdmin" className="cursor-pointer">
                Also make this user an admin
              </Label>
            </div>

            {makeAdmin && (
              <>
                <div className="space-y-2">
                  <Label>Admin Level</Label>
                  <Select value={selectedAdminLevel} onValueChange={setSelectedAdminLevel}>
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label>Permissions</Label>
                  <div className="grid gap-2">
                    {PERMISSION_OPTIONS.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-3 rounded-lg border p-3 text-sm cursor-pointer hover:bg-muted/50"
                      >
                        <Checkbox
                          checked={selectedPermissions.includes(option.value)}
                          onCheckedChange={() => togglePermission(option.value)}
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Admin Settings (when role is admin) */}
        {selectedRole === "admin" && (
          <div className="rounded-lg border p-4 space-y-4 bg-red-50 dark:bg-red-950/20">
            <div className="flex items-center gap-2 text-red-600">
              <Shield className="h-5 w-5" />
              <span className="font-semibold">Admin Configuration</span>
            </div>

            <div className="space-y-2">
              <Label>Admin Level</Label>
              <Select value={selectedAdminLevel} onValueChange={setSelectedAdminLevel}>
                <SelectTrigger>
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
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid gap-2">
                {PERMISSION_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 rounded-lg border p-3 text-sm cursor-pointer hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={selectedPermissions.includes(option.value)}
                      onCheckedChange={() => togglePermission(option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preview Changes */}
        {hasChanges && (
          <div className="rounded-lg border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-4">
            <p className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
              Preview Changes:
            </p>
            <ul className="text-sm space-y-1 text-amber-800 dark:text-amber-200">
              {selectedRole !== currentRole && (
                <li>
                  • Role: {currentRoleInfo?.label} → {selectedRoleInfo?.label}
                </li>
              )}
              {makeAdmin !== isAdmin && (
                <li>• Admin Status: {isAdmin ? "Remove" : "Grant"} admin privileges</li>
              )}
              {makeAdmin && selectedAdminLevel !== adminLevel && (
                <li>
                  • Admin Level: {adminLevel || "none"} → {selectedAdminLevel}
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full" disabled={!hasChanges || loading}>
              {loading ? "Updating..." : "Update Role"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Role Change</AlertDialogTitle>
              <AlertDialogDescription>
                This will change the user's role and permissions. This action will take effect
                immediately and may affect the user's access to the platform.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleRoleChange}>Confirm Change</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
