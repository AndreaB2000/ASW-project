import MatchRepository from '../repositories/MatchRepository';
import { BoardState, MatchDocument, Move } from '../models/Match';

class MatchService {
  /**
   * Stato iniziale predeterminato della scacchiera
   */
  private DEFAULT_INITIAL_STATE(player1: string, player2: string): BoardState {
    return [
      [{}, { pile: { grains: 1, owner: player1 } }, {}],
      [{}, {}, {}],
      [{}, { pile: { grains: 1, owner: player2 } }, {}],
    ];
  }

  /**
   * Crea una nuova partita con uno stato iniziale predeterminato
   * @param {string[]} players - Lista dei giocatori (es. ["Alice", "Bob"])
   * @returns {Promise<MatchDocument>} - Partita creata
   */
  async createMatch(players: string[]): Promise<MatchDocument> {
    if (players.length !== 2) {
      throw new Error('Una partita richiede esattamente due giocatori.');
    }

    const matchData = {
      players,
      initialState: this.DEFAULT_INITIAL_STATE(players[0], players[1]),
    };

    return await MatchRepository.create(matchData);
  }

  /**
   * Aggiunge una mossa a una partita esistente
   * @param {string} matchId - ID della partita
   * @param {Move} move - Dati della mossa (es. { player: "Alice", grainPlaced: { x: 2, y: 3 }, newState: [...] })
   * @returns {Promise<MatchDocument | null>} - Partita aggiornata
   */
  async addMove(matchId: string, move: Move): Promise<MatchDocument | null> {
    return await MatchRepository.addMove(matchId, move);
  }

  /**
   * Visualizza le partite giocate da un certo giocatore
   * @param {string} player - Nome del giocatore
   * @returns {Promise<MatchDocument[]>} - Lista delle partite giocate dal giocatore
   */
  async getMatchesByPlayer(player: string): Promise<MatchDocument[]> {
    const allMatches = await MatchRepository.findAll();
    return allMatches.filter((match: MatchDocument) => match.players.includes(player));
  }
}

export default new MatchService();
