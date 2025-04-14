import { Pile } from './Pile';
import * as pileFactory from './Pile';

export interface Cell {
  /**
   * The pile contained in the cell.
   */
  pile?: Pile;

  /**
   * Adds a grain and claims the pile.
   *
   * @param player the player who is adding the grain.
   */
  addGrain(player: string): void;

  /**
   * If the cell contains a pile with 4 grains, the pile is deleted, if the pile
   * contains more than 4 grains, 4 grains are removed and the remaining are
   * left.
   */
  collapse(): void;
}

class CellImpl implements Cell {
  constructor(public pile: Pile) {}

  addGrain(player: string): void {
    if (this.pile == null) {
      // If the pile does not exist, it creates it
      this.pile = pileFactory.create(player, 1);
    } else {
      // Else, the number of grains is incremented
      this.pile.numberOfGrains++;
      this.pile.owner = player;
    }
  }

  collapse(): void {
    if (this.pile != null) {
      if (this.pile.numberOfGrains > 4) {
        this.pile.numberOfGrains = this.pile.numberOfGrains - 4;
      } else if (this.pile.numberOfGrains == 4) {
        this.pile = null;
      }
    }
  }
}

export const createEmpty = () => create(null);
export const create = (pile: Pile) => new CellImpl(pile);
