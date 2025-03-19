import Match, { MatchDocument, Move, BoardState } from '../models/Match';

class MatchRepository {
  /**
   * Trova tutte le partite
   * @returns {Promise<MatchDocument[]>} - Lista di tutte le partite
   */
  async findAll(): Promise<MatchDocument[]> {
    return await Match.find();
  }

  /**
   * Trova una partita per ID
   * @param {string} id - ID della partita
   * @returns {Promise<MatchDocument | null>} - Partita trovata
   */
  async findById(id: string): Promise<MatchDocument | null> {
    return await Match.findById(id);
  }

  /**
   * Crea una nuova partita
   * @param {Object} matchData - Dati della partita (es. { players: ["Alice", "Bob"], initialState: [...] })
   * @returns {Promise<MatchDocument>} - Partita creata
   */
  async create(matchData: { players: string[]; initialState: BoardState }): Promise<MatchDocument> {
    const match = new Match(matchData);
    return await match.save();
  }

  /**
   * Aggiunge una mossa a una partita esistente
   * @param {string} id - ID della partita
   * @param {Move} move - Dati della mossa (es. { player: "Alice", grainPlaced: { x: 2, y: 3 }, newState: [...] })
   * @returns {Promise<MatchDocument | null>} - Partita aggiornata
   */
  async addMove(id: string, move: Move): Promise<MatchDocument | null> {
    return await Match.findByIdAndUpdate(
      id,
      { $push: { moves: move } }, // Aggiunge la mossa all'array `moves`
      { new: true }, // Restituisce il documento aggiornato
    );
  }

  /**
   * Elimina una partita
   * @param {string} id - ID della partita
   * @returns {Promise<MatchDocument | null>} - Partita eliminata
   */
  async delete(id: string): Promise<MatchDocument | null> {
    return await Match.findByIdAndDelete(id);
  }

  /**
   * Ottiene l'ultimo stato della scacchiera di una partita
   * @param {string} id - ID della partita
   * @returns {Promise<BoardState | null>} - Ultimo stato della scacchiera
   */
  async getLatestBoardState(id: string): Promise<BoardState | null> {
    const match = await Match.findById(id);
    if (!match || match.moves.length === 0) {
      return match ? match.initialState : null; // Restituisce lo stato iniziale se non ci sono mosse
    }
    return match.moves[match.moves.length - 1].newState; // Restituisce l'ultimo stato
  }

  /**
   * Ottiene tutte le mosse di una partita
   * @param {string} id - ID della partita
   * @returns {Promise<Move[] | null>} - Lista delle mosse
   */
  async getMoves(id: string): Promise<Move[] | null> {
    const match = await Match.findById(id);
    return match ? match.moves : null;
  }

  /**
   * Ottiene lo stato iniziale della scacchiera di una partita
   * @param {string} id - ID della partita
   * @returns {Promise<BoardState | null>} - Stato iniziale della scacchiera
   */
  async getInitialBoardState(id: string): Promise<BoardState | null> {
    const match = await Match.findById(id);
    return match ? match.initialState : null;
  }
}

export default new MatchRepository();
