import { Simulator } from 'src/enum/simulator.enum';

export interface Reward {
  simulator?: Simulator;
  rate: number;
  points: number;
}
