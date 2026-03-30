"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/app/lib/supabase/browser";

export default function CallbackPage() {
  const supabase = createBrowserSupabase();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        setError("Link inválido ou expirado.");
      }

      setLoading(false);
    };

    init();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      return setError("A senha deve ter pelo menos 6 caracteres.");
    }

    if (password !== confirmPassword) {
      return setError("As senhas não coincidem.");
    }

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      router.push("/app");
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Lado esquerdo */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-10">
        <div className="max-w-md">
          <div className="text-3xl font-semibold text-zinc-900">
            Quase lá 🚀
          </div>
          <p className="mt-3 text-zinc-600">
            Defina sua senha para ativar sua conta e acessar o sistema.
          </p>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <div className="text-xl font-semibold text-zinc-900">
              RefCheck
            </div>
            <div className="text-sm text-zinc-600">
              Ativação de conta
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h1 className="text-lg font-semibold text-zinc-900">
              Definir senha
            </h1>
            <p className="mt-1 text-sm text-zinc-600">
              Crie uma senha para acessar sua conta.
            </p>

            {loading ? (
              <div className="mt-6 text-sm text-zinc-500">
                Validando convite...
              </div>
            ) : success ? (
              <div className="mt-6 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                Conta ativada com sucesso! Redirecionando...
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-zinc-900">
                    Nova senha
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 bg-white outline-none focus:ring-2 focus:ring-zinc-200"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-zinc-900">
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full rounded-lg border px-3 py-2 text-sm text-zinc-900 bg-white outline-none focus:ring-2 focus:ring-zinc-200"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[color:var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-95 active:opacity-90"
                >
                  Ativar conta
                </button>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </div>
                )}
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-zinc-500">
            © {new Date().getFullYear()} RefCheck. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}