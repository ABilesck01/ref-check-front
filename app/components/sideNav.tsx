import Link from "next/link";
import Image from "next/image";

const nav = [
  { href: "/app", label: "Dashboard" },
  { href: "/app/trainees", label: "Árbitros" },
  { href: "/app/sessions", label: "Sessões" },
  { href: "/app/reports", label: "Relatórios" },
];

export default function SideNav({isOpen,isMobile,onClose,}: {isOpen: boolean;isMobile: boolean;onClose: () => void;}) 
{



  return (
    <>
      {/* OVERLAY (mobile) */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:relative
          z-40
          w-64
          shrink-0
          bg-[color:var(--primary)]
          text-white
          min-h-screen
          transition-transform duration-300

          ${isMobile
            ? isOpen
              ? "translate-x-0"
              : "-translate-x-full"
            : "translate-x-0"}
        `}
      >
        {/* LOGO */}
        <div className="p-6 border-b border-white/10 flex items-center justify-center">
          <Image
            src="/logo_white.png"
            alt="RefCheck"
            width={180}
            height={40}
            priority
          />
        </div>

        {/* MENU */}
        <nav className="p-3 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm hover:bg-white/10"
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}