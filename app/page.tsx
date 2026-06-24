"use client";

import { useEffect, useRef, useState } from "react";
import { checkAnswer, Line, PrintLines, getQuestion, Question } from "./question";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const lineColorMapping = {
  white: "text-[#ffffff]",
  success: "text-[#56ff77]",
  error: "text-[#ff5a5a]",
  hint: "text-[#8300c9]",
  normal: "text-[#56ff77]",
}

const totalAttemptsAllowed = 7;

// [text, kind, delayAfter, disappearAfter, ]
const intro: PrintLines = [
  ["**************************************************", "success"],
  [" SECURE-CAM CLI v4.05 - HARDENED OVERRIDE ", "success"],
  ["**************************************************", "success"],
  ["WARNING: CCTV System Status: LOCKED", "error"],
  ["Main feed: ENCRYPTED BY ADMIN", "error"],
  ["Total attempts allowed: " + totalAttemptsAllowed, "error"],
  ["", "normal", 1000],
  ["Initiating cognitive verification protocols.", "error", 1, 1000],
  ["Initiating cognitive verification protocols..", "error", 1, 1000],
  ["Initiating cognitive verification protocols...", "error", 1, 1000],
  ["Initiating cognitive verification protocols.", "error", 1, 1000],
  ["Initiating cognitive verification protocols..", "error", 1, 1000],
  ["Initiating cognitive verification protocols...", "error", 1, 1000],
  ["", "normal", 1000],
]

const finishedMessage: PrintLines = [
  ["**************************************************", "success"],
  [" CONGRATULATIONS! YOU HAVE REPAIRED THE CCTV SYSTEM ", "success"],
  ["**************************************************", "success"],
  ["Cognitive verification passed.", "success"],
  ["All security feeds are now fully operational.", "success"],
  ["Main Hub Status: SECURE", "success"],
  ["Welcome back, Mastermind.", "success"],
]

const accessDeniedLockoutMessage: PrintLines = [
  ["**************************************************", "error"],
  [" ACCESS DENIED - SYSTEM LOCKOUT INITIATED ", "error"],
  ["**************************************************", "error"],
  ["Cognitive verification failed.", "error"],
  ["All security feeds remain encrypted.", "error"],
  ["Main Hub Status: LOCKED", "error"],
]

export default function Home() {
  const [lines, setLines] = useState<PrintLines>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [introFinished, setIntroFinished] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const getCurrentQuestionIndex = (): number => {
    const index = parseInt(window.localStorage.getItem("QuestionIndex") || "0", 10);
    return isNaN(index) ? 0 : index;
  }

  const setCurrentQuestionIndex = (index: number): void => {
    window.localStorage.setItem("QuestionIndex", index.toString());
  }

  const getCurrentAttempts = (): number => {
    const attempts = parseInt(window.localStorage.getItem("Attempts") || "0", 10);
    return isNaN(attempts) ? 0 : attempts;
  }

  const setCurrentAttempts = (attempts: number): void => {
    window.localStorage.setItem("Attempts", attempts.toString());
  }

  const setTotalAttempts = (attempts: number): void => {
    window.localStorage.setItem("TotalAttempts", attempts.toString());
  }

  const setGameFinsihed = (finished: boolean): void => {
    window.localStorage.setItem("GameFinished", finished ? "true" : "false");
  }

  const isGameFinished = (): boolean => {
    const finished = window.localStorage.getItem("GameFinished");
    return finished === "true";
  }

  const getTotalAttempts = (): number => {
    const attempts = parseInt(window.localStorage.getItem("TotalAttempts") || "0", 10);
    return isNaN(attempts) ? 0 : attempts;
  }

  const clearLines = (): void => {
    setLines([]);
  }

  const clearAndPrintLines = async (linesToPrint: PrintLines): Promise<void> => {
    setLines([]);
    await printLines(linesToPrint);
  }

  const enterLockoutState = async (): Promise<void> => {
    await sleep(1000);
    setCurrentQuestionIndex(0);
    setIntroFinished(false);
    setCurrentAttempts(0);
    setTotalAttempts(7);
    setGameFinsihed(false);
    await clearAndPrintLines(accessDeniedLockoutMessage);
  }

  const enterFinishedState = async (): Promise<void> => {
    setCurrentQuestionIndex(0);
    setIntroFinished(false);
    setCurrentAttempts(0);
    setTotalAttempts(0);
    setGameFinsihed(true);
    await clearAndPrintLines(finishedMessage);
  }

  const printLines = async (linesToPrint: PrintLines): Promise<void> => {
    for (const line of linesToPrint) {
      setLines((current) => [...current, line]);
      if (line[3] && line[3] > 0 && line[3] !== -1) {
        await new Promise((resolve) => setTimeout(() => {
          setLines((current) => current.filter((l) => l !== line));
          resolve(undefined);
        }, line[3]));
      }
      if (line[2] && line[2] > 0) {
        await sleep(line[2]);
      } else {
        await sleep(22);
      }
    }
  };

  const submitAnswer = async (answer: string): Promise<void> => {
    if (!introFinished) {
      return;
    }
    setProcessing(true);
    try {
      printLines([[`> ${answer}`, "normal"]]);
      if (getTotalAttempts() >= totalAttemptsAllowed) {
        enterLockoutState();
        return;
      }
      const currentQuestionIndex = getCurrentQuestionIndex();
      const result = await checkAnswer(currentQuestionIndex, answer);
      setCurrentAttempts(getCurrentAttempts() + 1);
      if (result.isCorrect) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        clearLines();
        await printLines(currentQuestion?.correctMsg || [["", "success", 0, 1]]);
        await printLines([["", "success", 0, -1]]); // Empty Line
        setCurrentAttempts(0);
        setCurrentQuestion(result.nextQuestion);
        if (result.nextQuestion !== null) {
          clearLines();
          await printLines(result.nextQuestion.questionMsg);
        } else {
          await enterFinishedState();
        }
      } else {
        setTotalAttempts(getTotalAttempts() + 1);
        await printLines(currentQuestion?.incorrectMsg || [["", "error", 0, 1]]);
        if (currentQuestion?.attemptsBeforeHint !== null && currentQuestion?.attemptsBeforeHint !== undefined) {
          if (getCurrentAttempts() >= currentQuestion?.attemptsBeforeHint) {
            if (currentQuestion?.hint && currentQuestion?.hint.length > 0) {
              await printLines(currentQuestion?.hint || [["", "hint", 0, 1]]);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error in submitAnswer:", error);
      await printLines([["[ERROR] System error. ", "error"]]);
    }
    setProcessing(false);
  };

  useEffect(() => {
    const init = async () => {
      try {
        if (getTotalAttempts() >= totalAttemptsAllowed) {
          enterLockoutState();
          return;
        }
        const question = await getQuestion(getCurrentQuestionIndex());
        if (question === null || isGameFinished()) {
          await enterFinishedState();
          return;
        }
        await printLines(intro);
        clearLines();
        await printLines(question.questionMsg);
        setCurrentQuestion(question);
        setIntroFinished(true);
      } catch (error) {
        await printLines([["[ERROR] System initialization failed.", "error"]]);
      }
    };
    init();
  }, ['']);

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
          onSubmit={(e) => {
            e.preventDefault();
            if (processing || !introFinished || !currentQuestion || inputValue.trim() === "") {
              return;
            }
            setInputValue("");
            const formData = new FormData(e.currentTarget);
            const answer = formData.get("answer") as string;
            submitAnswer(answer);
            e.currentTarget.reset();
          }}
        >
          <div className="mx-auto w-full max-w-5xl">
            <input
              type="text"
              name="answer"
              className="border w-full border-[#1c5a2d] bg-black/90 px-3 py-2 text-sm text-[#56ff77] placeholder:text-[#56ff77]/50 focus:outline-none focus:ring-1 focus:ring-[#56ff77]"
              placeholder="Enter command"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>
        </form>
      </div>
    </main>
  );
}