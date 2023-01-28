import { Module } from '@nestjs/common';
import { MonetizationController } from './monetization.controller';
import { UsersModule } from 'src/users/users.module';
import { RewardService } from './service/reward.service';
import { MonetizationService } from './service/monetization.service';

@Module({
  imports: [UsersModule],
  controllers: [MonetizationController],
  providers: [MonetizationService, RewardService],
  exports: [RewardService],
})
export class MonetizationModule {}
