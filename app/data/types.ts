export type SituationType = "falta" | "impedimento" | "penalti" | "cartao" | "outro";

export type Situation = {
  id: string;
  title: string;
  type: SituationType;
  difficulty: 1 | 2 | 3 | 4 | 5;
  createdAt: string;
};

export type Session = {
  id: string;
  code: string;
  refereeName: string;
  createdAt: string;
  situationIds: string[];
};

export type Decision = {
  id: string;
  sessionId: string;
  situationId: string;
  value: "correto" | "incorreto" | "penalti" | "impedimento" | "cartao_amarelo" | "cartao_vermelho" | "apitar" | "seguir" | "outro";
  reactionMs: number;
};