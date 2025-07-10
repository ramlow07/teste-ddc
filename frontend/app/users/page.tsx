"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { Modal } from "@/components/ui/modal"
import { Pagination } from "@/components/ui/pagination"
import { Plus, Edit, Trash2 } from "lucide-react"

const userData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike@example.com",
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    createdAt: "2024-01-12",
  },
  {
    id: 5,
    name: "David Brown",
    email: "david@example.com",
    createdAt: "2024-01-11",
  },
]

export default function UsersPage() {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: any }>({
    isOpen: false,
    user: null,
  })

  const handleDelete = (user: any) => {
    setDeleteModal({ isOpen: true, user })
  }

  const confirmDelete = () => {
    console.log("Deleting user:", deleteModal.user)
    setDeleteModal({ isOpen: false, user: null })
  }

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "createdAt", label: "Created At" },
    {
      key: "actions",
      label: "Actions",
      render: (user: any) => (
        <div className="flex space-x-2">
          <Link href={`/users/edit/${user.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(user)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">Manage user accounts</p>
        </div>
        <Link href="/users/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>

      <Card>
        <Table data={userData} columns={columns} />
        <div className="p-4 border-t">
          <Pagination currentPage={1} totalPages={8} onPageChange={(page) => console.log("Page:", page)} />
        </div>
      </Card>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        title="Delete User"
        description={`Are you sure you want to delete ${deleteModal.user?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </div>
  )
}
