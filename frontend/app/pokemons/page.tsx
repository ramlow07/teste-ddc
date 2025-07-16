"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { Plus, Edit, Trash2 } from "lucide-react";

import {
  GET_POKEMONS_QUERY,
  DELETE_POKEMON_MUTATION,
} from "@/lib/graphql/pokemon";
import { request, GraphQLClient, gql } from "graphql-request";

export default function PokemonsPage() {
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    pokemon: any;
  }>({
    isOpen: false,
    pokemon: null,
  });

  const [pokemon, setPokemon] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = (pokemon: any) => {
    setDeleteModal({ isOpen: true, pokemon });
  };

  const confirmDelete = async () => {
    if (!deleteModal.pokemon || !token) return;

    try {
      const endpoint = "http://localhost:3001/graphql";
      const variables = {
        data: {
          id: deleteModal.pokemon.id,
        },
      };

      const res = await request(endpoint, DELETE_POKEMON_MUTATION, variables, {
        Authorization: `Bearer ${token}`,
      });

      const deleted = res.deletePokemon?.data?.items?.[0];
      if (deleted) {
        setPokemon((prev) => prev.filter((p) => p.id !== deleted.id));
        alert(`Pokémon "${deleted.name}" deletado com sucesso!`);
      } else {
        alert("Erro ao deletar Pokémon.");
      }
    } catch (err) {
      console.error("Erro ao deletar Pokémon:", err);
      alert("Erro inesperado ao deletar.");
    } finally {
      setDeleteModal({ isOpen: false, pokemon: null });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        if (!storedToken) throw new Error("Usuário não autenticado");

        setToken(storedToken);

        const endpoint = "http://localhost:3001/graphql";
        const client = new GraphQLClient(endpoint, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const variables = {
          data: {
            take: 20,
            skip: (currentPage - 1) * 10,
          },
        };

        const res = await client.request(GET_POKEMONS_QUERY, variables);
        const items = res.getPokemons?.data?.items || [];
        console.log("Resposta completa:", res);
        setPokemon(items);
      } catch (err) {
        console.error("Erro ao buscar pokemons:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

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
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(pokemon)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

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
        <Table data={pokemon} columns={columns} />
        <div className="p-4 border-t">
          <Pagination
            currentPage={currentPage}
            totalPages={10}
            onPageChange={(page) => setCurrentPage(page)}
          />
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
  );
}
