import { useState } from "react";
import { Card } from "./ui/card";

const mockCards = [
  { id: 1, title: "Card 1", content: "Content 1" },
  { id: 2, title: "Card 2", content: "Content 2" },
  { id: 3, title: "Card 3", content: "Content 3" },
  { id: 4, title: "Card 4", content: "Content 4" },
];

export const CardSlider = () => {
  const [cards, setCards] = useState(mockCards);
  return (
    <div className="relative w-full">
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4">
          {cards.map((card) => (
            <Card key={card.id} className="flex-shrink-0 w-[300px] p-4">
              <h3 className="font-bold">{card.title}</h3>
              <p>{card.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
