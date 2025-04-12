import { Pile } from './Pile';

export interface Cell {
  pile?: Pile;
}

class CellImpl implements Cell {
  constructor(public pile: Pile) {}
}

export const createEmpty = () => create(null);
export const create = (pile: Pile) => new CellImpl(pile);
