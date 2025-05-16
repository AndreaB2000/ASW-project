import { Board } from "../models/Board";
import { queryPrologEngine } from "../prolog/tau-prolog";

export const getMove = async (board: Board): Promise<string[]> => {
    const person = "mary"
    const goal = 'likes(' + person + ', X).';

    try {
        const result = await queryPrologEngine(goal);
        console.log("Prolog result:", result);
        return result;
    } catch (error) {
        console.error("Error querying Prolog:", error);
        return ["default_move"];
    }
};