import { useEffect } from "react";

const useKeyPress = (
  key: string | undefined,
  correct: Function,
  incorrect: Function
) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle navigation keys first
      if (e.key === "Backspace" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        correct(e.key);
        return;
      }

      // If a target key is provided, compare against it
      if (key !== undefined) {
        if (e.key === key) {
          e.preventDefault();
          correct(key);
        } else {
          incorrect(key);
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
