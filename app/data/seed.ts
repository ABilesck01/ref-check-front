import type { Decision, Session, Situation } from "./types";

export const situations: Situation[] = [
  { id: "s1", title: "Carrinho por trás", type: "falta", difficulty: 2, createdAt: "2026-01-10" },
  { id: "s2", title: "Impedimento milimétrico", type: "impedimento", difficulty: 4, createdAt: "2026-01-10" },
  { id: "s3", title: "Toque de mão na área", type: "penalti", difficulty: 3, createdAt: "2026-01-11" },
];

export const sessions: Session[] = [
  { id: "ss1", code: "VR-2026-0001", refereeName: "Árbitro 1", createdAt: "2026-01-12", situationIds: ["s1","s2","s3"] },
];

export const decisions: Decision[] = [
  { id: "d1", sessionId: "ss1", situationId: "s1", value: "correto", reactionMs: 900 },
  { id: "d2", sessionId: "ss1", situationId: "s2", value: "incorreto", reactionMs: 1400 },
  { id: "d3", sessionId: "ss1", situationId: "s3", value: "penalti", reactionMs: 1100 },
];

export function getSessionDetails(sessionId: string) {
  const session = sessions.find(s => s.id === sessionId);
  if (!session) return null;

  const sessionDecisions = decisions.filter(d => d.sessionId === sessionId);
  return { session, sessionDecisions };
}
