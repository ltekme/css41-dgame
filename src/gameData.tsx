"use server";

import { createHmac } from "crypto";

const secretKey = process.env.NODE_ENV !== "development" ? process.env.SECRET_KEY : "dev-secret-key";
if (process.env.NODE_ENV !== "development") {
    if (!secretKey) throw new Error("SECRET_KEY environment variable is not set.");
}

interface GameState {
    level: number;
    attempts: number;
    finished: boolean;
}

const encodeJWT = async (payload: object): Promise<string> => {
    const base64UrlEncode = (obj: object): string => {
        return Buffer.from(JSON.stringify(obj))
            .toString('base64')
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    }

    const encodedHeader = base64UrlEncode({
        alg: "HS256",
        typ: "JWT"
    });
    const encodedPayload = base64UrlEncode(payload);
    const data = `${encodedHeader}.${encodedPayload}`;
    const signature = createHmac("sha256", secretKey!)
        .update(data)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    return `${data}.${signature}`;
}

const decodeJWT = async (token: string): Promise<object | null> => {
    const [encodedHeader, encodedPayload, signature] = token.split('.');
    const data = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = createHmac("sha256", secretKey!)
        .update(data)
        .digest("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    if (signature !== expectedSignature) {
        return null;
    }
    try {
        const payload = JSON.parse(Buffer.from(encodedPayload, 'base64').toString('utf-8'));
        return payload;
    } catch {
        return null;
    }
}

export const decodeGameState = async (token: string): Promise<GameState | null> => {
    // return null when game state invalid
    const payload = await decodeJWT(token) as GameState;
    if (payload === null) return null;
    if (payload.level === undefined || payload.level === null) return null;
    if (payload.attempts === undefined || payload.attempts === null) return null;
    if (payload.finished === undefined || payload.finished === null) return null;
    return payload;
};

export const encodeGameState = async (gameState: GameState) => {
    return encodeJWT(gameState);
}

export const createDefaultGameStateToken = async (): Promise<string> => {
    return encodeJWT({
        level: 0,
        attempts: 0,
        finished: false
    })
}