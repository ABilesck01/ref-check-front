// import Link from "next/link";
// import { sessions } from "@/app/data/seed";

// export default function SessionsPage() {
//   return (
//     <div className="space-y-4">
//       <div className="flex items-end justify-between">
//         <h1 className="text-2xl font-semibold text-[color:var(--neutral)]">Sessões</h1>
//         {/* <button className="rounded-md px-3 py-2 text-sm text-white bg-[color:var(--primary)] hover:opacity-90">
//           Criar sessão
//         </button> */}
//         <Link
//           href="/app/sessions/new"
//           className="rounded-md px-3 py-2 text-sm text-white bg-[color:var(--primary)] hover:opacity-90"
//         >
//           Criar sessão
//         </Link>
//       </div>

//       <div className="grid gap-3">
//         {sessions.map((s) => (
//           <Link
//             key={s.id}
//             href={`/app/sessions/${s.id}`}
//             className="rounded-lg border bg-white p-4 hover:border-[color:var(--secondary)]"
//           >
//             <div className="flex items-center justify-between">
//               <div className="font-semibold text-[color:var(--neutral)]">{s.code}</div>
//               <div className="text-xs text-zinc-500">{s.createdAt}</div>
//             </div>
//             <div className="text-sm text-zinc-600 mt-1">
//               Árbitro: <span className="font-medium">{s.refereeName}</span> • Situações: {s.situationIds.length}
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }

import Link from "next/link";

type SessionListItem = {
  id: string;
  code: string;
  name: string | null;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
  isActive: boolean;
  refereeName: string | null;
  trainerName: string | null;
};

type SessionsListResponse = {
  page: number;
  pageSize: number;
  total: number;
  items: SessionListItem[];
};

function formatDatePtBR(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("pt-BR");
}

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getSessions() {
  if (!API) throw new Error("NEXT_PUBLIC_API_BASE_URL não configurada no .env.local");

  const res = await fetch(`${API}/api/sessions?isActive=true&page=1&pageSize=50`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`Falha ao carregar sessões: ${res.status} ${err}`);
  }

  return res.json();
}

export default async function SessionsPage()
{
  const data = await getSessions();

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-semibold text-[color:var(--neutral)]">Sessões</h1>

        <Link
          href="/app/sessions/new"
          className="rounded-md px-3 py-2 text-sm text-white bg-[color:var(--primary)] hover:opacity-90"
        >
          Criar sessão
        </Link>
      </div>

      <div className="grid gap-3">
        {data.items.map((s) => (
          <Link
            key={s.id}
            href={`/app/sessions/${s.code}`}
            className="rounded-lg border bg-white p-4 hover:border-[color:var(--secondary)]"
          >
            <div className="flex items-center justify-between">
              <div className="font-semibold text-[color:var(--neutral)]">
                {s.code} {s.name ? <span className="text-zinc-500 font-normal">• {s.name}</span> : null}
              </div>

              <div className="text-xs text-zinc-500">{formatDatePtBR(s.createdAt)}</div>
            </div>

            <div className="text-sm text-zinc-600 mt-1">
              Árbitro: <span className="font-medium">{s.refereeName ?? "—"}</span>
              {" • "}
              Treinador: <span className="font-medium">{s.trainerName ?? "—"}</span>
              {" • "}
              Status: <span className="font-medium">{s.isActive ? "Ativa" : "Inativa"}</span>
            </div>
          </Link>
        ))}

        {data.items.length === 0 ? (
          <div className="text-sm text-zinc-500">Nenhuma sessão encontrada.</div>
        ) : null}
      </div>
    </div>
  );
}