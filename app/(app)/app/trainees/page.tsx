"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Trainee = {
  id: string;
  name: string;
  email: string | null;
  created_at: string;
  isActive: boolean;
};

function apiBase() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL não configurada no front");
  return base;
}

export default function TraineesPage() {
  const [items, setItems] = useState<Trainee[]>([]);
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // pega trainerId do localStorage
  useEffect(() => {
    const id = localStorage.getItem("trainer_id");
    setTrainerId(id);
  }, []);

  async function load(id: string) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${apiBase()}/api/trainees?trainerId=${id}&isActive=true`
      );

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.error ?? "Erro ao carregar treinados");
      }

      setItems(json.items ?? []);
    } catch (err: any) {
      setError(err.message ?? "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (trainerId) {
      load(trainerId);
    }
  }, [trainerId]);

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-semibold text-[color:var(--neutral)]">
          Treinados
        </h1>

        <Link
          href="/app/trainees/new"
          className="rounded-md px-3 py-2 text-sm text-white bg-[color:var(--primary)] hover:opacity-90"
        >
          Novo treinado
        </Link>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="text-left p-3">Nome</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Criado</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-zinc-400">
                  Carregando...
                </td>
              </tr>
            )}

            {error && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              items.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-3 font-medium text-[color:var(--neutral)]">
                    {t.name}
                  </td>

                  <td className="p-3 text-zinc-600">{t.email ?? "-"}</td>

                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        t.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-zinc-200 text-zinc-600"
                      }`}
                    >
                      {t.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </td>

                  <td className="p-3 text-zinc-500">
                    {new Date(t.created_at).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}

            {!loading && !error && items.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-zinc-400">
                  Nenhum treinado cadastrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}