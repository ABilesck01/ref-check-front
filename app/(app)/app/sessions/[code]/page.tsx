"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type SessionDetail = {
  id: string;
  code: string;
  name: string | null;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
  isActive: boolean;
  createdByTrainerId: string | null;
  refereeId: string | null;
  trainerName?: string | null;
  refereeName?: string | null;
  situations: Array<{
    sessionSituationId: string;
    orderIndex: number;
    spawnedAt: string | null;
    isActive: boolean;
    situation: {
      id: string;
      code: string;
      title: string;
      description: string;
      expected_decision: string;
      isActive: boolean;
    };
  }>;
};

function apiBase() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || "";
}

export default function SessionDetailPage() {
  const router = useRouter();
  const params = useParams<{ code: string }>();
  const code = params.code;

  const [session, setSession] = useState<SessionDetail | null>(null);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setError(null);

      const trainerId = localStorage.getItem("trainer_id");
      if (!trainerId) {
        router.replace("/login");
        return;
      }

      const base = apiBase();
      const qs = `?trainerId=${encodeURIComponent(trainerId)}`;

      const sRes = await fetch(`${base}/api/sessions/${encodeURIComponent(code)}${qs}`, {
        cache: "no-store",
      });

      if (!sRes.ok) {
        const txt = await sRes.text().catch(() => "");
        setError(`Falha ao carregar sessão: ${sRes.status} ${txt}`);
        return;
      }

      const sJson = (await sRes.json()) as SessionDetail;
      setSession(sJson);

      const dRes = await fetch(`${base}/api/sessions/${encodeURIComponent(code)}/decisions${qs}`, {
        cache: "no-store",
      });

      const dJson = await dRes.json().catch(() => null);
      if (!dRes.ok) {
        setError(dJson?.error ?? `Erro ao carregar decisões (${dRes.status})`);
        return;
      }

      setDecisions(dJson?.items ?? []);
    }

    load();
  }, [code, router]);

  if (error) {
    return <div className="p-4 text-red-700">{error}</div>;
  }

  if (!session) {
    return <div className="p-4 text-zinc-600">Carregando...</div>;
  }

  const title = session.name?.trim() ? session.name : "Sessão de Treino";

  return (
    <div className="space-y-4 text-zinc-900">
      <div className="rounded-lg border bg-white p-4 text-zinc-900">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xl font-semibold">{title}</div>
            <div className="text-xs text-zinc-500 mt-1">
              Código da sessão: <span className="font-mono">{session.code}</span>
            </div>
          </div>
          <div className="text-sm text-zinc-600">
            <span className="font-medium">{session.isActive ? "Ativa" : "Inativa"}</span>
          </div>
        </div>

        <div className="text-sm text-zinc-600 mt-3">
          Situações: <span className="font-medium">{session.situations?.length ?? 0}</span>
        </div>

        {(session.refereeName || session.trainerName) ? (
          <div className="text-sm text-zinc-600 mt-1">
            Árbitro: <span className="font-medium">{session.refereeName ?? "—"}</span>
            {" • "}
            Treinador: <span className="font-medium">{session.trainerName ?? "—"}</span>
          </div>
        ) : null}
      </div>

      <div>
        <Link
          href={`/app/sessions/${session.code}/edit-situations`}
          className="rounded-md border px-3 py-2 text-sm hover:bg-zinc-50"
        >
          Editar situações
        </Link>
      </div>

      <div className="grid gap-3">
        {(session.situations ?? []).map((item) => (
          <div key={item.sessionSituationId} className="rounded-lg border bg-white p-4 text-zinc-900">
            <div className="text-xs text-zinc-500">Situação #{item.orderIndex + 1}</div>
            <div className="font-semibold mt-1">{item.situation.title}</div>
            {item.situation.description ? (
              <div className="text-sm text-zinc-600 mt-1">{item.situation.description}</div>
            ) : null}
            <div className="text-sm text-zinc-500 mt-2">
              Esperado: <span className="font-medium">{item.situation.expected_decision}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border bg-white p-4 text-zinc-900">
        <div className="text-lg font-semibold">Decisões</div>
        <div className="text-sm text-zinc-600 mt-1">
          Total: <span className="font-medium">{decisions.length}</span>
        </div>

        {decisions.length === 0 ? (
          <div className="text-sm text-zinc-500 mt-3">Ainda não há decisões registradas.</div>
        ) : (
          <div className="grid gap-3 mt-3">
            {decisions.map((d: any) => (
              <div key={d.id} className="rounded-lg border p-3">
                <div className="text-xs text-zinc-500">
                  Situação #{(d.session_situation?.order_index ?? 0) + 1} •{" "}
                  {d.session_situation?.situation?.title ?? "—"}
                </div>
                <div className="mt-1 text-sm">
                  Decisão: <span className="font-semibold">{d.decision_made}</span>
                  {" • "}
                  Esperado: <span className="font-medium">{d.session_situation?.situation?.expected_decision ?? "—"}</span>
                </div>
                <div className="text-sm text-zinc-600 mt-1">
                  {d.is_correct === null ? "Correção: —" : d.is_correct ? "✅ Correta" : "❌ Incorreta"}
                  {" • "}
                  Tempo: {d.decision_time_ms ?? "—"} ms
                  {" • "}
                  Metros: {d.meters_walked ?? "—"}
                </div>
                <div className="text-xs text-zinc-500 mt-2">
                  {new Date(d.decided_at).toLocaleString("pt-BR")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}