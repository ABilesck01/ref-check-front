"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function NewTraineePage() {
    const router = useRouter();
    const params = useParams();
    const refereeId = params.id as string;
    
    const [trainerId, setTrainerId] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    
    const [birthDate, setBirthDate] = useState("");
    const [sex, setSex] = useState("");

    const [cpf, setCpf] = useState("");
    const [rg, setRg] = useState("");

    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    const [federation, setFederation] = useState("");
    const [category, setCategory] = useState("");
    const [mainRole, setMainRole] = useState("");
    const [arbitrationStartDate, setArbitrationStartDate] = useState("");

    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [dominantLeg, setDominantLeg] = useState("");

    const [hasPhysicalLimitation, setHasPhysicalLimitation] = useState("");
    const [physicalLimitationDescription, setPhysicalLimitationDescription] = useState("");

    const [hasUsedVrBefore, setHasUsedVrBefore] = useState("");
    const [technologyUsageFrequency, setTechnologyUsageFrequency] = useState("");

    const [trainingGoal, setTrainingGoal] = useState("");
    const [experienceLevel, setExperienceLevel] = useState("");
    const [weeklyAvailability, setWeeklyAvailability] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (refereeId) {
        loadReferee();
    }
    }, [refereeId]);

    async function loadReferee() {
        try {
            const res = await fetch(
            `${API}/api/trainees/${refereeId}`
            );

            const data = await res.json();

            const p = data.referee_profiles;

            setName(data.name ?? "");
            setEmail(data.email ?? "");

            setBirthDate(p?.birth_date ?? "");
            setSex(p?.sex ?? "");

            setCpf(p?.cpf ?? "");
            setRg(p?.rg ?? "");

            setPhone(p?.phone ?? "");

            setCity(p?.city ?? "");
            setState(p?.state ?? "");

            setFederation(p?.federation ?? "");
            setCategory(p?.category ?? "");
            setMainRole(p?.main_role ?? "");

            setArbitrationStartDate(
            p?.arbitration_start_date ?? ""
            );

            setHeight(String(p?.height ?? ""));
            setWeight(String(p?.weight ?? ""));

            setDominantLeg(
            p?.dominant_leg ?? ""
            );

            setHasPhysicalLimitation(
            p?.has_physical_limitation
                ? "SIM"
                : "NAO"
            );

            setPhysicalLimitationDescription(
            p?.physical_limitation_description ?? ""
            );

            setHasUsedVrBefore(
            p?.has_used_vr_before
                ? "SIM"
                : "NAO"
            );

            setTechnologyUsageFrequency(
            p?.technology_usage_frequency ?? ""
            );

            setTrainingGoal(
            p?.training_goal ?? ""
            );

            setExperienceLevel(
            p?.experience_level ?? ""
            );

            setWeeklyAvailability(
            p?.weekly_availability ?? ""
            );
        } catch (err) {
            console.error(err);
        }
        }

  async function onSave() {
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
      const res = await fetch(`${API}/api/trainees/${refereeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          createdByTrainerId: trainerId,

          name,
          birthDate,
          sex,

          cpf,
          rg,

          phone,
          email,

          city,
          state,

          federation,
          category,
          mainRole,
          arbitrationStartDate,

          height: height ? Number(height) : null,
          weight: weight ? Number(weight) : null,

          dominantLeg,

          hasPhysicalLimitation,
          physicalLimitationDescription,

          hasUsedVrBefore,
          technologyUsageFrequency,

          trainingGoal,
          experienceLevel,
          weeklyAvailability,
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
      <h1 className="text-2xl font-semibold">Editar árbitro</h1>

        <div className="rounded-lg border bg-white p-4 space-y-6">

        {/* Dados Pessoais */}
        <div>
          <h2 className="text-lg font-medium mb-3">
            Dados Pessoais
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm text-zinc-600">
                Nome Completo
              </label>
              <input
                className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: João Silva"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-zinc-600">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-600">
                  Sexo
                </label>

                <select value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white">
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Documentação */}
        <div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-600">
                CPF
              </label>
              <input
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-600">
                RG
              </label>
              <input
                value={rg}
                onChange={(e) => setRg(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
                placeholder="00.000.000-0"
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-600">
                Telefone
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
                placeholder="(15) 99999-9999"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-600">
                E-mail
              </label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="joao@email.com"
              />
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-zinc-600">
                Cidade
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
                placeholder="Sorocaba"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-600">
                Estado
              </label>

              <select value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white">
                <option value="">Selecione</option>
                <option value="AC">AC</option>
                <option value="AL">AL</option>
                <option value="AP">AP</option>
                <option value="AM">AM</option>
                <option value="BA">BA</option>
                <option value="CE">CE</option>
                <option value="DF">DF</option>
                <option value="ES">ES</option>
                <option value="GO">GO</option>
                <option value="MA">MA</option>
                <option value="MT">MT</option>
                <option value="MS">MS</option>
                <option value="MG">MG</option>
                <option value="PA">PA</option>
                <option value="PB">PB</option>
                <option value="PR">PR</option>
                <option value="PE">PE</option>
                <option value="PI">PI</option>
                <option value="RJ">RJ</option>
                <option value="RN">RN</option>
                <option value="RS">RS</option>
                <option value="RO">RO</option>
                <option value="RR">RR</option>
                <option value="SC">SC</option>
                <option value="SP">SP</option>
                <option value="SE">SE</option>
                <option value="TO">TO</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-3">
            Informações Profissionais
          </h2>

          <div className="space-y-4">

            <div>
              <label className="block text-sm text-zinc-600">
                Federação / Liga Vinculada
              </label>

              <input
                value={federation}
                onChange={(e) => setFederation(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
                placeholder="Ex: Federação Paulista de Futebol"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm text-zinc-600">
                  Categoria de Atuação
                </label>

                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white">
                  <option value="">Selecione</option>
                  <option>Amador</option>
                  <option>Base</option>
                  <option>Profissional Estadual</option>
                  <option>Profissional Nacional</option>
                  <option>Internacional</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-zinc-600">
                  Função Principal
                </label>

                <select value={mainRole}
                  onChange={(e) => setMainRole(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white">
                  <option value="">Selecione</option>
                  <option>Árbitro Central</option>
                  <option>Assistente 1</option>
                  <option>Assistente 2</option>
                  <option>Quarto Árbitro</option>
                  <option>VAR</option>
                  <option>AVAR</option>
                </select>
              </div>

            </div>

            <div>
              <label className="block text-sm text-zinc-600">
                Data de Início na Arbitragem
              </label>

              <input
                type="date"
                value={arbitrationStartDate}
                onChange={(e) => setArbitrationStartDate(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
              />
            </div>

          </div>
        </div>

        {/* Dados Físicos */}
        <div>
          <h2 className="text-lg font-medium mb-3">
            Dados Físicos
          </h2>

          <div className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm text-zinc-600">
                  Altura (cm)
                </label>

                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="0"
                  className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
                  placeholder="175"
                />
              </div>

              <div>
                <label className="block text-sm text-zinc-600">
                  Peso (kg)
                </label>

                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="0"
                  step="0.1"
                  className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
                  placeholder="72.5"
                />
              </div>

            </div>

            <div>
              <label className="block text-sm text-zinc-600">
                Perna Dominante
              </label>

              <select value={dominantLeg}
                onChange={(e) => setDominantLeg(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white">
                <option value="">Selecione</option>
                <option value="DIREITA">Direita</option>
                <option value="ESQUERDA">Esquerda</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-600">
                Possui alguma limitação física ou lesão atual?
              </label>

              <select value={hasPhysicalLimitation}
                  onChange={(e) => setHasPhysicalLimitation(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white">
                <option value="">Selecione</option>
                <option value="NAO">Não</option>
                <option value="SIM">Sim</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-600">
                Se sim, descreva
              </label>

              <textarea
                value={physicalLimitationDescription}
                onChange={(e) => setPhysicalLimitationDescription(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white"
                placeholder="Descreva a limitação física ou lesão atual..."
              />
            </div>

          </div>
        </div>

        {/* Experiência Tecnológica */}
        <div>
          <h2 className="text-lg font-medium mb-3">
            Experiência Tecnológica
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm text-zinc-600">
                Já utilizou Realidade Virtual anteriormente?
              </label>

              <select value={hasUsedVrBefore}
                  onChange={(e) => setHasUsedVrBefore(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white">
                <option value="">Selecione</option>
                <option value="SIM">Sim</option>
                <option value="NAO">Não</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-600">
                Frequência de uso de tecnologias de treinamento esportivo
              </label>

              <select value={technologyUsageFrequency}
                onChange={(e) => setTechnologyUsageFrequency(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white">
                <option value="">Selecione</option>
                <option value="NUNCA">Nunca</option>
                <option value="RARAMENTE">Raramente</option>
                <option value="AS_VEZES">Às vezes</option>
                <option value="FREQUENTEMENTE">Frequentemente</option>
              </select>
            </div>

          </div>
        </div>

        {/* Objetivos e Perfil de Treinamento */}
        <div>
          <h2 className="text-lg font-medium mb-3">
            Objetivos e Perfil de Treinamento
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <label className="block text-sm text-zinc-600">
                Objetivo Principal no RefCheck
              </label>

              <select value={trainingGoal}
                onChange={(e) => setTrainingGoal(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white">
                <option value="">Selecione</option>
                <option value="POSITIONING">
                  Posicionamento em campo
                </option>
                <option value="DECISION_MAKING">
                  Tomada de decisão
                </option>
                <option value="GAME_READING">
                  Leitura de jogo
                </option>
                <option value="VAR_TRAINING">
                  Treinamento VAR
                </option>
                <option value="COMMUNICATION">
                  Comunicação
                </option>
                <option value="GENERAL_DEVELOPMENT">
                  Desenvolvimento geral
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-600">
                Nível de Experiência Percebido
              </label>

              <select value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white">
                <option value="">Selecione</option>
                <option value="BEGINNER">
                  Iniciante
                </option>
                <option value="INTERMEDIATE">
                  Intermediário
                </option>
                <option value="ADVANCED">
                  Avançado
                </option>
                <option value="ELITE">
                  Elite
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-600">
                Disponibilidade Semanal
              </label>

              <select value={weeklyAvailability}
                onChange={(e) => setWeeklyAvailability(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2 text-zinc-900 bg-white">
                <option value="">Selecione</option>
                <option value="1_2_HOURS">
                  1 a 2 horas
                </option>
                <option value="3_5_HOURS">
                  3 a 5 horas
                </option>
                <option value="6_8_HOURS">
                  6 a 8 horas
                </option>
                <option value="MORE_THAN_8_HOURS">
                  Mais de 8 horas
                </option>
              </select>
            </div>

          </div>
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button
          onClick={onSave}
          disabled={loading}
          className="rounded-md bg-black text-white px-4 py-2 disabled:opacity-60"
        >
          {loading ? "Salvando..." : "Salvar árbitro"}
        </button>
      </div>
    </div>
  );
}