"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table } from "@/components/ui/table"
import { Modal } from "@/components/ui/modal"
import { Pagination } from "@/components/ui/pagination"
import { Plus, Edit, Trash2 } from "lucide-react"

const pokemonData = [
  {
    id: 1,
    name: "Pikachu",
    type: "Electric",
    ability: "Static",
    image: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Charizard",
    type: "Fire/Flying",
    ability: "Blaze",
    image: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-14",
  },
  {
    id: 3,
    name: "Blastoise",
    type: "Water",
    ability: "Torrent",
    image: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-13",
  },
  {
    id: 4,
    name: "Venusaur",
    type: "Grass/Poison",
    ability: "Overgrow",
    image: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-12",
  },
  {
    id: 5,
    name: "Gengar",
    type: "Ghost/Poison",
    ability: "Cursed Body",
    image: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-11",
  },
]

export default function PokemonsPage() {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; pokemon: any }>({
    isOpen: false,
    pokemon: null,
  })

  const handleDelete = (pokemon: any) => {
    setDeleteModal({ isOpen: true, pokemon })
  }

  const confirmDelete = () => {
    // Handle delete logic here
    console.log("Deleting pokemon:", deleteModal.pokemon)
    setDeleteModal({ isOpen: false, pokemon: null })
  }

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (pokemon: any) => (
        <img
          src={pokemon.image || "/placeholder.svg"}
          alt={pokemon.name}
          className="w-10 h-10 rounded-lg object-cover"
        />
      ),
    },
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "ability", label: "Ability" },
    { key: "createdAt", label: "Created At" },
    {
      key: "actions",
      label: "Actions",
      render: (pokemon: any) => (
        <div className="flex space-x-2">
          <Link href={`/pokemons/edit/${pokemon.id}`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="destructive" size="sm" onClick={() => handleDelete(pokemon)}>
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
          <h1 className="text-3xl font-bold text-gray-900">Pokémons</h1>
          <p className="text-gray-600 mt-2">Manage your Pokémon collection</p>
        </div>
        <Link href="/pokemons/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Pokémon
          </Button>
        </Link>
      </div>

      <Card>
        <Table data={pokemonData} columns={columns} />
        <div className="p-4 border-t">
          <Pagination currentPage={1} totalPages={10} onPageChange={(page) => console.log("Page:", page)} />
        </div>
      </Card>

      <Modal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, pokemon: null })}
        title="Delete Pokémon"
        description={`Are you sure you want to delete ${deleteModal.pokemon?.name}? This action cannot be undone.`}
        onConfirm={confirmDelete}
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </div>
  )
}
