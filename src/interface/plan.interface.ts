import { PlanType } from 'src/enum/plan.enum';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  maxMembers: number;
}
