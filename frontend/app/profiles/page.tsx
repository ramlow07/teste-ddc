import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

const profileData = [
  {
    id: 1,
    bio: "Passionate Pokémon trainer and researcher with over 10 years of experience.",
    userName: "John Doe",
    userEmail: "john@example.com",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    bio: "Competitive battler specializing in Electric-type Pokémon strategies.",
    userName: "Jane Smith",
    userEmail: "jane@example.com",
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    bio: "Pokémon breeder focused on rare and shiny variants.",
    userName: "Mike Johnson",
    userEmail: "mike@example.com",
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    bio: "Gym leader and mentor helping new trainers start their journey.",
    userName: "Sarah Wilson",
    userEmail: "sarah@example.com",
    createdAt: "2024-01-12",
  },
]

export default function ProfilesPage() {
  const columns = [
    {
      key: "bio",
      label: "Bio",
      render: (profile: any) => (
        <div className="max-w-md">
          <p className="text-sm text-gray-900 truncate">{profile.bio}</p>
        </div>
      ),
    },
    {
      key: "user",
      label: "User",
      render: (profile: any) => (
        <div>
          <p className="font-medium text-gray-900">{profile.userName}</p>
          <p className="text-sm text-gray-600">{profile.userEmail}</p>
        </div>
      ),
    },
    { key: "createdAt", label: "Created At" },
    {
      key: "actions",
      label: "Actions",
      render: (profile: any) => (
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Profiles</h1>
        <p className="text-gray-600 mt-2">Manage user profiles and bios</p>
      </div>

      <Card>
        <Table data={profileData} columns={columns} />
      </Card>
    </div>
  )
}
