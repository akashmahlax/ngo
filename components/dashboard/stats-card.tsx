"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import * as Icons from "lucide-react"
import React from "react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  iconName: keyof typeof Icons
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  className?: string
  onClick?: () => void
}

export function StatsCard({ 
  title, 
  value, 
  description, 
  iconName, 
  trend, 
  className,
  onClick 
}: StatsCardProps) {
  const Icon = Icons[iconName]
  // Cast to a React component type so TS understands this is renderable
  const IconComponent = Icon as unknown as React.ComponentType<React.SVGProps<SVGSVGElement>>

  return (
    <Card 
      className={cn(
        "hover:shadow-md transition-shadow",
        onClick && "cursor-pointer hover:shadow-lg",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <IconComponent className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className="flex items-center pt-1">
            <span 
              className={cn(
                "text-xs font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
