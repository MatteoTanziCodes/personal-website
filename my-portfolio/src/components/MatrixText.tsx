import { useEffect, useRef, useState } from "react";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+<>";

function getRandomChar() {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function MatrixText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const animationIdRef = useRef(0); // Unique ID for each animation run

  useEffect(() => {
    let isCancelled = false;
    const animationId = ++animationIdRef.current; // Increment animation ID

    const animate = async () => {
      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (isCancelled || animationId !== animationIdRef.current) return;

        const flickerCycles = 4;
        for (let j = 0; j < flickerCycles; j++) {
          if (isCancelled || animationId !== animationIdRef.current) return;
          setDisplayed(
            result + getRandomChar() + " ".repeat(text.length - i - 1)
          );
          await sleep(40);
        }

        // Delete effect (optional)
        setDisplayed(result + " ".repeat(text.length - i));
        await sleep(20);

        result += text[i];
        setDisplayed(result + " ".repeat(text.length - i - 1));
        await sleep(40);
      }
    };

    // Start fresh animation
    setDisplayed(" ".repeat(text.length));
    animate();

    return () => {
      isCancelled = true;
    };
  }, [text]);

  return <span style={{ color: "var(--fg)" }}>{displayed}</span>;
}
