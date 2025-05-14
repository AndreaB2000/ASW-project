import { createMatchIfPossible } from "./matchmaking";

const MATCHMAKING_ROUTINE_INTERVAL = 5000;

/**
 * Starts the server routines.
 */
export const startRoutines = () => {
    setRoutine(createMatchIfPossible, MATCHMAKING_ROUTINE_INTERVAL);
}

/**
 * Sets a routine to run at a specified interval.
 * @param task The task to run.
 * @param interval The interval in milliseconds.
 */
export const setRoutine = (task: () => Promise<void>, interval: number) => {
    setInterval(async () => {
        await task();
    }, interval);
};