"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { CardRating } from "../types/ratings";

type GameBoardProps = {
  cards: CardRating[];
  nextHref?: string;
};

export default function GameBoard({ cards, nextHref }: GameBoardProps) {
  const [order, setOrder] = useState<string[]>(() => cards.map((c) => c.id));
  const [done, setDone] = useState(false);

  const orderedCards = useMemo(
    () => order.map((id) => cards.find((c) => c.id === id)!),
    [order, cards]
  );
  const solution = useMemo(
    () =>
      [...cards].sort((a, b) => a.ever_drawn_win_rate - b.ever_drawn_win_rate),
    [cards]
  );

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const reorder = (list: string[], startIndex: number, endIndex: number) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    const newCardList = reorder(
      order,
      result.source.index,
      result.destination.index
    );

    setOrder(newCardList);
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {cards.map((card, index) => (
                <Draggable
                  key={card.url}
                  draggableId={card.url}
                  index={index}
                  isDragDisabled={done}
                >
                  {(provided) => (
                    <Image
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      src={card.url}
                      width={140}
                      height={196}
                      alt={card.name}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {done && (
        <div>
          <div>
            {orderedCards.map((card) => (
              <div key={`you-${card.id}`}>
                <Image
                  src={card.url}
                  width={140}
                  height={196}
                  alt={card.name}
                />
              </div>
            ))}
          </div>
          <div>
            {solution.map((card) => (
              <div key={`sol-${card.id}`}>
                <Image
                  src={card.url}
                  width={140}
                  height={196}
                  alt={card.name}
                />
                <div>{formatWinRate(card.ever_drawn_win_rate)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        {done ? (
          <a href={nextHref}>Next round</a>
        ) : (
          <button onClick={() => setDone(true)}>Submit</button>
        )}
      </div>
    </div>
  );
}

function formatWinRate(value: number): string {
  const pct = value <= 1 ? value * 100 : value;
  return `${pct.toFixed(2)}%`;
}
