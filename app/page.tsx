"use client";

import useKeyPress from "@/hooks/useKeyPress";
import { useCallback, useEffect, useRef, useState } from "react";

export default function Home() {
  const [words, setWords] = useState<Array<string>>([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<string>("");
  // [word index, letter index]
  const [index, setIndex] = useState<Array<number>>([0, 0]);
  const [seconds, setSeconds] = useState(15);
  const caretRef = useRef<HTMLSpanElement>(null);

  // Get code from Git
  const repoOptions = [
    { id: "git/git", label: "git/git (builtin)" },
    { id: "torvalds/linux", label: "torvalds/linux" },
    { id: "facebook/react", label: "facebook/react" },
    { id: "microsoft/vscode", label: "microsoft/vscode" },
    { id: "apple/swift", label: "apple/swift" },
    { id: "tensorflow/tensorflow", label: "tensorflow/tensorflow" },
    { id: "twbs/bootstrap", label: "twbs/bootstrap" },
    { id: "ohmyzsh/ohmyzsh", label: "ohmyzsh/ohmyzsh" },
    { id: "kubernetes/kubernetes", label: "kubernetes/kubernetes" },
    { id: "pytorch/pytorch", label: "pytorch/pytorch" },
    { id: "vuejs/vue", label: "vuejs/vue" },
    { id: "vercel/next.js", label: "vercel/next.js" },
    { id: "angular/angular", label: "angular/angular" },
    { id: "sveltejs/svelte", label: "sveltejs/svelte" },
    { id: "django/django", label: "django/django" },
    { id: "laravel/laravel", label: "laravel/laravel" },
    { id: "gin-gonic/gin", label: "gin-gonic/gin" },
    { id: "axios/axios", label: "axios/axios" },
    { id: "docker/docker-ce", label: "docker/docker-ce" },
    { id: "ansible/ansible", label: "ansible/ansible" },
    { id: "hashicorp/terraform", label: "hashicorp/terraform" },
  ];
  const [selectedRepo, setSelectedRepo] = useState<string>(repoOptions[0].id);

  const fetchSnippet = useCallback(async (repo: string) => {
    setLoading(true);
    try {
      const parts = repo.split("/");
      const apiUrl = `https://api.github.com/repos/${parts[0]}/${parts[1]}/contents`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch contents");
      const contents = await response.json();
      const files = contents.filter((item: any) => item.type === "file");
      if (files.length === 0) throw new Error("No files found");
      const randomFile = files[Math.floor(Math.random() * files.length)];
      setFile(randomFile.name);
      const codeResponse = await fetch(randomFile.download_url);
      if (!codeResponse.ok) throw new Error("Failed to fetch code");
      const code = await codeResponse.text();
      const lines = code.split("\n");

      // Skip leading comments/imports so snippet isn't just header/license text
      const skipPattern =
        /^\s*(?!(?:\/\/|\/\*|\*|<!--|#|\/\/)\s*$)(?:\/\/|\/\*|\*|<!--|#!|import\b|package\b|using\b|#\s*include\b|#\s*pragma\b|#\s*ifn?def\b|#\s*if\b|@)/i;
      let startLine = 0;
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i].trim();
        if (l === "") continue;
        if (!skipPattern.test(l)) {
          startLine = i;
          break;
        }
      }

      const processedWords: string[] = [];
      for (let i = startLine; i < lines.length; i++) {
        const line = lines[i];
        const lineWords = line.split(/\s+/).filter((word) => word.length > 0);
        processedWords.push(...lineWords);
        if (i < lines.length - 1) processedWords.push("\n");
      }

      // Grab a larger chunk (skip headers) so the typing isn't trivial
      const truncatedWords = processedWords.slice(0, 200);
      setWords(truncatedWords);
    } catch (error) {
      console.error(error);
      setWords(["Error", "loading", "snippet"]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // load default repo on mount
    fetchSnippet(selectedRepo);
  }, [fetchSnippet, selectedRepo]);

  useEffect(() => {
    caretRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [index]);

  const correct = (key: string) => {
    // start timer on first keypress
    if (!timerStartedRef.current) startCountdown(seconds);
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
    if (!timerStartedRef.current) startCountdown(seconds);
    return;
  };

  const startTimer = (seconds: number) => {
    // replaced by interval-based countdown started once
    return;
  };
  const timerRef = useRef<number | null>(null);
  const timerStartedRef = useRef(false);

  const startCountdown = (secs: number) => {
    if (timerStartedRef.current) return;
    timerStartedRef.current = true;
    setSeconds(secs);
    timerRef.current = window.setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          return 0;
        }
        return s - 1;
      });
    }, 1000) as unknown as number;
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);
  const listener = useKeyPress(words[index[0]]?.[index[1]], correct, incorrect);

  return (
    <div className="m-3">
      <div>
        <h1 className="text-4xl font-extrabold">typescripted</h1>
        <p>Type real code</p>
      </div>
      <div className="flex flex-col space-y-3 items-center justify-center h-screen">
        <div className="flex flex-row gap-4">
          <label className="label">
            <span className="label-text">Choose repo:</span>
          </label>
          <select
            className="select select-bordered"
            value={selectedRepo}
            onChange={(e) => setSelectedRepo(e.target.value)}
          >
            {repoOptions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
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
        <p className="font-bold">{seconds}</p>
        {loading ? (
          <div className="p-8 rounded-xl bg-base-200 w-5/6 lg:w-2/3 text-center">
            Loading random code snippet from Git...
          </div>
        ) : (
          <div className="mockup-code w-5/6 lg:w-2/3 overflow-y-scroll">
            <code>
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
                            isTyped ? "text-base-100" : "text-base-100/30"
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
          </div>
        )}
      </div>
    </div>
  );
}
