"use client";

import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import type { CardRating } from "../types/ratings";

type CardRowProps = {
  card: CardRating;
  index: number;
  moveCard: (from: number, to: number) => void;
  isRevealed: boolean;
};

const ITEM_TYPE = "CARD_ROW";

export default function CardRow({
  card,
  index,
  moveCard,
  isRevealed,
}: CardRowProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover(item: { index: number }) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: 12,
        border: "1px solid rgba(0,0,0,0.1)",
        borderRadius: 8,
        background: "var(--background)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: isRevealed ? "default" : "grab",
      }}
    >
      <div style={{ fontWeight: 600 }}>{card.name}</div>
      {isRevealed && (
        <div style={{ fontVariantNumeric: "tabular-nums" }}>
          {formatWinRate(card.ever_drawn_win_rate)}
        </div>
      )}
    </div>
  );
}

function formatWinRate(value: number): string {
  // 17Lands provides ever_drawn_win_rate typically as a fraction (0..1) or percentage (0..100).
  // Normalize to percentage display.
  const pct = value <= 1 ? value * 100 : value;
  return `${pct.toFixed(2)}%`;
}
