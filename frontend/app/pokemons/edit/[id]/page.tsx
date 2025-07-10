"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const pokemonTypes = [
  "Normal",
  "Fire",
  "Water",
  "Electric",
  "Grass",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dragon",
  "Dark",
  "Steel",
  "Fairy",
]

export default function EditPokemonPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    ability: "",
    imageUrl: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading existing pokemon data
    setTimeout(() => {
      setFormData({
        name: "Pikachu",
        type: "Electric",
        ability: "Static",
        imageUrl: "/placeholder.svg?height=200&width=200",
      })
      setLoading(false)
    }, 500)
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.type) newErrors.type = "Type is required"
    if (!formData.ability) newErrors.ability = "Ability is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Handle form submission
    console.log("Updating pokemon:", formData)
    router.push("/pokemons")
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/pokemons">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Pokémon</h1>
          <p className="text-gray-600 mt-2">Update Pokémon information</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                error={errors.name}
                placeholder="Enter Pokémon name"
              />
            </div>

            <div>
              <Select
                label="Type"
                value={formData.type}
                onChange={(value) => handleChange("type", value)}
                error={errors.type}
                placeholder="Select type"
                options={pokemonTypes.map((type) => ({ value: type, label: type }))}
              />
            </div>

            <div>
              <Input
                label="Ability"
                value={formData.ability}
                onChange={(e) => handleChange("ability", e.target.value)}
                error={errors.ability}
                placeholder="Enter ability"
              />
            </div>

            <div>
              <Input
                label="Image URL"
                value={formData.imageUrl}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
                placeholder="Enter image URL (optional)"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Link href="/pokemons">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button type="submit">Update Pokémon</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
