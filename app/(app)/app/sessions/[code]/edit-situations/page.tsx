"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

type SessionDetail = {
  id: string;      // <-- IMPORTANTE: precisa vir do endpoint /api/sessions/{code}
  code: string;
  name: string | null;
  situations?: Array<{
    sessionSituationId: string;
    orderIndex: number;
    situation: {
      id: string;
      title: string;
      description: string;
      expected_decision: string;
    };
  }>;
};

type SituationItem = {
  id: string;
  title: string;
  description: string;
  expected_decision: string;
  isActive: boolean;
};

export default function SessionSituationsPage() {
  const params = useParams<{ code: string }>();
  const router = useRouter();

  const code = params.code;

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [situations, setSituations] = useState<SituationItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]); // lista em ordem
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function requireApi() {
    if (!API) throw new Error("NEXT_PUBLIC_API_BASE_URL não configurada no .env.local do FRONT");
    return API;
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const api = requireApi();

        // 1) buscar sessão por code (precisa vir com id)
        const sRes = await fetch(`${api}/api/sessions/${encodeURIComponent(code)}`, {
          cache: "no-store",
        });
        const sJson = await sRes.json().catch(() => null);

        if (!sRes.ok) {
          throw new Error(sJson?.error ?? `Erro ao carregar sessão (${sRes.status})`);
        }

        // 2) listar situações
        const sitRes = await fetch(`${api}/api/situations?isActive=true`, { cache: "no-store" });
        const sitJson = await sitRes.json().catch(() => null);

        if (!sitRes.ok) {
          throw new Error(sitJson?.error ?? `Erro ao carregar situações (${sitRes.status})`);
        }

        if (cancelled) return;

        setSession(sJson);

        const items: SituationItem[] = sitJson?.items ?? [];
        setSituations(items);

        // 3) pré-selecionar o que já estiver na sessão (ordem do orderIndex)
        const existing = (sJson?.situations ?? [])
          .slice()
          .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
          .map((x: any) => x.situation?.id)
          .filter(Boolean);

        setSelected(existing);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Erro desconhecido");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [code]);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id); // remove
      return [...prev, id]; // adiciona no final (ordem)
    });
  }

  function move(id: string, dir: -1 | 1) {
    setSelected((prev) => {
      const idx = prev.indexOf(id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;

      const copy = prev.slice();
      const tmp = copy[idx];
      copy[idx] = copy[newIdx];
      copy[newIdx] = tmp;
      return copy;
    });
  }

  async function save() {
    if (!session?.id) {
      setError("Sessão sem id (o endpoint /api/sessions/{code} precisa retornar id).");
      return;
    }

    if (selected.length === 0) {
      setError("Selecione pelo menos 1 situação.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const api = requireApi();

      const res = await fetch(`${api}/api/sessions/${session.code}/situations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ situationIds: selected, replace: true }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(json?.error ?? `Erro ao salvar (${res.status})`);
      }

      // volta pro detalhe
      router.push(`/app/sessions/${session.code}`);
    } catch (e: any) {
      setError(e?.message ?? "Erro desconhecido ao salvar");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-zinc-700">Carregando...</div>;
  }

  if (error) {
    return (
      <div className="space-y-3 text-zinc-900">
        <div className="rounded-lg border bg-white p-4">
          <div className="font-semibold text-red-600">Erro</div>
          <div className="text-sm text-zinc-700 mt-1">{error}</div>
        </div>
        <button
          className="rounded-md bg-black px-4 py-2 text-white"
          onClick={() => location.reload()}
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  const title = session?.name?.trim() ? session.name : `Sessão ${session?.code ?? ""}`;

  return (
    <div className="space-y-4 text-zinc-900">
      <div className="rounded-lg border bg-white p-4">
        <div className="text-xl font-semibold">Situações da sessão</div>
        <div className="text-sm text-zinc-600 mt-1">{title}</div>
        <div className="text-xs text-zinc-500 mt-1">
          Selecionadas: <span className="font-medium">{selected.length}</span>
        </div>
      </div>

      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="grid gap-3">
        {situations.map((s) => {
          const checked = selectedSet.has(s.id);
          const orderIndex = checked ? selected.indexOf(s.id) : -1;

          return (
            <div key={s.id} className="rounded-lg border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={checked}
                    onChange={() => toggle(s.id)}
                  />
                  <div>
                    <div className="font-semibold">{s.title}</div>
                    {s.description ? (
                      <div className="text-sm text-zinc-600 mt-1">{s.description}</div>
                    ) : null}
                    <div className="text-sm text-zinc-500 mt-2">
                      Esperado: <span className="font-medium">{s.expected_decision}</span>
                      {checked ? (
                        <>
                          {" • "}Ordem: <span className="font-medium">{orderIndex + 1}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </label>

                {checked ? (
                  <div className="flex gap-2">
                    <button
                      className="rounded-md border px-3 py-1 text-sm hover:bg-zinc-50"
                      onClick={() => move(s.id, -1)}
                      disabled={orderIndex <= 0}
                      title="Subir"
                    >
                      ↑
                    </button>
                    <button
                      className="rounded-md border px-3 py-1 text-sm hover:bg-zinc-50"
                      onClick={() => move(s.id, 1)}
                      disabled={orderIndex < 0 || orderIndex >= selected.length - 1}
                      title="Descer"
                    >
                      ↓
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          onClick={save}
          disabled={saving || selected.length === 0}
          className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
        >
          {saving ? "Salvando..." : "Salvar situações"}
        </button>

        <button
          onClick={() => router.push(`/app/sessions/${session?.code}`)}
          className="rounded-md border px-4 py-2"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
