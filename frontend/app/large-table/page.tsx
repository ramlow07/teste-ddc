"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Search } from "lucide-react"

// Generate large dataset
const generateLargeData = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Record ${i + 1}`,
    value: (Math.random() * 1000).toFixed(2),
    timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString().split("T")[0],
    details: `Details for record ${i + 1} with additional information`,
  }))
}

const largeData = generateLargeData(1000)

export default function LargeTablePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const filteredData = largeData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    {
      key: "value",
      label: "Value",
      render: (item: any) => <span className="font-mono text-green-600">${item.value}</span>,
    },
    { key: "timestamp", label: "Timestamp" },
    {
      key: "details",
      label: "Details",
      render: (item: any) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 truncate">{item.details}</p>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Large Table</h1>
        <p className="text-gray-600 mt-2">
          Optimized view for large datasets ({largeData.length.toLocaleString()} records)
        </p>
      </div>

      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search records..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10"
          />
        </div>
      </Card>

      <Card>
        <div className="p-4 border-b">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length}{" "}
            records
          </p>
        </div>
        <Table data={paginatedData} columns={columns} />
        <div className="p-4 border-t">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </Card>
    </div>
  )
}
