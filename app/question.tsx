"use server";

export type LineKind = "normal" | "success" | "error" | "hint";

// [text, kind, delayAfter, disappearAfter, ]
export type Line = [string, LineKind?, number?, number?];
export type PrintLines = Line[];

export interface Question {
    questionMsg: PrintLines;
    correctMsg: PrintLines;
    incorrectMsg: PrintLines;
    attemptsBeforeHint: number;
    hint: PrintLines;
}

export interface FullQuestion extends Question {
    answer: string;
}

export interface CheckAnswerResult {
    isCorrect: boolean;
    nextQuestion: Question | null;
}

const questions: FullQuestion[] = [
    {
        questionMsg: [
            ["==================================================", "normal"],
            ["STEP 1: MATRIX SEQUENCING ", "normal"],
            ["==================================================", "normal", 500],
            ["The camera alignment matrix\ follows a specific mathematical pattern.", "normal"],
            ["Analyze the sector coordinates to find the next variable.", "normal"],
            ["Sequence: 2, 6, 12, 20, 30, [?]", "normal"],
            ["Enter the missing coordinate:", "normal"],
        ],
        answer: "42",
        correctMsg: [
            ["[SUCCESS] Matrix aligned. Sector parameters accepted.", "success", 3000],
        ],
        incorrectMsg: [
            ["[ERROR] Alignment failed. Invalid sequence parameter. Try again.", "error"],
        ],
        attemptsBeforeHint: 2,
        hint: [
            ["[HINT] The distance between each step is expanding at a constant, even rate.", "hint", 0, 2000],
        ],
    },
    {
        questionMsg: [
            ["==================================================", "normal"],
            ["STEP 2: BIOMETRIC CIPHER ", "normal"],
            ["==================================================", "normal", 500],
            ["The audio-visual sync requires a lateral logic bypass.", "normal"],
            ["Identify the next letter in the security sequence:", "normal"],
            ["Sequence: O, T, T, F, F, S, S, E, N, [?]", "normal"],
            ["Enter the missing letter:", "normal"],
        ],
        answer: "T",
        correctMsg: [
            ["[SUCCESS] Lateral cipher solved. Audio-visual sync complete.", "success", 3000],
        ],
        incorrectMsg: [
            ["[ERROR] Cipher mismatch. Access denied. Try again.", "error"],
        ],
        attemptsBeforeHint: 3,
        hint: [
            ["[HINT] Stop looking for an alphabet pattern. You've known this sequence since kindergarten.", "hint", 0, 2000],
        ],
    },
    {
        questionMsg: [
            ["==================================================", "normal"],
            ["STEP 3: SERVER LOAD BALANCING ", "normal"],
            ["==================================================", "normal", 500],
            ["The central hub requires an efficiency calculation to reboot.", "normal"],
            ["Read the scenario carefully:", "normal"],
            ["If 5 backup servers take 5 minutes to process 5 terabytes of video,", "normal"],
            ["how many minutes will it take 100 backup servers to process 100 terabytes?", "normal"],
        ],
        answer: "5",
        incorrectMsg: [
            ["[ERROR] Logic flaw detected in calculation. Try again.", "error"],
        ],
        correctMsg: [
            ["[SUCCESS] Load balanced. Processing efficiency at maximum.", "success", 3000],
        ],
        attemptsBeforeHint: 1,
        hint: [
            ["[HINT] Scaling the workforce and the workload at the exact same ratio leaves the clock untouched.", "hint", 0, 2000],
        ],
    }
];

const stripAnswers = (question: FullQuestion): Question => {
    return {
        questionMsg: question.questionMsg,
        incorrectMsg: question.incorrectMsg,
        correctMsg: question.correctMsg,
        attemptsBeforeHint: question.attemptsBeforeHint,
        hint: question.hint,
    };
}

export const checkAnswer = async (questionIndex: number, answer: string): Promise<CheckAnswerResult> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate server processing delay
    const currentQuestion = questions[questionIndex];
    if (!currentQuestion) {
        return { isCorrect: false, nextQuestion: null };
    }
    const isCorrect = currentQuestion.answer.toLowerCase() === answer.toLowerCase();
    if (!isCorrect) {
        return { isCorrect: false, nextQuestion: null }
    }
    if (questionIndex + 1 == questions.length) {
        // End of questions, return success with no next question.
        return { isCorrect: true, nextQuestion: null };
    }
    return { // continue to next question
        isCorrect: true,
        nextQuestion: stripAnswers(questions[questionIndex + 1]),
    };
}

export const getQuestion = async (questionIndex: number): Promise<Question | null> => {
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate server processing delay
    if (questionIndex === questions.length) {
        return null;
    }
    if (questionIndex >= questions.length || questionIndex < 0) {
        return stripAnswers(questions[0]);
    }
    return stripAnswers(questions[questionIndex]);
}
