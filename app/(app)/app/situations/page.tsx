import { situations } from "@/app/data/seed";
import Link from "next/link";

export default function SituationsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-semibold text-[color:var(--neutral)]">Situações</h1>
        {/* <button className="rounded-md px-3 py-2 text-sm text-white bg-[color:var(--primary)] hover:opacity-90">
          Nova situação
        </button> */}
        <Link
          href="/app/situations/new"
          className="rounded-md px-3 py-2 text-sm text-white bg-[color:var(--primary)] hover:opacity-90"
        >
          Nova situação
        </Link>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="text-left p-3">Título</th>
              <th className="text-left p-3">Tipo</th>
              <th className="text-left p-3">Dificuldade</th>
              <th className="text-left p-3">Criado</th>
            </tr>
          </thead>
          <tbody>
            {situations.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3 font-medium text-[color:var(--neutral)]">{s.title}</td>
                <td className="p-3">{s.type}</td>
                <td className="p-3">{s.difficulty}</td>
                <td className="p-3 text-zinc-500">{s.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
