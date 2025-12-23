import { useEffect } from "react";

const useKeyPress = (key: string, action: Function) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === key) {
        action(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [key, action]);
};

export default useKeyPress;
