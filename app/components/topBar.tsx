export default function TopBar({onMenuClick,} : {onMenuClick: () => void}) {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b bg-white">
       {/* ESQUERDA */}
        <div className="flex items-center gap-3">

          {/* BOTÃO HAMBURGER */}
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded hover:bg-zinc-100"
          >
            ☰
          </button>

          <div className="text-sm text-[color:var(--neutral)]">
            Painel administrativo
          </div>

        </div>

        {/* DIREITA */}
        <div className="text-sm text-[color:var(--neutral)]">
          Treinador (local)
        </div>
    </header>
  );
}