import { Plan } from 'src/interface/plan.interface';
import { PlanType } from 'src/enum/plan.enum';

const Plans: Record<PlanType, Plan> = {
  [PlanType.FREE]: {
    id: PlanType.FREE,
    name: 'Free',
    price: 0,
    maxMembers: 50,
  },
  [PlanType.BASIC]: {
    id: PlanType.BASIC,
    name: 'Basic',
    price: 2000,
    maxMembers: 100,
  },
  [PlanType.PREMIUM]: {
    id: PlanType.PREMIUM,
    name: 'Premium',
    price: 5000,
    maxMembers: 200,
  },
  [PlanType.ENTERPRISE]: {
    id: PlanType.ENTERPRISE,
    name: 'Enterprise',
    price: 10000,
    maxMembers: 500,
  },
};

export default Plans;
