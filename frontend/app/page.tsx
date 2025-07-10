import { Card } from "@/components/ui/card"
import { ChartPlaceholder } from "@/components/ui/chart-placeholder"
import { BarChart3, Users, Database, UserCheck } from "lucide-react"

const summaryCards = [
  {
    title: "Total Pokémons",
    value: "1,284",
    icon: Database,
    change: "+12%",
    changeType: "positive" as const,
  },
  {
    title: "Total Users",
    value: "8,549",
    icon: Users,
    change: "+8%",
    changeType: "positive" as const,
  },
  {
    title: "Total Profiles",
    value: "6,234",
    icon: UserCheck,
    change: "+3%",
    changeType: "positive" as const,
  },
  {
    title: "Total Records",
    value: "45,892",
    icon: BarChart3,
    change: "+15%",
    changeType: "positive" as const,
  },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin console</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <Card key={card.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                <p className={`text-sm mt-2 ${card.changeType === "positive" ? "text-green-600" : "text-red-600"}`}>
                  {card.change} from last month
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <card.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h3>
          <ChartPlaceholder type="pie" />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trends</h3>
          <ChartPlaceholder type="line" />
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: "New Pokémon added", user: "John Doe", time: "2 minutes ago" },
            { action: "User profile updated", user: "Jane Smith", time: "5 minutes ago" },
            { action: "Data export completed", user: "System", time: "10 minutes ago" },
            { action: "New user registered", user: "Mike Johnson", time: "15 minutes ago" },
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
            >
              <div>
                <p className="font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">by {activity.user}</p>
              </div>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
