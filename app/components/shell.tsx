"use client";

import { useEffect, useState } from "react";
import SideNav from "./sideNav";
import TopBar from "./topBar";

export default function Shell({ children }: { children: React.ReactNode }) {

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // desktop = sempre aberto
  useEffect(() => {
    if (!isMobile) setIsOpen(true);
    else setIsOpen(false);
  }, [isMobile]);

  return (
    <div className="flex">
      <SideNav
        isOpen={isOpen}
        isMobile={isMobile}
        onClose={() => setIsOpen(false)}
      />

      <div className="flex-1 min-h-screen bg-zinc-50">
        <TopBar onMenuClick={() => setIsOpen(prev => !prev)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}