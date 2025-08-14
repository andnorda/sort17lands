"use client";

import { useMemo, useState, useCallback } from "react";
import type { CardRating } from "../types/ratings";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CardRow from "./CardRow";
import { sortByEverDrawnWinRateAsc } from "../lib/sort";
import { useRouter } from "next/navigation";

type GameBoardProps = {
  cards: CardRating[];
  nextHref?: string;
};

export default function GameBoard({ cards, nextHref }: GameBoardProps) {
  const router = useRouter();
  const [order, setOrder] = useState<CardRating[]>(() => [...cards]);
  const [revealed, setRevealed] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<CardRating[] | null>(
    null
  );

  const moveCard = useCallback((from: number, to: number) => {
    setOrder((curr) => {
      const next = [...curr];
      const [removed] = next.splice(from, 1);
      next.splice(to, 0, removed);
      return next;
    });
  }, []);

  const solution = useMemo(() => sortByEverDrawnWinRateAsc(cards), [cards]);

  const handleSubmit = () => {
    setSubmittedOrder(order);
    setRevealed(true);
  };
  const handleNextRound = () => {
    setRevealed(false);
    router.refresh();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ maxWidth: 720, width: "100%", display: "grid", gap: 12 }}>
        {!revealed && (
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            {order.map((card, index) => (
              <CardRow
                key={card.id}
                card={card}
                index={index}
                moveCard={moveCard}
                isRevealed={false}
              />
            ))}
          </div>
        )}

        {revealed && (
          <div style={{ display: "grid", gap: 16 }}>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              {(submittedOrder ?? order).map((card, index) => (
                <CardRow
                  key={`you-${card.id}`}
                  card={card}
                  index={index}
                  moveCard={() => {}}
                  isRevealed
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              {solution.map((card, index) => (
                <CardRow
                  key={`sol-${card.id}`}
                  card={card}
                  index={index}
                  moveCard={() => {}}
                  isRevealed
                  showWinRate
                />
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {!revealed ? (
            <button onClick={handleSubmit} style={buttonStyle}>
              Submit
            </button>
          ) : nextHref ? (
            <a href={nextHref} style={linkButtonStyle}>
              Next round
            </a>
          ) : (
            <button onClick={handleNextRound} style={buttonStyle}>
              Next round
            </button>
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

const linkButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  display: "inline-block",
  textDecoration: "none",
};
