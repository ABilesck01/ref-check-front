"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

type Row = {
  id: string;
  name: string;
  email: string | null;
  totalDecisions: number;
  correctDecisions: number;
  accuracy: number | null;
  avgDecisionTimeMs: number | null;
  sessionsCount: number;
};

function pct(v: number | null) {
  if (v === null) return "-";
  return `${Math.round(v * 100)}%`;
}

function ms(v: number | null) {
  if (v === null) return "-";
  if (v < 1000) return `${v} ms`;
  return `${(v / 1000).toFixed(1)} s`;
}

function csvEscape(v: any) {
  const s = String(v ?? "");
  const needs = /[",\n\r;]/.test(s);
  const escaped = s.replace(/"/g, '""');
  return needs ? `"${escaped}"` : escaped;
}

export default function ReportsPage() {
  const [trainerId, setTrainerId] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTrainerId(localStorage.getItem("trainer_id"));
  }, []);

  async function load() {

    setError(null);
    if (!API) return setError("NEXT_PUBLIC_API_BASE_URL não configurada.");
    if (!trainerId) return setError("NEXT_PUBLIC_TRAINER_ID não configurada.");

    setLoading(true);
    try {
      const res = await fetch(
        `${API}/api/reports/trainees/summary?trainerId=${trainerId}&days=${days}`
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setError(json?.error ?? `Erro: ${res.status}`);
        return;
      }
      setItems(json?.items ?? []);
    } catch (e: any) {
      setError(e?.message ?? "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const csvText = useMemo(() => {
    const header = [
      "Treinado",
      "Email",
      "Sessões",
      "Decisões (corretas)",
      "Decisões (total)",
      "Acurácia",
      "Tempo médio (ms)",
    ];

    const lines = [
      header.map(csvEscape).join(","),
      ...items.map((r) =>
        [
          r.name,
          r.email ?? "",
          r.sessionsCount,
          r.correctDecisions,
          r.totalDecisions,
          r.accuracy === null ? "" : (r.accuracy * 100).toFixed(0) + "%",
          r.avgDecisionTimeMs ?? "",
        ]
          .map(csvEscape)
          .join(",")
      ),
    ];

    return lines.join("\n");
  }, [items]);

  function exportCsv() {
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-treinados-${days}d.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  }

  function printPage() {
    window.print();
  }

  return (
    <div className="space-y-4 text-zinc-900">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--neutral)]">
            Relatórios
          </h1>
          <div className="text-sm text-zinc-500">
            Performance por treinado
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="rounded-md border bg-white px-3 py-2 text-sm text-zinc-900"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          >
            <option value={7}>Últimos 7 dias</option>
            <option value={30}>Últimos 30 dias</option>
            <option value={90}>Últimos 90 dias</option>
          </select>

          <button
            onClick={exportCsv}
            disabled={items.length === 0}
            className="rounded-md px-3 py-2 text-sm border bg-white text-zinc-900 hover:bg-zinc-50 disabled:opacity-60"
            title="Baixa um CSV com a tabela"
          >
            Exportar CSV
          </button>

          <button
            onClick={printPage}
            className="rounded-md px-3 py-2 text-sm border bg-white text-zinc-900 hover:bg-zinc-50"
            title="Imprimir / Salvar em PDF"
          >
            Imprimir
          </button>

          <button
            onClick={load}
            disabled={loading}
            className="rounded-md px-3 py-2 text-sm text-white bg-[color:var(--primary)] hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Atualizando..." : "Atualizar"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border bg-white p-4 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      <div className="rounded-lg border bg-white overflow-hidden">
        <table className="w-full text-sm text-zinc-900">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="text-left p-3">Treinado</th>
              <th className="text-left p-3">Sessões</th>
              <th className="text-left p-3">Decisões</th>
              <th className="text-left p-3">Acurácia</th>
              <th className="text-left p-3">Tempo médio</th>
            </tr>
          </thead>

          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-medium text-[color:var(--neutral)]">
                  <Link href={`/app/reports/${r.id}`} className="hover:underline">
                    {r.name}
                  </Link>
                  <div className="text-xs text-zinc-500">{r.email ?? ""}</div>
                </td>
                <td className="p-3">{r.sessionsCount}</td>
                <td className="p-3">
                  {r.correctDecisions}/{r.totalDecisions}
                </td>
                <td className="p-3">{pct(r.accuracy)}</td>
                <td className="p-3 text-zinc-700">{ms(r.avgDecisionTimeMs)}</td>
              </tr>
            ))}

            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-zinc-400">
                  Nenhum dado no período.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dica: deixa a impressão mais limpa */}
      <style jsx global>{`
        @media print {
          nav, aside, header, .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          table {
            page-break-inside: auto;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
        }
      `}</style>
    </div>
  );
}