import { Simulator } from 'src/enum/simulator.enum';

export interface Monetization {
  ignoreSimulators: Array<Simulator>;
  factor: number;
}
