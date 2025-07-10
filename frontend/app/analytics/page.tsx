"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { ChartPlaceholder } from "@/components/ui/chart-placeholder"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Activity, Users } from "lucide-react"

const analyticsData = [
  {
    title: "Total Revenue",
    value: "$45,892",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: TrendingUp,
  },
  {
    title: "Active Users",
    value: "8,549",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: Activity,
  },
  {
    title: "Bounce Rate",
    value: "42.3%",
    change: "-5.4%",
    changeType: "positive" as const,
    icon: TrendingDown,
  },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30d")
  const [category, setCategory] = useState("all")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Track performance and insights</p>
        </div>

        <div className="flex space-x-4">
          <Select
            value={dateRange}
            onChange={setDateRange}
            options={[
              { value: "7d", label: "Last 7 days" },
              { value: "30d", label: "Last 30 days" },
              { value: "90d", label: "Last 90 days" },
              { value: "1y", label: "Last year" },
            ]}
          />
          <Select
            value={category}
            onChange={setCategory}
            options={[
              { value: "all", label: "All Categories" },
              { value: "users", label: "Users" },
              { value: "pokemons", label: "Pokémons" },
              { value: "profiles", label: "Profiles" },
            ]}
          />
          <Button variant="outline">Export</Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((metric) => (
          <Card key={metric.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{metric.value}</p>
                <p
                  className={`text-sm mt-2 flex items-center ${
                    metric.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.changeType === "positive" ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {metric.change}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <metric.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <ChartPlaceholder type="line" />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <ChartPlaceholder type="pie" />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
          <ChartPlaceholder type="bar" />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing</h3>
          <div className="space-y-4">
            {[
              { name: "Pikachu", value: "1,234 views" },
              { name: "Charizard", value: "987 views" },
              { name: "Blastoise", value: "756 views" },
              { name: "Venusaur", value: "654 views" },
              { name: "Gengar", value: "543 views" },
            ].map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2">
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="text-sm text-gray-600">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
