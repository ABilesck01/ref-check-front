"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

type Trainee = {
  id: string;
  name: string;
  email: string | null;
};

export default function NewSessionPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [refereeId, setRefereeId] = useState("");

  const [trainees, setTrainees] = useState<Trainee[]>([]);
  const [loadingTrainees, setLoadingTrainees] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trainerId, setTrainerId] = useState<string | null>(null);

  useEffect(() => {
    setTrainerId(localStorage.getItem("trainer_id"));
  }, []);


  async function loadTrainees() {
    setError(null);

    if (!API) {
      setError("NEXT_PUBLIC_API_BASE_URL não configurada.");
      return;
    }
    if (!trainerId) {
      setError("NEXT_PUBLIC_TRAINER_ID não configurada.");
      return;
    }

    setLoadingTrainees(true);
    try {
      const res = await fetch(
        `${API}/api/trainees?trainerId=${trainerId}&isActive=true`,
        { method: "GET" }
      );

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setError(json?.error ?? `Erro ao carregar treinados: ${res.status}`);
        return;
      }

      const items: Trainee[] = json?.items ?? [];
      setTrainees(items);

      // auto-seleciona o primeiro
      if (items.length > 0) {
        setRefereeId((prev) => prev || items[0].id);
      } else {
        setRefereeId("");
      }
    } catch (e: any) {
      setError(e?.message ?? "Erro desconhecido ao carregar treinados");
    } finally {
      setLoadingTrainees(false);
    }
  }

  useEffect(() => {
    loadTrainees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const traineeOptions = useMemo(() => {
    if (loadingTrainees) return [{ value: "", label: "Carregando..." }];
    if (trainees.length === 0) return [{ value: "", label: "Nenhum treinado cadastrado" }];

    return trainees.map((t) => ({
      value: t.id,
      label: t.email ? `${t.name} (${t.email})` : t.name,
    }));
  }, [loadingTrainees, trainees]);

  async function onCreate() {
    setError(null);

    if (!API) {
      setError("NEXT_PUBLIC_API_BASE_URL não configurada.");
      return;
    }
    if (!trainerId) {
      setError("NEXT_PUBLIC_TRAINER_ID não configurada.");
      return;
    }
    if (!refereeId) {
      setError("Selecione um treinado.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/sessions/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || null,
          refereeId,
          createdByTrainerId: trainerId,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setError(json?.error ?? `Erro ao criar: ${res.status}`);
        return;
      }

      router.push(`/app/sessions/${json.code}`);
    } catch (e: any) {
      setError(e?.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  const disableCreate =
    loading ||
    loadingTrainees ||
    trainees.length === 0 ||
    !refereeId;

  return (
    <div className="space-y-4 text-zinc-900">
      <h1 className="text-2xl font-semibold">Criar sessão</h1>

      <div className="rounded-lg border bg-white p-4 space-y-3">
        <div>
          <label className="block text-sm text-zinc-600">Nome do treino</label>
          <input
            className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Treino 1"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-600">Treinado</label>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
            value={refereeId}
            onChange={(e) => setRefereeId(e.target.value)}
            disabled={loadingTrainees || trainees.length === 0}
          >
            {traineeOptions.map((opt) => (
              <option key={opt.label} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button
          onClick={onCreate}
          disabled={disableCreate}
          className="rounded-md bg-black text-white px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Criando..." : "Criar sessão"}
        </button>

        <div className="text-xs text-zinc-500">
          O código da sessão é gerado automaticamente (6 caracteres).
        </div>
      </div>
    </div>
  );
}