"use client";

import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import Image from "next/image";
import { useState } from "react";
import type { CardRating } from "../types/ratings";

type GameBoardProps = {
  cards: CardRating[];
  nextHref?: string;
};

export default function GameBoard({ cards, nextHref }: GameBoardProps) {
  const [order, setOrder] = useState<string[]>(() => cards.map((c) => c.id));
  const [done, setDone] = useState(false);

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
    <>
      <h1>Order the cards by 17 lands win rate</h1>
      <p>
        Drag to reorder from lowest to highest, according to Games in Hand Win
        Rate.
      </p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {order
                .map((id) => cards.find((c) => c.id === id)!)
                .map((card, index) => (
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
                        style={{
                          ...provided.draggableProps.style,
                          width: "20%",
                          maxWidth: "calc((min(1000px, 100vw - 10px))/5)",
                          height: "auto",
                        }}
                      />
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        }}
      >
        {done &&
          cards
            .toSorted((a, b) => a.ever_drawn_win_rate - b.ever_drawn_win_rate)
            .map((card) => (
              <div
                key={card.id}
                style={{
                  position: "relative",
                }}
              >
                <Image
                  src={card.url}
                  width={140}
                  height={196}
                  alt={card.name}
                  style={{
                    width: "100%",
                    height: "auto",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: "1em 0",
                    textAlign: "center",
                    verticalAlign: "center",
                    color: "white",
                    fontSize: "min(4.5vw, 45px)",
                    textShadow: "0 0 4px black",
                  }}
                >
                  {formatWinRate(card.ever_drawn_win_rate)}
                </div>
              </div>
            ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: 10,
        }}
      >
        {done ? (
          <a className="next" href={nextHref}>
            Next round
          </a>
        ) : (
          <button onClick={() => setDone(true)}>Submit</button>
        )}
      </div>
    </>
  );
}

function formatWinRate(value: number): string {
  const pct = value <= 1 ? value * 100 : value;
  return `${pct.toFixed(2)}%`;
}
