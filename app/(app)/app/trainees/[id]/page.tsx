"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function RefereeDetailsPage() {
  const params = useParams();
  const refereeId = params.id as string;

  const [referee, setReferee] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadReferee();
  }, []);

  async function loadReferee() {
    try {
      const res = await fetch(`${API}/api/trainees/${refereeId}`);

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Erro ao carregar árbitro");
        return;
      }

      setReferee(data);
    } catch {
      setError("Erro ao carregar árbitro");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  if (!referee) {
    return <div>Árbitro não encontrado.</div>;
  }

  const profile = referee.referee_profiles;

  return (
    <div className="space-y-6 text-zinc-900">
      <Link
        href={`/app/trainees/${referee.id}/edit`}
        className="rounded-md bg-blue-600 text-white px-4 py-2"
      >
        Editar
      </Link>
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-zinc-200 flex items-center justify-center text-2xl font-bold">
          {referee.name?.charAt(0)}
        </div>

        <div>
          <h1 className="text-3xl font-semibold">
            {referee.name}
          </h1>

          <p className="text-zinc-500">
            {profile?.main_role}
          </p>
        </div>
      </div>

      {/* Dados Pessoais */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">
          Dados Pessoais
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Info label="Nome" value={referee.name} />
          <Info label="Data de Nascimento" value={profile?.birth_date} />
          <Info label="Sexo" value={profile?.sex} />
          <Info label="CPF" value={profile?.cpf} />
          <Info label="RG" value={profile?.rg} />
        </div>
      </section>

      {/* Contato */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">
          Contato
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Info label="Telefone" value={profile?.phone} />
          <Info label="E-mail" value={referee.email} />
        </div>
      </section>

      {/* Endereço */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">
          Endereço
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Info label="Cidade" value={profile?.city} />
          <Info label="Estado" value={profile?.state} />
        </div>
      </section>

      {/* Profissional */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">
          Informações Profissionais
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Info label="Federação" value={profile?.federation} />
          <Info label="Categoria" value={profile?.category} />
          <Info label="Função Principal" value={profile?.main_role} />
          <Info
            label="Início na Arbitragem"
            value={profile?.arbitration_start_date}
          />
        </div>
      </section>

      {/* Dados Físicos */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">
          Dados Físicos
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Info label="Altura" value={`${profile?.height ?? "-"} cm`} />
          <Info label="Peso" value={`${profile?.weight ?? "-"} kg`} />
          <Info label="Perna Dominante" value={profile?.dominant_leg} />
        </div>
      </section>

      {/* Saúde */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">
          Saúde e Limitações
        </h2>

        <div className="space-y-4">
          <Info
            label="Possui Limitação Física?"
            value={
              profile?.has_physical_limitation
                ? "Sim"
                : "Não"
            }
          />

          <Info
            label="Descrição"
            value={
              profile?.physical_limitation_description
            }
          />
        </div>
      </section>

      {/* Tecnologia */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">
          Experiência Tecnológica
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <Info
            label="Já utilizou VR?"
            value={
              profile?.has_used_vr_before
                ? "Sim"
                : "Não"
            }
          />

          <Info
            label="Uso de Tecnologia"
            value={profile?.technology_usage_frequency}
          />
        </div>
      </section>

      {/* Perfil */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">
          Perfil de Treinamento
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          <Info
            label="Objetivo"
            value={profile?.training_goal}
          />

          <Info
            label="Experiência"
            value={profile?.experience_level}
          />

          <Info
            label="Disponibilidade"
            value={profile?.weekly_availability}
          />
        </div>
      </section>

      {/* Dashboard */}
      <section className="rounded-lg border bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">
          Estatísticas
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <StatCard
            title="Treinamentos"
            value="0"
          />

          <StatCard
            title="Sessões VR"
            value="0"
          />

          <StatCard
            title="Horas"
            value="0"
          />

          <StatCard
            title="Média Geral"
            value="-"
          />

        </div>
      </section>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div>
      <div className="text-sm text-zinc-500">
        {label}
      </div>

      <div className="font-medium">
        {value || "-"}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-zinc-500">
        {title}
      </div>

      <div className="text-2xl font-bold mt-2">
        {value}
      </div>
    </div>
  );
}