import { clearGameStateToken } from "./instructionHandler";
import { FullQuestion, PrintLines } from "./types";

const repeatSequence = async <T,>(items: T[], times: number) =>
    Array.from({ length: times }, () => items).flat();

const getRandomArbitrary = async (min: number, max: number): Promise<number> => {
    return Math.random() * (max - min) + min;
}

export const commandPalette: { [key: string]: [PrintLines, () => void] } = {
    "help": [[
        ["Available commands:", "normal", 50],
        ["- help: Display this help message", "normal", 50],
        ["- clear: Clear the screen", "normal", 50],
        ["- break: Intentionally break the system", "normal"],
        ["- whoami: Display the current user", "normal", 50],
        ["- whoareyou: Display the system information", "normal", 50],
        ["- cat /etc/version: Display the system version", "normal", 50],
    ], () => { }],
    "clear": [[["\x1b[2J"]], () => { }],
    "break": [[["[ERROR] System integrity compromised.", "error", 1000]], async () => {
        await clearGameStateToken();
    }],
    "whoami": [[["Masermind - Administrator", "normal"]], () => { }],
    "cat /etc/version": [[
        ["Secure-CAM v4.05 - HARDENED OVERRIDE", "normal", 50],
        ["Build: 2024-06-26", "normal", 50],
        ["Release: Stable", "normal", 50],
        ["Made with ❤️ by CSS41", "normal", 50],
    ], () => { }],
    "whoareyou": [[
        ["Secure-CAM v4.05 - HARDENED OVERRIDE", "normal", 50],
        ["Build: 2024-06-01", "normal", 50],
        ["Release: Stable", "normal", 50],
        ["Made with ❤️ by CSS41", "normal", 50],
    ], () => { }],
}

// [text, kind, delayAfter = 30, disappearAfter, ]
// ["\x1b[2J"]  clear screen
const getBootSequenceLinesDuration = async () => await getRandomArbitrary(150, 250);
const getLenseRecalibrationLinesDuration = async () => await getRandomArbitrary(200, 250);
const getSyncingAudioLinesDuration = async () => await getRandomArbitrary(100, 150);
const lenseCalibrationSequenceAnimation = [
    ...(await repeatSequence([
        ["Recalibrating lens matrices.", "normal", 0, await getLenseRecalibrationLinesDuration()],
        ["Recalibrating lens matrices..", "normal", 0, await getLenseRecalibrationLinesDuration()],
        ["Recalibrating lens matrices...", "normal", 0, await getLenseRecalibrationLinesDuration()],
    ], await getRandomArbitrary(2, 4))) as PrintLines,
    ...(Math.random() < 0.5
        ? [
            ["Recalibrating lens matrices...", "normal", 0, await getLenseRecalibrationLinesDuration()],
        ]
        : [
            ["Recalibrating lens matrices...", "normal", 0, await getLenseRecalibrationLinesDuration()],
            ["Recalibrating lens matrices.", "normal", 0, await getLenseRecalibrationLinesDuration()],
            ["Recalibrating lens matrices..", "normal", 0, await getLenseRecalibrationLinesDuration()],
        ]) as PrintLines,
]
const audioSyncSequenceAnimation = [
    ...(await repeatSequence([
        ["Syncing audio channels.", "normal", 0, await getSyncingAudioLinesDuration()],
        ["Syncing audio channels..", "normal", 0, await getSyncingAudioLinesDuration()],
        ["Syncing audio channels...", "normal", 0, await getSyncingAudioLinesDuration()],
    ], await getRandomArbitrary(2, 4))) as PrintLines,
    ...(Math.random() < 0.5
        ? [
            ["Syncing audio channels...", "normal", 0, await getSyncingAudioLinesDuration()],
        ]
        : [
            ["Syncing audio channels...", "normal", 0, await getSyncingAudioLinesDuration()],
            ["Syncing audio channels.", "normal", 0, await getSyncingAudioLinesDuration()],
            ["Syncing audio channels..", "normal", 0, await getSyncingAudioLinesDuration()],
        ]) as PrintLines,
]
const loadBalancingSequenceAnimation = [
    ...(await repeatSequence([
        ["Calculating load balancer.", "normal", 0, await getSyncingAudioLinesDuration()],
        ["Calculating load balancer..", "normal", 0, await getSyncingAudioLinesDuration()],
        ["Calculating load balancer...", "normal", 0, await getSyncingAudioLinesDuration()],
    ], await getRandomArbitrary(2, 4))) as PrintLines,
    ...(Math.random() < 0.5
        ? [
            ["Calculating load balancer...", "normal", 0, await getSyncingAudioLinesDuration()],
        ]
        : [
            ["Calculating load balancer...", "normal", 0, await getSyncingAudioLinesDuration()],
            ["Calculating load balancer.", "normal", 0, await getSyncingAudioLinesDuration()],
            ["Calculating load balancer..", "normal", 0, await getSyncingAudioLinesDuration()],
        ]) as PrintLines,
]
export const introMessages: PrintLines = [
    ["\x1b[2J"],
    ["**************************************************", "success", 0],
    [" SECURE-CAM CLI v4.05 - HARDENED OVERRIDE ", "success", 0],
    ["**************************************************", "success", 500],
    ...(await repeatSequence([
        ["Booting surveillance cores.", "normal", 0, await getBootSequenceLinesDuration()],
        ["Booting surveillance cores..", "normal", 0, await getBootSequenceLinesDuration()],
        ["Booting surveillance cores...", "normal", 0, await getBootSequenceLinesDuration()],
    ], await getRandomArbitrary(4, 5))) as PrintLines,
    ...(Math.random() < 0.5
        ? [
            ["Booting surveillance cores...", "normal", 0, await getBootSequenceLinesDuration()],
            ["Booting surveillance cores.", "normal", 0, await getBootSequenceLinesDuration()],
            ["Booting surveillance cores..", "normal", 0, await getBootSequenceLinesDuration()],
            ["Booting surveillance cores...", "normal", 0, await getBootSequenceLinesDuration()],
        ]
        : [
            ["Booting surveillance cores...", "normal", 0, await getBootSequenceLinesDuration()],
            ["Booting surveillance cores.", "normal", 0, await getBootSequenceLinesDuration()],
        ]) as PrintLines,

    ["CCTV System Status: ", "success", 0, await getRandomArbitrary(600, 1000)],
    ["CCTV System Status: LOCKED", "error", 50],

    ["Main feed: ", "normal", 0, await getRandomArbitrary(600, 1000)],
    ["Main feed: ENCRYPTED BY ADMIN", "error", 500],

    ...lenseCalibrationSequenceAnimation,
    ["[ERROR] Lense matrices recalibration: FAILED", "error", await getLenseRecalibrationLinesDuration()],
    ...audioSyncSequenceAnimation,
    ["[ERROR] Audio channels syncing: FAILED", "error", await getSyncingAudioLinesDuration()],

    ...(await repeatSequence([
        ["Initiating cognitive verification protocols.", "normal", 1, 200],
        ["Initiating cognitive verification protocols..", "normal", 1, 200],
        ["Initiating cognitive verification protocols...", "normal", 1, 200],
    ], await getRandomArbitrary(1, 2))) as PrintLines,
    ["Initiating cognitive verification protocols.", "normal", 1, 200],
    ["Initiating cognitive verification protocols..", "normal", 1, 200],
    ...(Math.random() < 0.5
        ? [
            ["Initiating cognitive verification protocols...", "normal", 1, 700],
            ["Initiating cognitive verification protocols.", "normal", 1, 700],
            ["Initiating cognitive verification protocols..", "normal", 1, 700],
        ]
        : [
            ["Initiating cognitive verification protocols..", "normal", 1, 700],
            ["Initiating cognitive verification protocols...", "normal", 1, 700],
            ["Initiating cognitive verification protocols.", "normal", 1, 700],
        ]) as PrintLines,
];

export const finishedMessages: PrintLines = [
    ["\x1b[2J"],
    ["**************************************************", "success", 0],
    [" SYSTEM REPAIRED ", "success", 0],
    ["**************************************************", "success", 500],
    ["C", "success", 0, 10],
    ["Co", "success", 0, 10],
    ["Cog", "success", 0, 50],
    ["Cogn", "success", 0, 50],
    ["Cogni", "success", 0, 50],
    ["Cognit", "success", 0, 50],
    ["Cogniti", "success", 0, 50],
    ["Cognitiv", "success", 0, 50],
    ["Cognitive", "success", 0, 50],
    ["Cognitive ", "success", 0, 50],
    ["Cognitive v", "success", 0, 50],
    ["Cognitive ve", "success", 0, 50],
    ["Cognitive ver", "success", 0, 50],
    ["Cognitive veri", "success", 0, 50],
    ["Cognitive verif", "success", 0, 50],
    ["Cognitive verifi", "success", 0, 50],
    ["Cognitive verific", "success", 0, 50],
    ["Cognitive verifica", "success", 0, 50],
    ["Cognitive verificat", "success", 0, 50],
    ["Cognitive verificati", "success", 0, 50],
    ["Cognitive verificatio", "success", 0, 50],
    ["Cognitive verification", "success", 0, 50],
    ["Cognitive verification ", "success", 0, 50],
    ["Cognitive verification p", "success", 0, 50],
    ["Cognitive verification pa", "success", 0, 50],
    ["Cognitive verification pas", "success", 0, 50],
    ["Cognitive verification pass", "success", 0, 50],
    ["Cognitive verification passe", "success", 0, 50],
    ["Cognitive verification passed", "success", 0, 50],
    ["Cognitive verification passed.", "success", 500],
    ["Main Hub Status:", "success", 0, await getRandomArbitrary(400, 600)],
    ["Main Hub Status: SECURE", "success", 500],
    ["All security feeds are now fully operational.", "success", 50],
    ["Welcome back, ", "success", 0, 50],
    ["Welcome back, M", "success", 0, 50],
    ["Welcome back, Ma", "success", 0, 50],
    ["Welcome back, Mas", "success", 0, 50],
    ["Welcome back, Mast", "success", 0, 50],
    ["Welcome back, Maste", "success", 0, 50],
    ["Welcome back, Master", "success", 0, 50],
    ["Welcome back, Masterm", "success", 0, 50],
    ["Welcome back, Mastermi", "success", 0, 50],
    ["Welcome back, Mastermin", "success", 0, 50],
    ["Welcome back, Mastermind", "success", 0, 50],
    ["Welcome back, Mastermind.", "success", 50],
];

export const lockedOutMessage: PrintLines = [
    ["\x1b[2J"],
    ["**************************************************", "error", 50],
    [" ACCESS DENIED - CLIENT TERMINATED ", "error", 50],
    ["**************************************************", "error", 50],
    ["Cognitive verification failed.", "error", 50],
    ["Main Hub Status:", "normal", 0, await getRandomArbitrary(600, 1000)],
    ["Main Hub Status: LOCKED", "error", 50],
];

export const questions: FullQuestion[] = [
    {
        questionMsg: [
            ["\x1b[2J"],
            ["==================================================", "normal", 50],
            ["STEP 1: MATRIX SEQUENCING ", "normal", 50],
            ["==================================================", "normal", 100],
            ["The camera alignment matrix follows a specific mathematical pattern.", "normal", 50],
            ["Analyze the sector coordinates to find the next variable.", "normal", 50],
            ["Sequence: ", "normal", 0, 100],
            ["Sequence: 2", "normal", 0, 100],
            ["Sequence: 2,", "normal", 0, 100],
            ["Sequence: 2, ", "normal", 0, 100],
            ["Sequence: 2, 6", "normal", 0, 100],
            ["Sequence: 2, 6,", "normal", 0, 100],
            ["Sequence: 2, 6, ", "normal", 0, 100],
            ["Sequence: 2, 6, 12", "normal", 0, 100],
            ["Sequence: 2, 6, 12,", "normal", 0, 100],
            ["Sequence: 2, 6, 12, ", "normal", 0, 100],
            ["Sequence: 2, 6, 12, 20", "normal", 0, 100],
            ["Sequence: 2, 6, 12, 20,", "normal", 0, 100],
            ["Sequence: 2, 6, 12, 20, ", "normal", 0, 100],
            ["Sequence: 2, 6, 12, 20, 30", "normal", 0, 100],
            ["Sequence: 2, 6, 12, 20, 30,", "normal", 0, 100],
            ["Sequence: 2, 6, 12, 20, 30, ", "normal", 0, 100],
            ["Sequence: 2, 6, 12, 20, 30, [?]", "normal", 500],
            ["Enter the missing coordinate:", "normal"],
        ],
        answer: "42",
        correctMsg: [
            ...lenseCalibrationSequenceAnimation,
            ["[SUCCESS] Matrix aligned. Sector parameters accepted.", "success", 1500],
        ],
        incorrectMsg: [
            ...lenseCalibrationSequenceAnimation,
            ["[ERROR] Alignment failed. Invalid sequence parameter. Try again.", "error"],
        ],
        attemptsBeforeHint: 2,
        hint: [
            ["[HINT] The distance between each step is expanding at a constant, even rate.", "hint", 0, 2000],
        ],
        attemptslockout: 3,
    },
    {
        questionMsg: [
            ["\x1b[2J"],
            ["==================================================", "normal", 50],
            ["STEP 2: BIOMETRIC CIPHER ", "normal", 50],
            ["==================================================", "normal", 100],
            ["The audio-visual sync requires a lateral logic bypass.", "normal", 50],
            ["Identify the next letter in the security sequence:", "normal", 50],
            ["Sequence: ", "normal", 0, 100],
            ["Sequence: O", "normal", 0, 100],
            ["Sequence: O,", "normal", 0, 100],
            ["Sequence: O, ", "normal", 0, 100],
            ["Sequence: O, T", "normal", 0, 100],
            ["Sequence: O, T,", "normal", 0, 100],
            ["Sequence: O, T, ", "normal", 0, 100],
            ["Sequence: O, T, T", "normal", 0, 100],
            ["Sequence: O, T, T,", "normal", 0, 100],
            ["Sequence: O, T, T, ", "normal", 0, 100],
            ["Sequence: O, T, T, F", "normal", 0, 100],
            ["Sequence: O, T, T, F,", "normal", 0, 100],
            ["Sequence: O, T, T, F, ", "normal", 0, 100],
            ["Sequence: O, T, T, F, F", "normal", 0, 100],
            ["Sequence: O, T, T, F, F,", "normal", 0, 100],
            ["Sequence: O, T, T, F, F, ", "normal", 0, 100],
            ["Sequence: O, T, T, F, F, S", "normal", 0, 100],
            ["Sequence: O, T, T, F, F, S,", "normal", 0, 100],
            ["Sequence: O, T, T, F, F, S, ", "normal", 0, 100],
            ["Sequence: O, T, T, F, F, S, S", "normal", 0, 100],
            ["Sequence: O, T, T, F, F, S, S,", "normal", 0, 100],
            ["Sequence: O, T, T, F, F, S, S, ", "normal", 0, 100],
            ["Sequence: O, T, T, F, F, S, S, E", "normal", 0, 100],
            ["Sequence: O, T, T, F, F, S, S, E,", "normal", 0, 100],
            ["Sequence: O, T, T, F, F, S, S, E, ", "normal", 0, 100],
            ["Sequence: O, T, T, F, F, S, S, E, N", "normal", 0, 100],
            ["Sequence: O, T, T, F, F, S, S, E, N,", "normal", 0, 100],
            ["Sequence: O, T, T, F, F, S, S, E, N, ", "normal", 0, 100],
            ["Sequence: O, T, T, F, F, S, S, E, N, [?]", "normal", 500],
            ["Enter the missing letter:", "normal"],
        ],
        answer: "T",
        correctMsg: [
            ...audioSyncSequenceAnimation,
            ["[SUCCESS] Lateral cipher solved. Audio-visual sync complete.", "success", 1500],
        ],
        incorrectMsg: [
            ...audioSyncSequenceAnimation,
            ["[ERROR] Cipher mismatch. Access denied. Try again.", "error"],
        ],
        attemptsBeforeHint: 2,
        hint: [
            ["[HINT] Stop looking for an alphabet pattern. You've known this sequence since kindergarten.", "hint", 0, 2000],
        ],
        attemptslockout: 4,
    },
    {
        questionMsg: [
            ["\x1b[2J"],
            ["==================================================", "normal", 50],
            ["STEP 3: SERVER LOAD BALANCING ", "normal", 50],
            ["==================================================", "normal", 100],
            ["The central hub requires an efficiency calculation to be performed.", "normal", 50],
            ["Read the scenario carefully:", "normal", 50],
            ["If 5 backup servers take 5 minutes to process 5 terabytes of video,", "normal", 50],
            ["how many minutes will it take 100 backup servers to process 100 terabytes?", "normal", 50],
        ],
        answer: "5",
        incorrectMsg: [
            ...loadBalancingSequenceAnimation,
            ["[ERROR] Logic flaw detected in calculation. Try again.", "error"],
        ],
        correctMsg: [
            ...loadBalancingSequenceAnimation,
            ["[SUCCESS] Server Load balanced. Processing efficiency at maximum.", "success", 1500],
        ],
        attemptsBeforeHint: 1,
        hint: [
            ["[HINT] Scaling the workforce and the workload at the exact same ratio leaves the clock untouched.", "hint", 0, 2000],
        ],
        attemptslockout: 5,
    }
];
