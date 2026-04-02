"use client"

import { Film, Globe, Calendar, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    icon: Film,
    label: "Total Movies",
    value: "500+",
    description: "Across all platforms",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Globe,
    label: "Languages",
    value: "6",
    description: "Hindi, Telugu, Tamil & more",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: Calendar,
    label: "Years Covered",
    value: "1950-2024",
    description: "75+ years of cinema",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: Star,
    label: "Top Rated",
    value: "9.5",
    description: "Highest rated film",
    gradient: "from-purple-500 to-pink-500",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="bg-card border-border overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1 text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </div>
              <div className={`p-2.5 rounded-lg bg-gradient-to-br ${stat.gradient}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
