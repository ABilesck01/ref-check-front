"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type SituationType = "falta" | "impedimento" | "penalti" | "cartao" | "outro";

export default function NewSituationPage() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<SituationType>("falta");
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(2);
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => {
    const e: string[] = [];
    if (title.trim().length < 3) e.push("Título precisa ter pelo menos 3 caracteres.");
    if (!type) e.push("Tipo é obrigatório.");
    if (![1, 2, 3, 4, 5].includes(difficulty)) e.push("Dificuldade inválida.");
    return e;
  }, [title, type, difficulty]);

  const payload = useMemo(() => {
    return {
      id: "TEMP-" + Math.random().toString(16).slice(2, 10),
      title: title.trim(),
      type,
      difficulty,
      description: description.trim() || undefined,
      createdAt: new Date().toISOString().slice(0, 10),
    };
  }, [title, type, difficulty, description]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    // Aqui depois você pluga persistência (API).
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[color:var(--neutral)]">Nova Situação</h1>
          <p className="text-sm text-zinc-600">Cadastro manual (salvamento ainda simulado).</p>
        </div>

        <Link href="/app/situations" className="text-sm text-[color:var(--secondary)] hover:underline">
          Voltar
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FORM */}
        <form onSubmit={onSubmit} className="rounded-lg border bg-white p-5 space-y-4">
          <Field label="Título">
            <input
              className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--secondary)]"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Carrinho por trás"
            />
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Tipo">
              <select
                className="w-full rounded-md border px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[color:var(--secondary)]"
                value={type}
                onChange={(e) => setType(e.target.value as SituationType)}
              >
                <option value="falta">Falta</option>
                <option value="impedimento">Impedimento</option>
                <option value="penalti">Pênalti</option>
                <option value="cartao">Cartão</option>
                <option value="outro">Outro</option>
              </select>
            </Field>

            <Field label="Dificuldade">
              <select
                className="w-full rounded-md border px-3 py-2 text-sm bg-white outline-none focus:ring-2 focus:ring-[color:var(--secondary)]"
                value={difficulty}
                onChange={(e) => setDifficulty(Number(e.target.value) as any)}
              >
                <option value={1}>1 (Fácil)</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5 (Difícil)</option>
              </select>
            </Field>
          </div>

          <Field label="Descrição (opcional)">
            <textarea
              className="w-full min-h-28 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--secondary)]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contexto do lance, o que avaliar, detalhes…"
            />
          </Field>

          {submitted && errors.length > 0 && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              <div className="font-semibold mb-1">Ajuste antes de salvar:</div>
              <ul className="list-disc ml-5">
                {errors.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md px-4 py-2 text-sm text-white bg-[color:var(--primary)] hover:opacity-90 disabled:opacity-50"
              disabled={errors.length > 0 && submitted}
            >
              Salvar (simulado)
            </button>

            <Link
              href="/app/situations"
              className="rounded-md px-4 py-2 text-sm border bg-white hover:bg-zinc-50 text-[color:var(--neutral)]"
            >
              Cancelar
            </Link>
          </div>
        </form>

        {/* PREVIEW */}
        <div className="rounded-lg border bg-white p-5 space-y-3">
          <div className="text-sm font-semibold text-[color:var(--neutral)]">Preview do registro</div>
          <div className="text-xs text-zinc-500">
            Isso é exatamente o que você enviaria para a API depois.
          </div>

          <div className="rounded-md bg-zinc-50 border p-3 text-sm">
            <div className="font-semibold text-[color:var(--neutral)]">{payload.title || "—"}</div>
            <div className="text-zinc-600 mt-1">
              Tipo: <span className="font-medium">{payload.type}</span> • Dificuldade:{" "}
              <span className="font-medium">{payload.difficulty}</span>
            </div>
            {payload.description && <div className="text-zinc-600 mt-2">{payload.description}</div>}
            <div className="text-xs text-zinc-500 mt-2">createdAt: {payload.createdAt}</div>
          </div>

          <pre className="text-xs rounded-md border bg-white p-3 overflow-auto">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <div className="text-xs font-medium text-zinc-600">{label}</div>
      {children}
    </label>
  );
}
