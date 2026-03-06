// import { sessions, situations } from "@/app/data/seed";

// export default function DashboardPage() {
//   return (
//     <div className="space-y-6">
//       <h1 className="text-2xl font-semibold text-[color:var(--neutral)]">Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card title="Sessões" value={sessions.length} />
//         <Card title="Situações" value={situations.length} />
//         <Card title="Última sessão" value={sessions[0]?.code ?? "-"} />
//       </div>
//     </div>
//   );
// }

// function Card({ title, value }: { title: string; value: string | number }) {
//   return (
//     <div className="rounded-lg border bg-white p-4">
//       <div className="text-xs text-zinc-500">{title}</div>
//       <div className="text-2xl font-semibold text-[color:var(--primary)]">{value}</div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;
const TRAINER_ID = localStorage.getItem("trainer_id");

type Summary = {
  kpis: {
    situationsActive: number;
    sessionsTotal: number;
    sessionsActive: number;
    decisionsTotal: number;
    decisionsCorrect: number;
    accuracy: number | null;
    windowDays: number;
  };
  recentSessions: Array<{
    id: string;
    code: string;
    name: string | null;
    isActive: boolean;
    created_at: string;
    ended_at: string | null;
    referee_id: string;
  }>;
};

function pct(v: number | null) {
  if (v === null) return "-";
  return `${Math.round(v * 100)}%`;
}

export default function DashboardPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);

    if (!API) {
      setError("NEXT_PUBLIC_API_BASE_URL não configurada.");
      return;
    }
    if (!TRAINER_ID) {
      setError("NEXT_PUBLIC_TRAINER_ID não configurada.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/dashboard/summary?trainerId=${TRAINER_ID}&days=30`);
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        setError(json?.error ?? `Erro ao carregar dashboard: ${res.status}`);
        return;
      }

      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const k = data?.kpis;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-semibold text-[color:var(--neutral)]">Dashboard</h1>
        <button
          onClick={load}
          disabled={loading}
          className="rounded-md px-3 py-2 text-sm text-white bg-[color:var(--primary)] hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Atualizando..." : "Atualizar"}
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border bg-white p-4 text-sm text-red-600">{error}</div>
      ) : null}

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-zinc-500">Situações ativas</div>
          <div className="mt-1 text-2xl font-semibold text-[color:var(--neutral)]">
            {k ? k.situationsActive : "-"}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-zinc-500">Sessões (total)</div>
          <div className="mt-1 text-2xl font-semibold text-[color:var(--neutral)]">
            {k ? k.sessionsTotal : "-"}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            Ativas: {k ? k.sessionsActive : "-"}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-zinc-500">Decisões (últimos 30 dias)</div>
          <div className="mt-1 text-2xl font-semibold text-[color:var(--neutral)]">
            {k ? k.decisionsTotal : "-"}
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            Corretas: {k ? k.decisionsCorrect : "-"}
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="text-xs text-zinc-500">Acurácia (últimos 30 dias)</div>
          <div className="mt-1 text-2xl font-semibold text-[color:var(--neutral)]">
            {k ? pct(k.accuracy) : "-"}
          </div>
        </div>
      </div>

      {/* Sessões recentes */}
      <div className="rounded-lg border bg-white overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="text-sm font-semibold text-[color:var(--neutral)]">Sessões recentes</div>
            <div className="text-xs text-zinc-500">Últimas 8 sessões criadas</div>
          </div>

          <Link
            href="/app/sessions"
            className="text-sm text-[color:var(--primary)] hover:underline"
          >
            Ver todas
          </Link>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="text-left p-3">Código</th>
              <th className="text-left p-3">Nome</th>
              <th className="text-left p-3">Status</th>
              <th className="text-left p-3">Criado</th>
              <th className="text-left p-3"></th>
            </tr>
          </thead>

          <tbody>
            {(data?.recentSessions ?? []).map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3 font-medium text-[color:var(--neutral)]">{s.code}</td>
                <td className="p-3">{s.name ?? "-"}</td>
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      s.isActive ? "bg-green-100 text-green-700" : "bg-zinc-200 text-zinc-600"
                    }`}
                  >
                    {s.isActive ? "Ativa" : "Finalizada"}
                  </span>
                </td>
                <td className="p-3 text-zinc-500">
                  {new Date(s.created_at).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <Link
                    href={`/app/sessions/${s.code}`}
                    className="text-[color:var(--primary)] hover:underline"
                  >
                    Abrir
                  </Link>
                </td>
              </tr>
            ))}

            {(data?.recentSessions ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-zinc-400">
                  Nenhuma sessão ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}