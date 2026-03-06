"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function apiBase() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_BASE_URL não configurada no front");
  return base;
}

type LoginResponse =
  | {
      ok: true;
      user: unknown;
      session: {
        access_token: string;
        refresh_token?: string;
        expires_in?: number;
        expires_at?: number;
        token_type?: string;
      };
    }
  | { ok: false; error?: string };

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function getTrainerIdFromAccessToken(token: string): string | null {
    try {
      const payloadBase64 = token.split(".")[1];
      const payloadJson = atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/"));
      const payload = JSON.parse(payloadJson);
      return typeof payload.sub === "string" ? payload.sub : null;
    } catch {
      return null;
    }
  }

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${apiBase()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const json = (await res.json()) as LoginResponse;

      if (!res.ok || !("ok" in json) || json.ok === false) {
        setError((json as any)?.error ?? "E-mail ou senha inválidos.");
        return;
      }

      localStorage.setItem("access_token", json.session.access_token);
      localStorage.setItem("refresh_token", json.session.refresh_token ?? "");
      localStorage.setItem("expires_at", String(json.session.expires_at ?? ""));

      const trainerId = getTrainerIdFromAccessToken(json.session.access_token);
      if (trainerId) localStorage.setItem("trainer_id", trainerId);

      router.push("/app");
    } catch {
      setError("Falha de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Lado esquerdo */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-10">
        <div className="max-w-md">
          <div className="text-3xl font-semibold text-zinc-900">
            Bem-vindo de volta
          </div>
          <p className="mt-3 text-zinc-600">
            Acesse o painel administrativo para gerenciar sessões, situações e
            relatórios.
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <div className="text-xl font-semibold text-zinc-900">RefCheck</div>
            <div className="text-sm text-zinc-600">Painel administrativo</div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-lg font-semibold text-zinc-900">Entrar</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Use seu e-mail e senha para acessar.
            </p>

            <form onSubmit={onLogin} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-medium text-zinc-900">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="seuemail@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 bg-white outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-zinc-900">
                    Senha
                  </label>

                  <button
                    type="button"
                    className="text-sm text-zinc-600 hover:text-zinc-900"
                    onClick={() => {
                      // MVP: só um placeholder
                      // Depois você pode criar /forgot-password com Supabase
                      setError("Recuperação de senha ainda não implementada.");
                    }}
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 bg-white outline-none focus:ring-2 focus:ring-zinc-200"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-zinc-700">
                  <input type="checkbox" className="rounded border" />
                  Manter conectado
                </label>

                <span className="text-xs text-zinc-500">v0.1</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[color:var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-95 active:opacity-90 disabled:opacity-60"
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-zinc-500">
            © {new Date().getFullYear()} RefCheck. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}