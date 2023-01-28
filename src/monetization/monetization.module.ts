import { Module } from '@nestjs/common';
import { MonetizationController } from './monetization.controller';
import { MonetizationService } from './monetization.service';

@Module({
  controllers: [MonetizationController],
  providers: [MonetizationService],
})
export class MonetizationModule {}
