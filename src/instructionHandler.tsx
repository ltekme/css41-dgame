"use server";

import { cookies } from 'next/headers'

import { createDefaultGameStateToken, decodeGameState, encodeGameState } from "./gameData";
import { questions, introMessages, lockedOutMessage, finishedMessages, commandPalette } from "./messages";
import { PrintLines } from "./types";

export interface Instruction {
    printLines: PrintLines;
    inputDsiabled: boolean;
    stopLoop: boolean;
    nextToken?: string;
}

const introResponse = {
    printLines: introMessages,
    stopLoop: false,
    inputDsiabled: true,
}

const lockedOutResponse = {
    printLines: lockedOutMessage,
    stopLoop: true,
    inputDsiabled: true,
}

export const getGameStateToken = async (): Promise<string | undefined> => {
    const cookieStore = await cookies();
    return cookieStore.get('gameStateToken')?.value;
}

export const setGameStateToken = async (token: string): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.set('gameStateToken', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict'
    });
}

export const clearGameStateToken = async (): Promise<void> => {
    const cookieStore = await cookies();
    cookieStore.delete('gameStateToken');
}

const commandHandaling = async (input: string): Promise<Instruction> => {
    const command = commandPalette[input]
    if (command) {
        command[1]();
        return {
            printLines: command[0],
            stopLoop: false,
            inputDsiabled: false,
        };
    }
    return {
        printLines: [["Command not found. Type 'help' for a list of commands.", "error", 50]],
        stopLoop: false,
        inputDsiabled: false,
    };
}

export const getInstruction = async ({ input }: {
    input?: string,
    intro?: boolean,
}): Promise<Instruction> => {
    // token validation
    const token = await getGameStateToken();
    if (token === undefined) {
        setGameStateToken(await createDefaultGameStateToken());
        return introResponse;
    }
    const gameState = await decodeGameState(token);
    if (gameState === null) return lockedOutResponse;

    // level validation
    const question = questions[gameState.level];
    if (gameState.level < 0) return lockedOutResponse;
    if (gameState.level > questions.length) return lockedOutResponse;

    if (gameState.finished || gameState.level === questions.length) {
        gameState.finished = true;
        setGameStateToken(await encodeGameState(gameState));
        if (input) {
            return commandHandaling(input);
        }
        return {
            printLines: finishedMessages,
            stopLoop: true,
            inputDsiabled: true,
        };
    }

    if (gameState.attempts < 0) return lockedOutResponse;
    if (gameState.attempts > question.attemptslockout) return lockedOutResponse;

    // intro for first question without pior attempts
    if (gameState.level === 0 && gameState.attempts === 0) {
        gameState.attempts = 1;
        setGameStateToken(await encodeGameState(gameState));
        return introResponse;
    }

    // input and state update
    if (input === undefined || input === null) return {
        printLines: question.questionMsg,
        stopLoop: true,
        inputDsiabled: false
    }
    if (question.answer === input) {
        gameState.level += 1;
        gameState.attempts = 1;
        setGameStateToken(await encodeGameState(gameState));
        return {
            printLines: question.correctMsg,
            stopLoop: false,
            inputDsiabled: true,
        }
    }
    if (gameState.attempts >= question.attemptsBeforeHint) {
        gameState.attempts += 1;
        setGameStateToken(await encodeGameState(gameState));
        if (gameState.attempts > question.attemptslockout) return {
            printLines: question.incorrectMsg,
            stopLoop: false,
            inputDsiabled: true,
        };
        return {
            printLines: question.incorrectMsg.concat(question.hint),
            stopLoop: false,
            inputDsiabled: false,
        }
    }
    gameState.attempts += 1;
    setGameStateToken(await encodeGameState(gameState));
    return {
        printLines: question.incorrectMsg,
        stopLoop: false,
        inputDsiabled: false,
    }
}