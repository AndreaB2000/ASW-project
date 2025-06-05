import { Socket } from "socket.io/dist";
import { removePlayerSocket } from "./socket";
import { getCandidate } from "../repositories/matchmakingQueue";
import { removeCandidate } from "../repositories/matchmakingQueue";

export const disconnect = async (socket: Socket): Promise<void> => {
  const username = socket.data.username;
  if (username) {
    console.log(`User ${username} disconnected`);
    removePlayerSocket(username);
    const candidate = await getCandidate(username);
    if (candidate) await removeCandidate(candidate);
  }
}