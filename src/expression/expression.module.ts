import { Module } from '@nestjs/common';
import { ExpressionController } from './expression.controller';
import { ExpressionService } from './expression.service';
import { MonetizationModule } from 'src/monetization/monetization.module';

@Module({
  imports: [MonetizationModule],
  controllers: [ExpressionController],
  providers: [ExpressionService],
})
export class ExpressionModule {}
