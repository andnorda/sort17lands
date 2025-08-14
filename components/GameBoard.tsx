"use client";

import { useMemo, useState, useCallback } from "react";
import type { CardRating } from "../types/ratings";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CardRow from "./CardRow";
import { sortByEverDrawnWinRateDesc } from "../lib/sort";
import { useRouter } from "next/navigation";

type GameBoardProps = {
  cards: CardRating[];
};

export default function GameBoard({ cards }: GameBoardProps) {
  const router = useRouter();
  const [order, setOrder] = useState<CardRating[]>(() => [...cards]);
  const [revealed, setRevealed] = useState(false);

  const moveCard = useCallback((from: number, to: number) => {
    setOrder((curr) => {
      const next = [...curr];
      const [removed] = next.splice(from, 1);
      next.splice(to, 0, removed);
      return next;
    });
  }, []);

  const solution = useMemo(() => sortByEverDrawnWinRateDesc(cards), [cards]);

  const handleSubmit = () => setRevealed(true);
  const handleNextRound = () => {
    setRevealed(false);
    router.refresh();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ maxWidth: 720, width: "100%", display: "grid", gap: 12 }}>
        {!revealed && (
          <div style={{ display: "grid", gap: 8 }}>
            {order.map((card, index) => (
              <CardRow
                key={card.id_hash ?? `${card.name}-${index}`}
                card={card}
                index={index}
                moveCard={moveCard}
                isRevealed={false}
              />
            ))}
          </div>
        )}

        {revealed && (
          <div style={{ display: "grid", gap: 8 }}>
            {solution.map((card, index) => (
              <CardRow
                key={card.id_hash ?? `${card.name}-${index}`}
                card={card}
                index={index}
                moveCard={() => {}}
                isRevealed
              />
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {!revealed ? (
            <button onClick={handleSubmit} style={buttonStyle}>Submit</button>
          ) : (
            <button onClick={handleNextRound} style={buttonStyle}>Next round</button>
          )}
        </div>
      </div>
    </DndProvider>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 8,
  border: "1px solid var(--foreground)",
  background: "transparent",
  color: "var(--foreground)",
  cursor: "pointer",
};


