"use client";

import useKeyPress from "@/hooks/useKeyPress";
import { useState } from "react";

export default function Home() {
  const words = ["hello", "world", "typescript", "react", "javascript"];
  // [word index, letter index]
  const [index, setIndex] = useState<Array<number>>([0, 0]);
  const [currentKey, setCurrentKey] = useState<string>(
    words[index[0]][index[1]]
  );
  const onClick = (key: string) => {
    setIndex([index[0], index[1] + 1]);
    console.log(index);
    console.log(key);

    if (words[index[0]][index[1]] === undefined) {
      setIndex([index[0] + 1, 0]);
      console.log("next word");
    }

    setCurrentKey(words[index[0]][index[1]]);
  };

  const listener = useKeyPress(currentKey, onClick);

  return (
    <div className="flex flex-col space-y-3 items-center justify-center h-screen">
      <div className="flex flex-row gap-4">
        <div className="join">
          <input
            className="join-item btn"
            type="radio"
            name="time"
            aria-label="15"
          />
          <input
            className="join-item btn"
            type="radio"
            name="time"
            aria-label="30"
          />
          <input
            className="join-item btn"
            type="radio"
            name="time"
            aria-label="45"
          />
        </div>
      </div>
      <code className="p-8 rounded-xl bg-base-200 w-5/6 lg:w-2/3">
        {words.map((word, i) => {
          return <span key={i}>{word} </span>;
        })}
      </code>
    </div>
  );
}
