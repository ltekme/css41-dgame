"use client";

import { useEffect, useRef, useState } from "react";
import { getInstruction, Instruction } from "../src/instructionHandler";
import { PrintLines, lineColorMapping } from "@/src/types";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Home() {
  const [lines, setLines] = useState<PrintLines>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [processing, setProcessing] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const printLines = async (linesToPrint: PrintLines): Promise<void> => {
    for (const line of linesToPrint) {
      if (line[0] === "\x1b[2J") {
        setLines([]);
        continue;
      }
      setLines((current) => [...current, line]);
      if (line[3] && line[3] > 0 && line[3] !== -1) {
        await new Promise((resolve) => setTimeout(() => {
          setLines((current) => current.filter((l) => l !== line));
          resolve(undefined);
        }, line[3]));
      }
      if (line[2] !== undefined) {
        await sleep(line[2]);
      }
    }
  };

  const handleInstruction = async (instruction: Instruction) => {
    await printLines(instruction.printLines)
    if (instruction.inputDsiabled === true && instruction.stopLoop === false) {
      while (true) {
        const instruction = await getInstruction({})
        await printLines(instruction.printLines)
        if (instruction.stopLoop) {
          if (instruction.inputDsiabled === false) setProcessing(false);
          break;
        }
        if (instruction.inputDsiabled === false) break;
      }
    }
    setProcessing(false);
  }

  useEffect(() => {
    const init = async () => {
      try {
        setProcessing(true);
        const instruction = await getInstruction({})
        handleInstruction(instruction);
      } catch (error) {
        await printLines([["[ERROR] System initialization failed.", "error"]]);
      }
    };
    init();
  }, ['']);

  const handleAnswerSubmit = async (input: string) => {
    if (processing) return;
    setProcessing(true);
    try {
      printLines([[`> ${input}`, "normal"]]);
      const instruction = await getInstruction({ input })
      handleInstruction(instruction);
    } catch (error) {
      console.error("Error in submitAnswer:", error);
      await printLines([["[ERROR] System error. ", "error"]]);
    }
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "auto" });
  }, [lines]);


  return (
    <main className="min-h-screen bg-black text-[#56ff77]">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <div className="border-b border-[#1c5a2d] px-4 py-3 text-xs uppercase tracking-[0.3em] text-[#83ffa0] sm:px-6">
          secure-cam cli v4.05
        </div>

        <div
          className="max-h-[calc(100vh-10rem)] overflow-y-auto px-4 py-5 font-mono text-sm leading-6 sm:px-6"
          style={{ overflowAnchor: "none" }}
        >
          {lines.map((line, index) => (
            <div key={`${index}-${line[0]}`} className={lineColorMapping[line[1] || "normal"]}>
              {line[0] || "\u00a0"}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form
          className="fixed inset-x-0 bottom-4 px-4 sm:px-6 lg:px-8"
          onSubmit={async (e) => {
            e.preventDefault();
            if (processing) {
              return;
            }
            const input = inputValue;
            setInputValue("");
            await handleAnswerSubmit(input);
          }}
        >
          <div className="mx-auto w-full max-w-5xl">
            <input
              type="text"
              name="answer"
              className="border w-full border-[#1c5a2d] bg-black/90 px-3 py-2 text-sm text-[#56ff77] placeholder:text-[#56ff77]/50 focus:outline-none focus:ring-1 focus:ring-[#56ff77]"
              placeholder="Enter command"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
          </div>
        </form>
      </div>
    </main>
  );
}