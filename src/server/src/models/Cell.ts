import { Pile } from './Pile';
import * as pileFactory from './Pile';

export interface Cell {
  pile?: Pile;
}

class CellImpl implements Cell {
  constructor(public pile: Pile = null) {}
}
