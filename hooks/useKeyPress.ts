import { useEffect } from "react";

const useKeyPress = (
  key: string | undefined,
  correct: Function,
  incorrect: Function
) => {
  useEffect(() => {
    if (!key) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace" || e.key === " " || e.key === "Enter") {
        correct(e.key);
      } else {
        {
          if (e.key === key) {
            correct(key);
          } else {
            incorrect(key);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, correct, incorrect]);
};

export default useKeyPress;
