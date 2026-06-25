// [text, kind, delayAfter, disappearAfter, ]
// ["\x1b[2J"]  clear screen
export type LineKind = "normal" | "success" | "error" | "hint";
export type Line = [string, LineKind?, number?, number?];
export type PrintLines = Line[];

export interface Question {
    questionMsg: PrintLines;
    correctMsg: PrintLines;
    incorrectMsg: PrintLines;
    attemptsBeforeHint: number;
    hint: PrintLines;
    attemptslockout: number;
}

export interface FullQuestion extends Question {
    answer: string;
}

export const lineColorMapping = {
    white: "text-[#ffffff]",
    success: "text-[#56ff77]",
    error: "text-[#ff5a5a]",
    hint: "text-[#8300c9]",
    normal: "text-[#56ff77]",
}
