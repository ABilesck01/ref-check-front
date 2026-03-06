"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function NewTraineePage() {
  const router = useRouter();
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      setTrainerId(localStorage.getItem("trainer_id"));
    }, []);

  async function onCreate() {
    setError(null);

    if (!API) {
      setError("NEXT_PUBLIC_API_BASE_URL não configurada.");
      return;
    }
    if (!name.trim()) {
      setError("Informe o nome do árbitro.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/trainees`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          createdByTrainerId : TRAINER_ID?.trim(),
          name: name.trim(),
          email: email.trim() || null,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setError(json?.error ?? `Erro ao criar: ${res.status}`);
        return;
      }

      // volta pra listagem
      router.push("/app/trainees");
    } catch (e: any) {
      setError(e?.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 text-zinc-900">
      <h1 className="text-2xl font-semibold">Novo árbitro</h1>

      <div className="rounded-lg border bg-white p-4 space-y-3">
        <div>
          <label className="block text-sm text-zinc-600">Nome</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: João Silva"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-600">Email (opcional)</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="joao@email.com"
          />
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button
          onClick={onCreate}
          disabled={loading}
          className="rounded-md bg-black text-white px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Salvar árbitro"}
        </button>
      </div>
    </div>
  );
}