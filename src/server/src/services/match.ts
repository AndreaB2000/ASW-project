export function newMatch(player1: string, player2: string, creationDate: Date) {
  const newMatchID = repository.createMatch(player1, player2, creationDate);
  return newMatchID;
}
