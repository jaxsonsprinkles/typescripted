"use client";

import useKeyPress from "@/hooks/useKeyPress";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [words, setWords] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(true);
  // [word index, letter index]
  const [index, setIndex] = useState<Array<number>>([0, 0]);
  const caretRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/git/git/contents/builtin"
        );
        if (!response.ok) throw new Error("Failed to fetch contents");
        const contents = await response.json();
        const files = contents.filter((item: any) => item.type === "file");
        if (files.length === 0) throw new Error("No files found");
        const randomFile = files[Math.floor(Math.random() * files.length)];
        const codeResponse = await fetch(randomFile.download_url);
        if (!codeResponse.ok) throw new Error("Failed to fetch code");
        const code = await codeResponse.text();
        const lines = code.split("\n");
        const processedWords: string[] = [];
        lines.forEach((line, index) => {
          const lineWords = line.split(/\s+/).filter((word) => word.length > 0);
          processedWords.push(...lineWords);
          if (index < lines.length - 1) {
            processedWords.push("\n");
          }
        });
        const truncatedWords = processedWords.slice(0, 100);
        setWords(truncatedWords);
      } catch (error) {
        console.error(error);
        setWords(["Error", "loading", "snippet"]);
      } finally {
        setLoading(false);
      }
    };
    fetchSnippet();
  }, []);

  useEffect(() => {
    caretRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [index]);

  const correct = (key: string) => {
    let [word, letter] = index;
    let nextLetter = letter + 1;
    let nextWord = word;

    if (key === "Backspace") {
      // if word is 0 and letter is 0
      if (word === 0 && letter === 0) {
        return;
      }
      // if letter is 0
      if (letter === 0) {
        nextWord -= 1;
        nextLetter = words[nextWord].length - 1;

        // traditional backspace
      } else {
        console.log("backspaced");
        nextLetter -= 2;
      }
    } else if (key === " ") {
      if (letter === words[word].length) {
        nextWord += 1;
        nextLetter = 0;
      } else return;
      // If word is not complete, do nothing
    } else if (key === "Enter") {
      // If the next word token is a newline, skip it with a single Enter press.
      if (words[nextWord + 1] === "\n") {
        nextWord += 2;
      } else {
        nextWord += 1;
      }
      nextLetter = 0;
    }
    console.log("next index: " + nextWord + " " + nextLetter);
    setIndex([nextWord, nextLetter]);
  };

  const incorrect = (key: string) => {
    return;
  };

  const listener = useKeyPress(words[index[0]]?.[index[1]], correct, incorrect);

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
      {loading ? (
        <div className="p-8 rounded-xl bg-base-200 w-5/6 lg:w-2/3 text-center">
          Loading random code snippet from Git...
        </div>
      ) : (
        <code className="p-8 rounded-xl bg-base-200 w-5/6 lg:w-2/3 overflow-y-scroll">
          {words.map((word, i) => {
            if (word === "\n") {
              return <br key={i} />;
            }
            return (
              <span key={i} className="">
                {word.split("").map((letter, j) => {
                  const isActive = i === index[0] && j === index[1];
                  const isTyped =
                    i < index[0] || (i === index[0] && j < index[1]);

                  return (
                    <span
                      key={`${i}-${j}`}
                      className={`relative ${
                        isTyped ? "text-content" : "text-base-content/30"
                      }`}
                    >
                      {isActive && (
                        <span
                          ref={caretRef}
                          className="absolute top-0 bottom-0 left-[-1px] w-[2px] bg-primary transition-transform duration-150 ease-out animate-pulse"
                        />
                      )}
                      {letter}
                    </span>
                  );
                })}
                <span className="relative">
                  {i === index[0] && index[1] >= word.length && (
                    <span
                      ref={caretRef}
                      className="absolute top-0 bottom-0 left-[-1px] w-[2px] bg-primary transition-all duration-150 ease-out animate-pulse"
                    />
                  )}

                  {i < words.length - 1 && " "}
                </span>
              </span>
            );
          })}
        </code>
      )}
    </div>
  );
}
