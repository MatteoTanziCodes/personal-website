import { useEffect, useRef, useState } from "react";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*+<>";

function getRandomChar() {
  return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCommonPrefix(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

export function MatrixTransitionText({
    text,
    onDone,
  }: {
    text: string;
    onDone?: () => void;
  }) {
    const [display, setDisplay] = useState("");
    const prevTextRef = useRef("");
    const animationIdRef = useRef(0);
  
    useEffect(() => {
      const animationId = ++animationIdRef.current;
      const prev = prevTextRef.current;
      const next = text;
      let common = getCommonPrefix(prev, next);
      let current = prev;
  
      const animate = async () => {
        // Delete
        const stopAt = Math.max(common, 1);
        for (let i = current.length; i > stopAt; i--) {
          for (let f = 0; f < 2; f++) {
            if (animationId !== animationIdRef.current) return;
            setDisplay(current.slice(0, i - 1) + getRandomChar());
            await sleep(40);
          }
          current = current.slice(0, i - 1);
          setDisplay(current);
          await sleep(40);
        }
        
        // ✅ FIX: handle flicker of leftover char if commonPrefix < 1
        if (common < 1) {
            for (let f = 0; f < 3; f++) {
              if (animationId !== animationIdRef.current) return;
              setDisplay(getRandomChar());
              await sleep(40);
            }
          
            // Replace last char with next[0]
            current = next[0];
            setDisplay(current);
            await sleep(60);
            
            // Advance the addition loop by 1 character
            common = 1;
          }
          
  
        // Add
        let result = current;
        for (let i = common; i < next.length; i++) {
          for (let f = 0; f < 3; f++) {
            if (animationId !== animationIdRef.current) return;
            setDisplay(result + getRandomChar());
            await sleep(40);
          }
          result += next[i];
          setDisplay(result);
          await sleep(60);
        }
  
        if (animationId === animationIdRef.current) {
          prevTextRef.current = next;
          onDone?.(); // ✅ notify SideNav
        }
      };
  
      animate();
  
      return () => {};
    }, [text]);
  
    return <span style={{ color: "var(--fg)", whiteSpace: "pre" }}>{display}</span>;
  }

